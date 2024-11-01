import * as z from "zod";

export type SendEmailType = z.infer<typeof EmailSchema>;

export const EmailSchema = z.object({
  to: z.array(z.string().email()),
  password: z.string().length(7),
  customerName: z.string().min(1),
  customerId: z.string().min(1),
  reservationId: z.string().min(1),
  createdAt: z.date(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  price: z.number().min(10),
});
