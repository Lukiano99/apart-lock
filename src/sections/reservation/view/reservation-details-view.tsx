"use client";

import { Customer, Reservation, Room, Service } from "@prisma/client";
import { Stack, Typography } from "@mui/material";
import { CheckoutView } from "@/sections/checkout/view";

// ----------------------------------------------------------------------

interface ReservationViewProps {
  reservation: Reservation;
  customer: Customer;
  title?: string;
}

export function ReservationDetailsView({
  reservation,
  customer,
  title,
}: ReservationViewProps) {
  return <CheckoutView reservationId={reservation.id} customer={customer} />;
}
