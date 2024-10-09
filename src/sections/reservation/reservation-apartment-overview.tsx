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
          icon: <Iconify icon="mdi:office-building" />,
        },
        {
          label: "Ocena",
          value: "4.5",
          icon: <Iconify icon="mdi:star" />,
        },
        {
          label: "Lokacija",
          value: `${apartment.location}`,
          icon: <Iconify icon="mdi:location" />,
        },
        {
          label: "Dodaci",
          value: `${apartment.services.map((service) => `${service.name}, `)}`,
          icon: <Iconify icon="mdi:puzzle" />,
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
