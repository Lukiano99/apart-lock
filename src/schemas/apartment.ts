import { schemaHelper } from "@/components/hook-form/schema-helper";
import * as z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/input";
import { IDatePickerControl } from "@/types/common";
import { fIsAfter } from "@/utils/format-time";

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

//---------------------------------------------------------------------

export type NewApartmentSchemaType = z.infer<typeof NewApartmentSchema>;
export type IApartmentItem = z.infer<typeof NewApartmentSchema>;

export const NewApartmentSchema = z.object({
  name: z.string().min(1, { message: "Naziv apartmana je obavezan!" }),
  location: z.string().min(1, {
    message: "Lokacija je obavezana",
  }),
  description: schemaHelper.editor({
    message: { required_error: "Opis je obavezan" },
  }),
  price: z
    .number()
    .min(10, { message: "Cena noćenja ne može biti manja od €10.00" }),
  paymentRequired: z.boolean(),
  services: z.array(z.string()).optional(),
  images: z.array(z.string()).min(3, {
    message: "Morate izabrati minimum 3 slike",
  }),
  adminId: z.string().uuid(),
  // images: schemaHelper
  //   .files({
  //     message: { required_error: "Slike su obavezne" },
  //   })
  //   .optional(),
});
