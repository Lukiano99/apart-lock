"use client";

import { useContext } from "react";
import { ReservationContext } from "./reservation-checkout-provider";

// ----------------------------------------------------------------------

export function useReservationContext() {
  const context = useContext(ReservationContext);

  if (!context)
    throw new Error("useCheckoutContext must be use inside CheckoutProvider");

  return context;
}
