import * as z from "zod";
import { PaymentMethod } from "@prisma/client";

export type CreditCardSchemaType = z.infer<typeof CreditCardSchema>;

export const CreditCardSchema = z.object({
  cardNumber: z
    .string()
    .length(16, { message: "Broj kartice mora sadržati tačno 16 karaktera" })
    .regex(/^\d{16}$/, { message: "Broj kartice mora sadržati samo brojeve" }),
  cardHolder: z
    .string()
    .min(1, { message: "Ime vlasnika kartice je obavezno" }),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Datum isteka mora biti u formatu MM/YY",
    })
    .refine(
      (value) => {
        const [month, year] = value.split("/").map(Number); // Parsiranje meseca i godine
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Poslednje dve cifre godine
        const currentMonth = currentDate.getMonth() + 1; // Meseci su 0-indeksirani, dodajemo 1

        // Provera da li je godina veća ili ako je ista godina, da li je mesec veći ili jednak trenutnom mesecu
        return (
          year > currentYear || (year === currentYear && month >= currentMonth)
        );
      },
      { message: "Datum isteka kartice mora biti u budućnosti" }
    ),
  cvv: z
    .string()
    .length(3, { message: "CVV mora sadržati tačno 3 cifre" }) // Za kartice sa 3-cifrenim CVV
    .regex(/^\d{3,4}$/, { message: "CVV mora sadržati samo brojeve" }),
});
