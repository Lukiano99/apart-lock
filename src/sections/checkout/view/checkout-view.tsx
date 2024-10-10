"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { CheckoutPayment } from "../checkout-payment";
import { Box, Stack } from "@mui/material";
import { Customer } from "@prisma/client";

// ----------------------------------------------------------------------
interface CheckoutViewProps {
  reservationId: string;
  customer: Customer;
}
export function CheckoutView({ reservationId, customer }: CheckoutViewProps) {
  return (
    <Container sx={{ mb: 10 }}>
      <Stack flexDirection={"row"}>
        <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
          Plaćanje rezervacije
        </Typography>
      </Stack>

      <CheckoutPayment customer={customer} />
    </Container>
  );
}
