import type {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
  ICheckoutDeliveryOption,
} from "src/types/checkout";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";

import { CheckoutPaymentMethods } from "./checkout-payment-methods";
import { CheckoutSummary } from "./checkout-summary";
import { CheckoutBillingInfo } from "./checkout-billing-info";
import { checkout } from "@/_mock";
import { Customer } from "@prisma/client";

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: ICheckoutDeliveryOption[] = [
  { value: 0, label: "Free", description: "5-7 days delivery" },
  { value: 10, label: "Standard", description: "3-5 days delivery" },
  { value: 20, label: "Express", description: "2-3 days delivery" },
];

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  {
    value: "creditcard",
    label: "Visa / Master kartica",
    description: "Podržavamo plaćanje Visa i Matercard karticama.",
  },
  {
    value: "cash",
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

export type PaymentSchemaType = zod.infer<typeof PaymentSchema>;

export const PaymentSchema = zod.object({
  payment: zod.string().min(1, { message: "Payment is required!" }),
  // Not required
  delivery: zod.number(),
});

// ----------------------------------------------------------------------
interface CheckoutPaymentProps {
  customer: Customer;
}
export function CheckoutPayment({ customer }: CheckoutPaymentProps) {
  const defaultValues = { delivery: "free", payment: "card" };

  const methods = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    // defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    alert("Radi submit");
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutPaymentMethods
            name="payment"
            options={{
              cards: CARD_OPTIONS,
              payments: PAYMENT_OPTIONS,
            }}
            sx={{ my: 3 }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo
            customer={customer}
            onBackStep={checkout.onBackStep}
          />

          <CheckoutSummary
            total={checkout.total}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep("nazad")}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Kreiraj rezervaciju
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
