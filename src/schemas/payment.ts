import * as z from "zod";

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;

export const PaymentSchema = z
  .object({
    payment: z.string().min(1, { message: "Payment is required!" }),
    cardId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Ako je način plaćanja "CARD", cardId ne sme biti null

      if (data.payment === "CARD") {
        return data.cardId !== "";
      }
      // Ako je način plaćanja "CASH", cardId može biti null
      return true;
    },
    {
      message: "Dodajte karticu ili izaberite postojeću",
      path: ["cardId"], // Polje koje će prikazati grešku
    }
  );
