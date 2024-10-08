import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const apartmentRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        // TODO with dates and pagination
        // dateFrom: z.date(),
        // dateTo: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const apartments = ctx.db.apartment.findMany({
        include: {
          images: true,
        },
        // TODO
        take: 12,
      });
      return apartments;
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

      console.log({ test });
      return { test };
    }),
});
