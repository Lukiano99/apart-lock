import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        customerId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({
        where: {
          id: input.customerId,
        },
      });

      return customer;
    }),
});
