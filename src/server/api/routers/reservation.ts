import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CustomerReservationSchema } from "@/schemas/reservation";

export const reservationRouter = createTRPCRouter({
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
          message: "Reservation already exists",
          code: "BAD_REQUEST",
        });
      }

      reservation = await ctx.db.reservation.create({
        data: {
          customerId: customer.id,
          roomId: input.roomId,
          paymentMethod: input.paymentMethod,
          createdAt: new Date(),
          status: "PENDING",
        },
      });
    }),
});
