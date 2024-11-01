import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CustomerReservationSchema } from "@/schemas/reservation";
import { z } from "zod";
import { PaymentSchema } from "@/schemas/payment";
import { generateCode } from "@/utils/confirmation-key";
import { emailRouter } from "./email";
import { createTemporaryPassword } from "@/utils/tuya/tuya-util";
import { sendPasswordThroughGmail } from "@/utils/email/email-send";
import { fDuration } from "@/utils/format-time";

export const reservationRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        reservationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservation.findUnique({
        where: {
          id: input.reservationId,
        },
      });

      return reservation;
    }),
  create: publicProcedure
    .input(CustomerReservationSchema)
    .mutation(async ({ ctx, input }) => {
      let customer = await ctx.db.customer.findUnique({
        where: { email: input.email },
      });

      if (!customer) {
        customer = await ctx.db.customer.create({
          data: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      let reservation = await ctx.db.reservation.findFirst({
        where: {
          roomId: input.roomId,
          OR: [
            {
              check_in: {
                lt: input.check_out,
              },
              check_out: {
                gt: input.check_in,
              },
            },
          ],
        },
      });

      if (reservation) {
        throw new TRPCError({
          message: "Rezervacija već postoji za ovaj period",
          code: "BAD_REQUEST",
        });
      }

      reservation = await ctx.db.reservation.create({
        data: {
          customerId: customer.id,
          roomId: input.roomId,
          status: "PENDING",
          check_in: input.check_in,
          check_out: input.check_out,
          adults: input.guests.adults,
          children: input.guests.children,
        },
      });
      return reservation;
    }),

  updateStatus: publicProcedure
    .input(
      PaymentSchema.extend({
        reservationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Ažuriraj status na "PENDING" u bazi podataka za rezervaciju
      const updatedReservation = await ctx.db.reservation.update({
        where: { id: input.reservationId },
        data: {
          paymentMethod: input.payment,
          status:
            input.payment === "CARD"
              ? "CONFIRMED"
              : input.payment === "CASH"
                ? "AWAITING_CONFIRMATION"
                : "PENDING",
        },
      });

      let confirmationKey;
      const reservation = await ctx.db.reservation.findFirst({
        where: {
          id: input.reservationId,
        },
        include: {
          customer: true,
          Room: true,
        },
      });
      if (!reservation || !reservation.customer) {
        throw new TRPCError({
          message: "Greska u kreiranju rezervacije",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (input.payment === "CARD") {
        const expiresAt = new Date(updatedReservation.check_out as Date);
        expiresAt.setHours(10, 0, 0, 0); // Postavlja vreme na 10:00h
        const key = generateCode();
        const data = await createTemporaryPassword({
          password: key,
          customer: reservation?.customer.email,
          check_in: reservation.check_in.getTime(),
          check_out: reservation.check_out.getTime(),
        });

        console.log({ data });
        if (!data.success) {
          throw new TRPCError({
            message: `Tuya creating password error. ${data.message ?? ""}`,
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        confirmationKey = await ctx.db.confirmationKey.create({
          data: {
            reservationId: input.reservationId,
            key: key,
            expiresAt: expiresAt,
            createdAt: new Date(),
          },
        });
      }
      if (input.payment === "CARD" && !confirmationKey) {
        throw new TRPCError({
          message: "Greska u kreiranju ConfirmationKey",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (!confirmationKey) {
        throw new TRPCError({
          message: "Greska u confirmation key-u",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      // Izračunavanje cene
      const checkInDate = new Date(reservation.check_in);
      const checkOutDate = new Date(reservation.check_out);

      // Računanje broja noći
      const numberOfNights = fDuration({
        startDate: checkInDate,
        endDate: checkOutDate,
      });

      // Ukupna cena
      const price = numberOfNights * reservation.Room.price;
      sendPasswordThroughGmail({
        password: confirmationKey.key,
        to: [reservation.customer.email],
        customerName: `${reservation.customer.firstName} ${reservation.customer.lastName}`,
        customerId: reservation.customer.id,
        reservationId: reservation.id,
        createdAt: reservation.createdAt,
        checkInDate: reservation.check_in,
        checkOutDate: reservation.check_out,
        price: price,
      });

      return {
        updatedReservation,
        confirmationKey:
          input.payment === "CARD" && confirmationKey && confirmationKey.key,
      };
    }),
});
