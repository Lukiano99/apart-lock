import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateCode } from "@/utils/confirmation-key";
import {
  sendCanceledReservationThroughGmail,
  sendPasswordThroughGmail,
} from "@/utils/email/email-send";
import { fDuration } from "@/utils/format-time";
import { createTemporaryPassword } from "@/utils/tuya/tuya-util";
import { ReservationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const adminReservationRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        adminId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { adminId } = input;

      // Fetch apartments owned by the admin
      const apartments = await ctx.db.apartment.findMany({
        where: { adminId },
        select: {
          id: true,
        },
      });

      // If no apartments found, return empty array
      if (apartments.length === 0) {
        if (apartments.length === 0) {
          return { reservations: [], totalIncome: 0 };
        }
      }

      // Extract apartment IDs
      const apartmentIds = apartments.map((apartment) => apartment.id);

      // Fetch reservations for those apartments
      const reservations = await ctx.db.reservation.findMany({
        where: {
          Room: {
            apartmentId: {
              in: apartmentIds,
            },
          },
        },
        include: {
          confirmationKey: {
            select: {
              key: true,
            },
          },
          Room: {
            include: {
              images: true,
              apartment: {
                include: {
                  images: true,
                  owner: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
          customer: true, // Include customer details if needed
        },
      });

      // Izračunaj ukupni prihod tako što za svaku rezervaciju pomnožiš cenu sobe sa brojem dana boravka
      const totalIncome = reservations.reduce((sum, reservation) => {
        const checkInDate = new Date(reservation.check_in);
        const checkOutDate = new Date(reservation.check_out);

        // Izračunaj broj dana boravka
        const stayDuration =
          (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24); // broj dana

        // Pomnoži cenu sobe sa dužinom boravka i dodaj u sumu
        if (reservation.status === "CONFIRMED") {
          return sum + reservation.Room.price * stayDuration;
        } else return sum;
      }, 0);

      return { reservations, totalIncome };
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        reservationId: z.string(),
        reservationStatus: z.nativeEnum(ReservationStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { reservationId, reservationStatus } = input;
      console.log({ input });
      // Proveri da li rezervacija postoji
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: reservationId },
        include: {
          customer: true,
          Room: true,
        },
      });

      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rezervacija nije pronađena.",
        });
      }

      // Ažuriraj status rezervacije
      const updatedReservation = await ctx.db.reservation.update({
        where: { id: reservationId },
        data: { status: reservationStatus },
      });

      // Ako je status promenjen na CONFIRMED, kreiraj confirmationKey
      if (reservationStatus === "CONFIRMED") {
        console.log("USAO U CONFIRMED Block");
        // Generiši jedinstveni ključ (može biti nasumičan string ili prema nekoj logici)
        const key = generateCode();
        const data = await createTemporaryPassword({
          password: key,
          customer: reservation.customer.email,
          check_in: reservation.check_in.getTime(),
          check_out: reservation.check_out.getTime(),
        });
        console.log({ data });

        // Proveri da li već postoji confirmationKey za ovu rezervaciju (u slučaju ponovnog update-a)
        let existingKey = await ctx.db.confirmationKey.findUnique({
          where: { id: reservationId },
        });

        // Ako ključ već postoji, ne kreiramo novi
        if (!existingKey) {
          // Kreiraj novi ConfirmationKey zapis
          existingKey = await ctx.db.confirmationKey.create({
            data: {
              key: key,
              reservationId: reservationId,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Ključ važi 7 dana
            },
          });
        }
        console.log({ existingKey });
        const emailResponse = await sendPasswordThroughGmail({
          password: existingKey.key,
          to: [reservation.customer.email],
          customerName: `${reservation.customer.firstName} ${reservation.customer.lastName}`,
          customerId: reservation.customer.id,
          reservationId: reservation.id,
          createdAt: reservation.createdAt,
          checkInDate: reservation.check_in,
          checkOutDate: reservation.check_out,
          price:
            reservation.Room.price *
            fDuration({
              startDate: reservation.check_in,
              endDate: reservation.check_out,
            }),
        });
        console.log({ emailResponse });
      }

      if (reservationStatus === "CANCELLED") {
        const emailResponse = await sendCanceledReservationThroughGmail({
          to: [reservation.customer.email],
        });
        console.log({ emailResponse });
      }

      return updatedReservation; // Vraća ažuriranu rezervaciju
    }),
});
