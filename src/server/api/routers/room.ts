import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const roomRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
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
  get: publicProcedure
    .input(
      z.object({
        reservationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const room = ctx.db.room.findFirst({
        where: {
          reservations: {
            some: {
              id: input.reservationId,
            },
          },
        },
        include: {
          reservations: true,
        },
      });

      return room;
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
