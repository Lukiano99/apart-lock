import { schemaHelper } from "@/components/hook-form/schema-helper";
import { z as zod } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/input";
import { PaymentMethod } from "@prisma/client";

export type CustomerReservationSchemaType = zod.infer<
  typeof CustomerReservationSchema
>;

export const CustomerReservationSchema = zod.object({
  firstName: zod.string().min(1, { message: "Ime je obavezno!" }),
  lastName: zod.string().min(1, { message: "Prezime je obavezno!" }),
  email: zod
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
  roomId: zod.string(),
  paymentMethod: zod.nativeEnum(PaymentMethod),
});
