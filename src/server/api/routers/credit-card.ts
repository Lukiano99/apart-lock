import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CustomerReservationSchema } from "@/schemas/reservation";
import { z } from "zod";
import { CreditCardSchema } from "@/schemas/credit-card";

export const creditCardRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      CreditCardSchema.extend({
        reservationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cardNumber, cardHolder, expirationDate, cvv, reservationId } =
        input;
      // 1. Proveri da li rezervacija postoji
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: reservationId },
        include: { customer: true }, // Uključujemo korisnika
      });

      if (!reservation) {
        throw new TRPCError({
          message: "Rezervacija ne postoji",
          code: "NOT_FOUND",
        });
      }
      console.log("uslo");

      console.log({ reservation });

      // 2. Kreiraj novu kreditnu karticu
      const creditCard = await ctx.db.creditCard.create({
        data: {
          cardNumber,
          cardHolder,
          expirationDate,
          cvv,
          customerId: reservation.customerId, // Povezujemo karticu sa korisnikom iz rezervacije
        },
      });

      // 3. Vraćamo podatke o novoj kreditnoj kartici
      return {
        message: "Kreditna kartica je uspešno kreirana.",
        creditCard,
      };
    }),
  getByReservationId: publicProcedure
    .input(
      z.object({
        reservationId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { reservationId } = input;

      // Pronalaženje rezervacije sa povezanim korisnikom i njegovim kreditnim karticama
      const reservation = await ctx.db.reservation.findUnique({
        where: {
          id: reservationId,
        },
        include: {
          customer: {
            include: {
              CreditCard: true, // Uključujemo sve kreditne kartice korisnika
            },
          },
        },
      });

      // Ako rezervacija nije pronađena, bacamo grešku
      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rezervacija nije pronađena.",
        });
      }

      // Vraćamo sve kreditne kartice korisnika
      return reservation.customer.CreditCard;
    }),
});
