import * as z from "zod";

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;

export const PaymentSchema = z.object({
  payment: z.string().min(1, { message: "Payment is required!" }),
  // Not required
  delivery: z.number(),
});
