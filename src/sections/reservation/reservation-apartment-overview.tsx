import { Iconify } from "@/components/iconify";
import { fCurrency } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";
import { Card, Divider, ListItemText, Stack, Typography } from "@mui/material";
import { Apartment, Room, Service } from "@prisma/client";

interface ReservationApartmentOverviewProps {
  apartment: Apartment & {
    services: Service[];
  };
  room: Room;
}

const ReservationApartmentOverview = ({
  apartment,
  room,
}: ReservationApartmentOverviewProps) => {
  return (
    <Card
      sx={{ mb: 3, p: 3, gap: 2, display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h4">Pregled apartmana</Typography>
      {[
        {
          label: "Naziv",
          value: `${apartment.name}`,
          icon: <Iconify icon="solar:home-bold-duotone" />,
        },
        {
          label: "Ocena",
          value: "4.5",
          icon: <Iconify icon="solar:star-bold-duotone" />,
        },
        {
          label: "Lokacija",
          value: `${apartment.location}`,
          icon: <Iconify icon="solar:map-point-bold-duotone" />,
        },
        {
          label: "Dodaci",
          value: `${apartment.services.map((service) => service.name).join(", ")}`,

          icon: <Iconify icon="solar:smile-circle-bold-duotone" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: "body2",
              color: "text.secondary",
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              component: "span",
              color: "text.primary",
              typography: "subtitle2",
            }}
          />
        </Stack>
      ))}
    </Card>
  );
};

export default ReservationApartmentOverview;
