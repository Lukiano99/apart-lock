"use client";

import { Apartment, Room, Service } from "@prisma/client";
import { ApartmentsContent } from "@/layouts/apartments";
import { Grid } from "@mui/material";
import ReservationOverview from "../reservation-overview";
import { CustomerReservationForm } from "../reservation-form";
import ReservationApartmentOverview from "../reservation-apartment-overview";

// ----------------------------------------------------------------------

interface ReservationViewProps {
  apartment: Apartment & {
    services: Service[];
  };
  room: Room;
}

export function ReservationView({ apartment, room }: ReservationViewProps) {
  return (
    <ApartmentsContent>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          <ReservationApartmentOverview room={room} apartment={apartment} />

          <ReservationOverview room={room} apartment={apartment} />
        </Grid>

        <Grid xs={12} md={8} item>
          <CustomerReservationForm />
        </Grid>
      </Grid>
    </ApartmentsContent>
  );
}
