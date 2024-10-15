import type {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
} from "src/types/checkout";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { Form } from "src/components/hook-form";

import { CheckoutPaymentMethods } from "./checkout-payment-methods";
import { CheckoutSummary } from "./checkout-summary";
import { CheckoutBillingInfo } from "./checkout-billing-info";
import { checkout } from "@/_mock";
import { Customer, PaymentMethod } from "@prisma/client";
import { PaymentSchema, PaymentSchemaType } from "@/schemas/payment";
import { useState } from "react";
import { toast } from "@/components/snackbar";
import { CheckoutOrderComplete } from "./checkout-order-complete";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { EmptyContent } from "@/components/empty-content";
import { fDuration } from "@/utils/format-time";
import { SplashScreen } from "@/components/loading-screen";

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  {
    value: PaymentMethod.CARD,
    label: "Visa / Master kartica",
    description: "Podržavamo plaćanje Visa i Matercard karticama.",
  },
  {
    value: PaymentMethod.CASH,
    label: "Gotovina",
    description: "Platite po dolasku u smeštaj.",
  },
];

const CARD_OPTIONS: ICheckoutCardOption[] = [
  { value: "visa1", label: "**** **** **** 1212 - Jimmy Holland" },
  { value: "visa2", label: "**** **** **** 2424 - Shawn Stokes" },
  { value: "mastercard", label: "**** **** **** 4545 - Cole Armstrong" },
];

// ----------------------------------------------------------------------

interface CheckoutPaymentProps {
  customer: Customer;
}
export function CheckoutPayment({ customer }: CheckoutPaymentProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const { reservationId } = useParams();

  const methods = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      payment: "",
      cardId: "",
    },
  });

  const { data: room, isPending } = api.room.get.useQuery({
    reservationId: reservationId ? reservationId.toString() : "",
  });

  if (isPending) {
    return <SplashScreen />;
  }
  if (!room) {
    return <EmptyContent title="Rezervacija za ovu sobu nije pronadjena" />;
  }

  const durationNights = fDuration({
    startDate: room.reservations[0].check_in,
    endDate: room.reservations[0].check_out,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data: PaymentSchemaType) => {
    toast.success("Uspesno!");
    setIsCompleted(true);
  });

  return (
    <>
      {!isCompleted && (
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <CheckoutPaymentMethods
                name="payment"
                options={{
                  cards: CARD_OPTIONS,
                  payments: PAYMENT_OPTIONS,
                }}
              />
            </Grid>

            <Grid xs={12} md={4}>
              <CheckoutBillingInfo
                customer={customer}
                onBackStep={checkout.onBackStep}
              />

              <CheckoutSummary
                total={room.price * durationNights}
                subtotal={room.price}
                quantity={durationNights}
                onEdit={() => checkout.onGotoStep("nazad")}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Završi rezervaciju
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      )}
      {isCompleted && (
        <CheckoutOrderComplete
          open
          onReset={() => {}}
          onDownloadPDF={() => {}}
        />
      )}
    </>
  );
}
