"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { Form, Field } from "src/components/hook-form";
import { Typography } from "@mui/material";
import { Iconify } from "@/components/iconify";
import {
  CustomerReservationSchema,
  CustomerReservationSchemaType,
} from "@/schemas/reservation";
import { api } from "@/trpc/react";
import { Snackbar, toast } from "src/components/snackbar";
import { paths } from "@/routes/paths";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

// export type CustomerReservationSchemaType = zod.infer<
//   typeof CustomerReservationSchema
// >;

// export const CustomerReservationSchema = zod.object({
//   firstName: zod.string().min(1, { message: "Ime je obavezno!" }),
//   lastName: zod.string().min(1, { message: "Prezime je obavezno!" }),
//   email: zod
//     .string()
//     .min(1, { message: "Email is required!" })
//     .email({ message: "Email nije validan!" }),
//   phone: schemaHelper.phoneNumber({
//     isValidPhoneNumber,
//     message: {
//       required_error: "Broj telefona je obavezan!",
//       invalid_type_error: "Broj telefona nije validan!",
//     },
//   }),
//   roomId: zod.string(),
//   paymentMethod: zod.nativeEnum(PaymentMethod),
// });

// ----------------------------------------------------------------------

interface CustomerReservationFormProps {
  roomId: string;
}
export function CustomerReservationForm({
  roomId,
}: CustomerReservationFormProps) {
  const router = useRouter();

  const { mutate: createReservation, isPending: isPendingReservation } =
    api.reservation.create.useMutation();
  const methods = useForm<CustomerReservationSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(CustomerReservationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roomId: roomId,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    createReservation(
      { ...data, roomId },
      {
        onSuccess: (reservation) => {
          toast.success("Rezervacija je kreirana", {
            description: "Bićete preusmereni na stranicu sa detaljima",
          });
          router.replace(paths.apartments.reservation(reservation.id));
        },
        onError: (error) => {
          toast.error(`${error.message}`, {
            description: `Došlo je do greške`,
          });
        },
      }
    );
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid spacing={3}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(1, 1fr)",
            }}
          >
            <Typography variant="h4">Unesite vaše lične podatke</Typography>

            <Field.Text name="firstName" label="Ime" />
            <Field.Text name="lastName" label="Prezime" />
            <Field.Text name="email" label="Email adresa" />
            <Field.Phone name="phone" label="Broj telefona" country="RS" />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isPendingReservation}
              endIcon={
                <Iconify
                  icon="eva:arrow-ios-forward-fill"
                  width={18}
                  sx={{ ml: -0.5 }}
                />
              }
            >
              Dalje na placanje
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Form>
  );
}
