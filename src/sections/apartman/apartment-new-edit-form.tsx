import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect, useCallback } from "react";

import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { _tourGuides } from "src/_mock";

import { toast } from "src/components/snackbar";
import { Form, Field } from "@/components/hook-form";
import {
  IApartmentItem,
  NewApartmentSchema,
  NewApartmentSchemaType,
} from "@/schemas/apartment";
import {
  APARTMENT_IMAGES,
  APARTMENT_SERVICE_OPTIONS,
  APARTMENT_SORT_OPTIONS,
} from "@/_mock/_apartment";
import { Box, Button, InputAdornment, MenuItem } from "@mui/material";
import { useAuthContext } from "@/auth/hooks";
import { api } from "@/trpc/react";
import { Iconify } from "@/components/iconify";
import { PaymentMethod } from "@prisma/client";

// ----------------------------------------------------------------------

{
  /*
export type NewTourSchemaType = zod.infer<typeof NewTourSchema>;

export const NewTourSchema = zod
  .object({
    name: zod.string().min(1, { message: "Name is required!" }),
    content: schemaHelper.editor({
      message: { required_error: "Content is required!" },
    }),
    images: schemaHelper.files({
      message: { required_error: "Images is required!" },
    }),
    tourGuides: zod
      .array(
        zod.object({
          id: zod.string(),
          name: zod.string(),
          avatarUrl: zod.string(),
          phoneNumber: zod.string(),
        })
      )
      .nonempty({ message: "Must have at least 1 guide!" }),
    available: zod.object({
      startDate: schemaHelper.date({
        message: { required_error: "Start date is required!" },
      }),
      endDate: schemaHelper.date({
        message: { required_error: "End date is required!" },
      }),
    }),
    durations: zod.string().min(1, { message: "Durations is required!" }),
    destination: schemaHelper.objectOrNull<string | null>({
      message: { required_error: "Destination is required!" },
    }),
    services: zod
      .string()
      .array()
      .min(2, { message: "Must have at least 2 items!" }),
    tags: zod
      .string()
      .array()
      .min(2, { message: "Must have at least 2 items!" }),
  })
  .refine(
    (data) => !fIsAfter(data.available.startDate, data.available.endDate),
    {
      message: "End date cannot be earlier than start date!",
      path: ["available.endDate"],
    }
  );
   */
}

// ----------------------------------------------------------------------

type Props = {
  currentApartment?: IApartmentItem;
};

