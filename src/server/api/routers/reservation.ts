import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CustomerReservationSchema } from "@/schemas/reservation";
import { z } from "zod";

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
          // TODO, currently mocked
          check_in: input.check_in,
          check_out: input.check_out,
        },
      });
      return reservation;
    }),
});
