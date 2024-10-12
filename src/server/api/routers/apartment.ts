import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ApartmentsFiltersSchema } from "@/schemas/apartment";

export const apartmentRouter = createTRPCRouter({
  list: publicProcedure
    .input(ApartmentsFiltersSchema)
    .query(async ({ ctx, input }) => {
      const availableApartments = await ctx.db.apartment.findMany({
        where: {
          services:
            input.services.length > 0
              ? { some: { name: { in: input.services } } }
              : undefined,

          location: input.location ? input.location : undefined,

          rooms: {
            some: {
              bed_count: { gte: input.guests.adults + input.guests.children },

              reservations:
                input.startDate && input.endDate
                  ? {
                      none: {
                        OR: [
                          // Reservation check-in is before the given end date, and reservation check-out is after the given start date
                          {
                            check_in: { lt: input.endDate },
                            check_out: { gt: input.startDate },
                          },
                        ],
                      },
                    }
                  : undefined,
            },
          },
        },
        include: {
          rooms: true,
          images: true,
          services: true,
        },
      });

      return availableApartments;
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const appartment = ctx.db.apartment.findUnique({
        where: {
          id: input.id,
        },
        include: {
          rooms: {
            include: {
              images: true,
            },
          },
          owner: true,

          images: true,

          services: true,
        },
      });
      return appartment;
    }),
  addService: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        serviceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const test = await ctx.db.apartment.update({
        where: {
          id: input.apartmentId,
        },
        data: {
          services: {
            set: [
              {
                id: 6,
              },
            ],
          },
        },
      });

      return { test };
    }),
});