export function ApartmentNewEditForm({ currentApartment }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      id: currentApartment?.id,
      adminId: user?.id ?? "",
      name: currentApartment?.name || "",
      location: currentApartment?.location || "",
      description: currentApartment?.description || "",
      price: currentApartment?.price || 10,
      paymentRequired: currentApartment?.paymentRequired || false,
      images: currentApartment?.images || [],
      services: currentApartment?.services || [],
      rooms: currentApartment?.rooms || [],
    }),
    [currentApartment]
  );

  const methods = useForm<NewApartmentSchemaType>({
    resolver: zodResolver(NewApartmentSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const {
    fields: rooms,
    append,
    remove,
  } = useFieldArray({ control, name: "rooms" });

  useEffect(() => {
    if (currentApartment) {
      reset(defaultValues);
    }
  }, [currentApartment, defaultValues, reset]);

  const handleAddRoom = () => {
    append({
      roomNumber: "",
      bed_count: 1,
      paymentMethod: "CASH",
      price: 10,
    });
  };
  const handleRemoveRoom = (index: number) => {
    remove(index);
  };

  const { mutate: deleteApartment, isPending: isDeleting } =
    api.apartment.delete.useMutation();

  const handleDeleteApartment = () => {
    deleteApartment(
      { apartmentId: currentApartment?.id ?? "" },
      {
        onSuccess: (data) => {
          toast.success("Uspešno ste obrisali apartman", {
            description: data.message,
          });
          router.refresh();
          router.push(paths.dashboard.apartments.root);
        },
        onError: (data) => {
          toast.error("Došlo je do greške", {
            description: data.message,
          });
        },
      }
    );
  };

  const { mutate: createOrUpdateApartment, isPending } = currentApartment
    ? api.apartment.update.useMutation()
    : api.apartment.create.useMutation();

  const onSubmit = handleSubmit((data) => {
    createOrUpdateApartment(data, {
      onSuccess: (data) => {
        toast.success(
          `Uspešno ste ${currentApartment ? "ažurirali" : "kreirali"} apartman`,
          {
            description: data.id,
          }
        );
        router.refresh();
        !currentApartment && router.push(paths.apartments.details(data.id));
      },
      onError: (data) => {
        toast.error("Došlo je do greške", {
          description: data.message,
        });
      },
    });
  });

  const renderDetails = (
    <Card>
      <CardHeader
        title="Detalji"
        subheader="Naziv apartmana, opis, slike..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Naziv apartmana</Typography>
          <Field.Text name="name" placeholder="Unesite naziv apartmana" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Opis</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Field.Autocomplete
            name="images"
            label="URL slika"
            placeholder="+ slika"
            multiple
            freeSolo
            disableCloseOnSelect
            options={APARTMENT_IMAGES.map((option, idx) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Ostale informacije"
        subheader="Lokacija i dodaci..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Lokacija</Typography>
          <Field.Text
            fullWidth
            name="location"
            placeholder="Belgrade, Novi Sad..."
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Dodaci</Typography>
          <Field.MultiCheckbox
            name="services"
            options={APARTMENT_SERVICE_OPTIONS}
            sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader
        title="Cena"
        subheader="Cena noćenja u vašem apartmanu"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="price"
          label="Cena noćenja"
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: "text.disabled" }}>
                  $
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Switch
          label="Zahtevam plaćanje karticom"
          name="paymentRequired"
        />
      </Stack>
    </Card>
  );

  const renderRooms = (
    <Card>
      <CardHeader title="Sobe" subheader="Unesite sobe" sx={{ mb: 3 }} />
      <Stack
        divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
        spacing={3}
        sx={{ p: 3 }}
      >
        {currentApartment &&
          rooms.map((room, index) => (
            <Stack key={index} alignItems="flex-end" spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <Field.Text
                  size="small"
                  name={`rooms[${index}].roomNumber`}
                  label="Broj sobe"
                  placeholder={`Inndex: ${index}`}
                  InputLabelProps={{ shrink: true }}
                />
                <Field.Text
                  size="small"
                  type="number"
                  name={`rooms[${index}].bed_count`}
                  label="Broj kreveta"
                  placeholder="1"
                  // onChange={(event) => handleChangeQuantity(event, index)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { md: 96 } }}
                />

                <Field.Select
                  name={`rooms[${index}].paymentMethod`}
                  size="small"
                  label="Način plaćanja"
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { md: 160 } }}
                >
                  <Divider sx={{ borderStyle: "dashed" }} />

                  {[PaymentMethod.CARD, PaymentMethod.CASH].map(
                    (paymentMethod, idx) => (
                      <MenuItem
                        key={idx}
                        value={paymentMethod}
                        // onClick={() => handleSelectService(index, service.name)}
                      >
                        {paymentMethod}
                      </MenuItem>
                    )
                  )}
                </Field.Select>

                <Field.Text
                  size="small"
                  type="number"
                  name={`rooms[${index}].price`}
                  label="Cena noćenja"
                  placeholder="0.00"
                  // onChange={(event) => handleChangePrice(event, index)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            typography: "subtitle2",
                            color: "text.disabled",
                          }}
                        >
                          €
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: { md: 150 } }}
                />
              </Stack>
              <Divider sx={{ my: 0, borderStyle: "dashed", inset: 0 }} />

              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemoveRoom(index)}
              >
                Ukloni sobu
              </Button>
            </Stack>
          ))}
      </Stack>
      <Divider sx={{ my: 3, borderStyle: "dashed" }} />
      <Stack
        spacing={3}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-end", md: "center" }}
        p={3}
        pt={0}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddRoom}
          sx={{ flexShrink: 0 }}
        >
          Dodaj sobu
        </Button>
      </Stack>
      <Divider />
    </Card>
  );

  const renderActions = (
    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="flex-end"
      spacing={2}
    >
      {/* <FormControlLabel
        control={
          <Switch defaultChecked inputProps={{ id: "publish-switch" }} />
        }
        label="Objavi"
        sx={{ flexGrow: 1, pl: 3 }}
      /> */}

      {currentApartment && (
        <LoadingButton
          type="button"
          variant="contained"
          size="large"
          color="error"
          startIcon={<Iconify icon={"mdi:trash"} />}
          loading={isDeleting}
          onClick={handleDeleteApartment}
          sx={{ ml: 2 }}
        >
          Obriši apartman
        </LoadingButton>
      )}
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isPending}
        startIcon={<Iconify icon={"mdi:check"} />}
        sx={{ ml: 2 }}
      >
        {!currentApartment ? "Kreirajte apartman" : "Sačuvajte izmene"}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: "auto", maxWidth: { xs: 720, xl: 880 } }}
      >
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {currentApartment && renderRooms}

        {renderActions}
      </Stack>
    </Form>
  );
}
