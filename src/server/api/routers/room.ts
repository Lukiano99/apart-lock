import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const roomRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        // TODO with dates
        // dateFrom: z.date(),
        // dateTo: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const rooms = ctx.db.room.findMany({
        where: {
          apartmentId: input.apartmentId,
        },
        include: {
          reservations: true,
        },
      });

      return rooms;
    }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });

  //   return post ?? null;
  // }),
});
