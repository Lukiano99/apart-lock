import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const servicesRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.service.findMany();

    return services ?? [];
  }),
});
