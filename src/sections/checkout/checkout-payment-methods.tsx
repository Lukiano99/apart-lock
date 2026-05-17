import type { BoxProps } from "@mui/material/Box";
import type { CardProps } from "@mui/material/Card";
import type {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
} from "src/types/checkout";

import {
  Control,
  Controller,
  FieldValues,
  useFormContext,
} from "react-hook-form";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormHelperText from "@mui/material/FormHelperText";

import { useBoolean } from "src/hooks/use-boolean";

import { varAlpha } from "src/theme/styles";

import { Iconify } from "src/components/iconify";

import { PaymentNewCardForm } from "../payment/payment-new-card-form";
import { PaymentMethod } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { api, RouterOutputs } from "@/trpc/react";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

type Props = CardProps & {
  name: string;
  options: {
    cards: ICheckoutCardOption[];
    payments: ICheckoutPaymentOption[];
  };
};

export function CheckoutPaymentMethods({ name, options, ...other }: Props) {
  const { control } = useFormContext();

  const openForm = useBoolean();

  const params = useParams();
  const reservationId = params?.reservationId;
  const { data: creditCards, refetch } =
    api.creditCard.getByReservationId.useQuery({
      reservationId: String(reservationId ?? ''),
    });

  return (
    <>
      <Card {...other}>
        <CardHeader title="Plaćanje" />

        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Box gap={2.5} display="flex" flexDirection="column" sx={{ p: 3 }}>
              {options.payments.map((option) => {
                const isSelected = value === option.value;

                return (
                  <OptionItem
                    key={option.label}
                    option={option}
                    selected={isSelected}
                    onOpen={openForm.onTrue}
                    cardOptions={options.cards}
                    isCredit={isSelected && option.value === PaymentMethod.CARD}
                    onClick={() => onChange(option.value)}
                    creditCards={creditCards ?? []}
                    control={control}
                  />
                );
              })}

              {!!error && (
                <FormHelperText error sx={{ mt: 0, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />
      </Card>

      <PaymentNewCardForm openForm={openForm} onCardAdd={refetch} />
    </>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = BoxProps & {
  selected: boolean;
  isCredit: boolean;
  onOpen: () => void;
  option: ICheckoutPaymentOption;
  cardOptions: ICheckoutCardOption[];
  creditCards: RouterOutputs["creditCard"]["getByReservationId"];
  control: Control<FieldValues, any>;
};

function OptionItem({
  sx,
  option,
  onOpen,
  selected,
  isCredit,
  cardOptions,
  creditCards,
  control,
  ...other
}: OptionItemProps) {
  return (
    <Box
      sx={{
        borderRadius: 1.5,
        border: (theme) =>
          `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.24)}`,
        transition: (theme) =>
          theme.transitions.create(["box-shadow"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
          }),
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.text.primary}`,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        sx={{ p: 2.5, cursor: "pointer" }}
      >
        <Box
          gap={0.5}
          flexGrow={1}
          display="flex"
          flexDirection="column"
          sx={{ typography: "subtitle1" }}
        >
          {option.label}
          <Box
            component="span"
            sx={{ typography: "body2", color: "text.secondary" }}
          >
            {option.description}
          </Box>
        </Box>

        <Box gap={1} display="flex" alignItems="center">
          {option.value === PaymentMethod.CARD && (
            <>
              <Iconify icon="logos:mastercard" width={24} />
              <Iconify icon="logos:visa" width={24} />
            </>
          )}
          {option.value === "paypal" && (
            <Iconify icon="logos:paypal" width={24} />
          )}
          {option.value === PaymentMethod.CASH && (
            <Iconify icon="solar:wad-of-money-bold" width={32} />
          )}
        </Box>
      </Box>

      {isCredit && (
        <Box sx={{ px: 3, mb: 1 }}>
          {creditCards && (
            <Controller
              name="cardId"
              control={control}
              defaultValue={creditCards[0]?.id || ""} // Postavi default vrednost na prvu karticu ako postoji
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextField
                    select
                    fullWidth
                    label="Card"
                    disabled={creditCards.length === 0}
                    SelectProps={{ native: true }}
                    {...field} // Vežeš vrednost i onChange na `TextField`
                  >
                    <option value={""} />
                    {creditCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.cardHolder},{" "}
                        {`**** **** **** ${card.cardNumber.slice(12)}`}
                      </option>
                    ))}
                  </TextField>
                  {!!error && (
                    <FormHelperText error sx={{ mt: 0, px: 2 }}>
                      {error.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          )}
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" sx={{ mr: -0.5 }} />}
            onClick={onOpen}
            sx={{ mt: 2 }}
          >
            Unesite karticu
          </Button>
        </Box>
      )}
    </Box>
  );
}
