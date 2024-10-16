import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
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
          Room: {
            include: {
              apartment: {
                include: {
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
        return sum + reservation.Room.price * stayDuration;
      }, 0);

      return { reservations, totalIncome };
    }),
});
