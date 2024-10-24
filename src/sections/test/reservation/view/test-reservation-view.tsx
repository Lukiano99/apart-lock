"use client";
import { RESERVATION_CHECKOUT_STEPS } from "@/_mock/_reservation";
import { ApartmentsContent } from "@/layouts/apartments";
import { RouterLink } from "@/routes/components";
import { BlankView } from "@/sections/blank/view";
import { CheckoutOrderComplete } from "@/sections/checkout/checkout-order-complete";
import { CheckoutSteps } from "@/sections/checkout/checkout-steps";
import { useCheckoutContext } from "@/sections/checkout/context";
import { varAlpha } from "@/theme/styles";
import { Button, Container, Grid } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

type Props = {
  title?: string;
};
const TestReservationView = ({ title = "Test" }: Props) => {
  const checkout = useCheckoutContext();

  useEffect(() => {
    checkout.initialStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ApartmentsContent maxWidth="xl">
      <Container sx={{ mb: 10 }}>
        <Grid
          container
          justifyContent={checkout.completed ? "center" : "flex-start"}
        >
          <Grid xs={12} md={12}>
            <CheckoutSteps
              activeStep={checkout.activeStep}
              steps={RESERVATION_CHECKOUT_STEPS}
            />
          </Grid>
        </Grid>

        <>
          {checkout.activeStep === 0 && <BlankView title="CheckoutCart" />}

          {checkout.activeStep === 1 && <BlankView title="Customer details" />}

          {checkout.activeStep === 2 && <BlankView title="Finishing" />}

          {checkout.completed && (
            <CheckoutOrderComplete
              open
              onReset={checkout.onReset}
              onDownloadPDF={() => {}}
            />
          )}
        </>
      </Container>
    </ApartmentsContent>
  );
};

export default TestReservationView;
