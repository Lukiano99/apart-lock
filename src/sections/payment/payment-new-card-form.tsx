import type { BoxProps } from "@mui/material/Box";
import type { TextFieldProps } from "@mui/material/TextField";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { useBoolean, UseBooleanReturn } from "src/hooks/use-boolean";

import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { CreditCardSchema, CreditCardSchemaType } from "@/schemas/credit-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";

import { toast } from "src/components/snackbar";
// ----------------------------------------------------------------------

type PaymentNewCardFormProps = BoxProps & {
  isRHF?: boolean;
  numberField?: TextFieldProps & { name: string };
  holderField?: TextFieldProps & { name: string };
  dateField?: TextFieldProps & { name: string };
  cvvField?: TextFieldProps & { name: string };
  openForm: UseBooleanReturn;
  onCardAdd: () => void;
};

export function PaymentNewCardForm({
  sx,
  isRHF,
  cvvField,
  dateField,
  numberField,
  holderField,
  openForm,
  onCardAdd,
  ...other
}: PaymentNewCardFormProps) {
  const FormField = isRHF ? Field.Text : TextField;

  const showPassword = useBoolean();

  const { reservationId } = useParams();

  const methods = useForm<CreditCardSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(CreditCardSchema),
    defaultValues: {
      cardHolder: "",
      cardNumber: "",
      cvv: "",
      expirationDate: "",
    },
  });

  const { mutate: createCreditCard, isPending } =
    api.creditCard.create.useMutation();

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit((data: CreditCardSchemaType) => {
    createCreditCard(
      {
        cardHolder: data.cardHolder,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        expirationDate: data.expirationDate,
        reservationId: reservationId as string,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          openForm.onFalse();
          onCardAdd();
        },
        onError: (e) => {
          toast.error("Nešto je iskrslo", { description: `${e.message}` });
          reset();
        },
      }
    );
  });
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openForm.value}
      onClose={openForm.onFalse}
    >
      <DialogTitle> Add new card </DialogTitle>

      <DialogContent sx={{ overflow: "unset" }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box
            gap={2.5}
            display="flex"
            flexDirection="column"
            sx={{ width: 1, ...sx }}
            {...other}
          >
            <Field.Text
              label="Card number"
              placeholder="xxxx xxxx xxxx xxxx"
              InputLabelProps={{ shrink: true }}
              name={"cardNumber"}
            />

            <Field.Text
              label="Card holder"
              placeholder="John Doe"
              InputLabelProps={{ shrink: true }}
              name={"cardHolder"}
            />

            <Box gap={2} display="flex">
              <Field.Text
                fullWidth
                label="Expiration date"
                placeholder="MM/YY"
                InputLabelProps={{ shrink: true }}
                name={"expirationDate"}
              />
              <Field.Text
                fullWidth
                label="Cvv/Cvc"
                placeholder="***"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPassword.onToggle} edge="end">
                        <Iconify
                          icon={
                            showPassword.value
                              ? "solar:eye-bold"
                              : "solar:eye-closed-bold"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showPassword.value ? "text" : "password"}
                name={"cvv"}
              />
            </Box>

            <Box
              gap={1}
              display="flex"
              alignItems="center"
              sx={{ typography: "caption", color: "text.disabled" }}
            >
              <Iconify icon="solar:lock-password-outline" />
              Your transaction is secured with SSL encryption
            </Box>
          </Box>
          <DialogActions sx={{ width: "100%", px: 0 }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={openForm.onFalse}
            >
              Nazad
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isPending}
              endIcon={
                <Iconify
                  icon="eva:arrow-ios-forward-fill"
                  width={18}
                  sx={{ ml: -0.5 }}
                />
              }
            >
              Dodaj karticu
            </LoadingButton>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
