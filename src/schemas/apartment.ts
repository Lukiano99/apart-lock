import { schemaHelper } from "@/components/hook-form/schema-helper";
import * as z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/input";
import { PaymentMethod } from "@prisma/client";
import { IDatePickerControl } from "@/types/common";

export type IApartmentFilters = z.infer<typeof ApartmentsFiltersSchema>;

export const ApartmentsFiltersSchema = z.object({
  location: z.string(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  guests: z.object({
    adults: z.number(),
    children: z.number(),
  }),
  services: z.array(z.string()),
});
