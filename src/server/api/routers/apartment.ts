import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  ApartmentsFiltersSchema,
  NewApartmentSchema,
} from "@/schemas/apartment";
import { TRPCError } from "@trpc/server";

export const apartmentRouter = createTRPCRouter({
  create: publicProcedure
    .input(NewApartmentSchema)
    .mutation(async ({ ctx, input }) => {
      // Proveri da li već postoji apartman sa istim imenom na istoj lokaciji (opciono)
      const existingApartment = await ctx.db.apartment.findFirst({
        where: {
          name: input.name,
          location: input.location,
        },
      });

      if (existingApartment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Apartman sa istim imenom i lokacijom već postoji.",
        });
      }

      // Kreiraj novi apartman
      const newApartment = await ctx.db.apartment.create({
        data: {
          name: input.name,
          location: input.location,
          price: input.price,
          description: input.description || "", // Opcionalni opis, može biti prazan
          requiresPayment: input.paymentRequired,
          adminId: input.adminId, // ID administratora koji kreira apartman

          // Kreiranje slika
          images: {
            create: input.images.map((imageUrl) => ({
              imageUrl,
            })),
          },

          // Kreiranje servisa (usluga) - ako ih ima
          services: {
            connect: input.services
              ? input.services.map((serviceId) => ({
                  id: Number(serviceId),
                }))
              : undefined,
          },
        },
      });

      return newApartment;
    }),
  update: publicProcedure
    .input(NewApartmentSchema)
    .mutation(async ({ ctx, input }) => {
      // Proveri da li apartman postoji
      const existingApartment = await ctx.db.apartment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingApartment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Apartman koji želite da ažurirate ne postoji.",
        });
      }

      // Proveri da li već postoji apartman sa istim imenom na istoj lokaciji (osveži postojeći, ne menja postojeći apartman)
      const duplicateApartment = await ctx.db.apartment.findFirst({
        where: {
          id: { not: input.id }, // Izuzmi trenutni apartman
          name: input.name,
          location: input.location,
        },
      });

      if (duplicateApartment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Apartman sa istim imenom i lokacijom već postoji.",
        });
      }

      // Ažuriraj postojeći apartman
      const updatedApartment = await ctx.db.apartment.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          location: input.location,
          price: input.price,
          description: input.description || "", // Opcionalni opis, može biti prazan
          requiresPayment: input.paymentRequired,
          adminId: input.adminId, // ID administratora koji ažurira apartman

          // Ažuriranje slika - možeš implementirati logiku za brisanje ili ažuriranje
          images: {
            deleteMany: {}, // Obriši sve postojeće slike (prilagodi prema potrebi)
            create:
              input.images?.map((imageUrl) => ({
                imageUrl,
              })) || [], // Dodaj nove slike
          },

          // Ažuriranje servisa (usluga) - ako ih ima
          services: {
            connect: input.services
              ? input.services.map((serviceId) => ({
                  id: Number(serviceId),
                }))
              : undefined,
          },
        },
      });

      return updatedApartment;
    }),
  list: publicProcedure
    .input(ApartmentsFiltersSchema)
    .query(async ({ ctx, input }) => {
      const availableApartments = await ctx.db.apartment.findMany({
        where: {
          services:
            input.services.length > 0
              ? { some: { name: { in: input.services } } }
              : undefined,

          location: input.location ? input.location : undefined,
          OR: [
            // Apartmani koji nemaju sobe
            { rooms: { none: {} } },
            {
              rooms: {
                some: {
                  bed_count: {
                    gte: input.guests.adults + input.guests.children,
                  },

                  reservations:
                    input.startDate && input.endDate
                      ? {
                          none: {
                            OR: [
                              // Reservation check-in is before the given end date, and reservation check-out is after the given start date
                              {
                                check_in: { lt: input.endDate },
                                check_out: { gt: input.startDate },
                              },
                            ],
                          },
                        }
                      : undefined,
                },
              },
            },
          ],
        },
        include: {
          rooms: true,
          images: true,
          services: true,
        },
      });

      const checkIn = input.startDate?.getTime();
      const checkOut = input.endDate?.getTime();
      const nightsStays =
        checkIn && checkOut
          ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) // Konverzija milisekundi u dane
          : 1; // Ako nema datuma, barem jedna noć

      availableApartments.map(
        (apartment) => (apartment.price = apartment.price * nightsStays)
      );
      return availableApartments;
    }),

  listAdminApartments: publicProcedure
    .input(
      z.object({
        adminId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const adminExists = await ctx.db.admin.findUnique({
        where: {
          id: input.adminId,
        },
      });

      if (!adminExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Administrator sa datim ID-om ne postoji.",
        });
      }

      const apartments = await ctx.db.apartment.findMany({
        where: {
          adminId: input.adminId,
        },
        include: {
          images: true,
          services: true,
          rooms: true,
        },
      });

      return apartments;
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const appartment = ctx.db.apartment.findUnique({
        where: {
          id: input.id,
        },
        include: {
          rooms: {
            include: {
              images: true,
            },
          },
          owner: true,

          images: true,

          services: true,
        },
      });
      return appartment;
    }),
  delete: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(), // ID apartmana koji se briše
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Proveri da li apartman postoji
      const existingApartment = await ctx.db.apartment.findUnique({
        where: {
          id: input.apartmentId,
        },
      });

      if (!existingApartment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Apartman koji želite da obrišete ne postoji.",
        });
      }

      // Obriši apartman i sve povezane slike i usluge
      await ctx.db.apartment.delete({
        where: {
          id: input.apartmentId,
        },
      });

      return {
        message: "Apartman je uspešno obrisan.",
      };
    }),

  addService: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        serviceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const test = await ctx.db.apartment.update({
        where: {
          id: input.apartmentId,
        },
        data: {
          services: {
            set: [
              {
                id: 6,
              },
            ],
          },
        },
      });

      return { test };
    }),
});
