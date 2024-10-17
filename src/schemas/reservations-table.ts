import { ReservationStatus } from "@prisma/client";
import * as z from "zod";

export type IReservationFilters = z.infer<typeof ReservationssFiltersSchema>;

export const ReservationssFiltersSchema = z.object({
  name: z.string(),
  status: z.string(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
});

export type IReservationItem = z.infer<typeof ReservationssItemSchema>;

export const ReservationssItemSchema = z.object({
  id: z.string(),
  apartment: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  created_at: z.date().nullable(),
  check_in: z.date().nullable(),
  check_out: z.date().nullable(),
  status: z.string(),
  confirmationKey: z.string(),
});
