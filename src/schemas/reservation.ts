import { schemaHelper } from "@/components/hook-form/schema-helper";
import * as z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/input";
import { PaymentMethod } from "@prisma/client";

export type CustomerReservationSchemaType = z.infer<
  typeof CustomerReservationSchema
>;

export const CustomerReservationSchema = z.object({
  firstName: z.string().min(1, { message: "Ime je obavezno!" }),
  lastName: z.string().min(1, { message: "Prezime je obavezno!" }),
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email nije validan!" }),
  phone: schemaHelper.phoneNumber({
    isValidPhoneNumber,
    message: {
      required_error: "Broj telefona je obavezan!",
      invalid_type_error: "Broj telefona nije validan!",
    },
  }),
  roomId: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  check_in: z.date(),
  check_out: z.date(),
  guests: z.object({
    adults: z.number().min(1),
    children: z.number(),
  }),
});
