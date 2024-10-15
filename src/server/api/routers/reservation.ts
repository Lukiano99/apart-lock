import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CustomerReservationSchema } from "@/schemas/reservation";
import { z } from "zod";
import { PaymentSchema } from "@/schemas/payment";
import { generateCode } from "@/utils/confirmation-key";

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
    .input(
      CustomerReservationSchema.extend({
        test: z.string(),
      })
    )
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
          customerId: customer.id,
          roomId: input.roomId,
          createdAt: {
            lt: new Date(),
          },
        },
      });

      if (reservation) {
        throw new TRPCError({
          message: "Rezervacija vec postoji",
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

  updatePaymentMethod: publicProcedure
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
          status: input.payment === "CARD" ? "CONFIRMED" : "PENDING",
        },
      });

      let confirmationKey;

      if (input.payment === "CARD") {
        const expiresAt = new Date(updatedReservation.check_out as Date);
        expiresAt.setHours(10, 0, 0, 0); // Postavlja vreme na 10:00h

        confirmationKey = await ctx.db.confirmationKey.create({
          data: {
            reservationId: input.reservationId,
            key: generateCode(),
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

      return {
        updatedReservation,
        confirmationKey:
          input.payment === "CARD" && confirmationKey && confirmationKey.key,
      };
    }),
});
