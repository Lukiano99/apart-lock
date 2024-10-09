import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input/input";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { Label } from "src/components/label";
import { toast } from "src/components/snackbar";
import { Form, Field } from "src/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import { Typography } from "@mui/material";

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof CustomerReservationSchema>;

export const CustomerReservationSchema = zod.object({
  firstName: zod.string().min(1, { message: "Ime je obavezno!" }),
  lastName: zod.string().min(1, { message: "Prezime je obavezno!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email nije validan!" }),
  phoneNumber: schemaHelper.phoneNumber({
    isValidPhoneNumber,
    message: {
      required_error: "Broj telefona je obavezan!",
      invalid_type_error: "Broj telefona nije validan!",
    },
  }),
});

// ----------------------------------------------------------------------

export function CustomerReservationForm() {
  const router = useRouter();

  const methods = useForm<NewUserSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(CustomerReservationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
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

            <Field.Text name="first name" label="Ime" />
            <Field.Text name="last name" label="Prezime" />
            <Field.Text name="email" label="Email adresa" />
            <Field.Phone
              name="phoneNumber"
              label="Broj telefona"
              country="RS"
            />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Napravi rezervaciju
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Form>
  );
}
