import { Iconify } from "@/components/iconify";
import { fCurrency } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";
import { Card, Divider, ListItemText, Stack, Typography } from "@mui/material";
import { Apartment, Room } from "@prisma/client";

interface ReservationOverviewProps {
  apartment: Apartment;
  room: Room;
}

const ReservationOverview = ({ apartment, room }: ReservationOverviewProps) => {
  console.log("novi deploy");
  return (
    <Card
      sx={{ mb: 3, p: 3, gap: 2, display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h4">Detalji rezervacije</Typography>
      {[
        {
          label: "Dolazak - odlazak",
          value: `${fDate(apartment.createdAt, "ddd D MMM YYYY")} - ${fDate(new Date(), "ddd D MMM YYYY")}`,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: "Ukupno dani boravka",
          value: "3 noći",
          icon: <Iconify icon="mdi:moon-and-stars" />,
        },
        {
          label: "Izabrali ste",
          value: "1 sobu za 2 osobe",
          icon: <Iconify icon="solar:bed-linear" />,
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
      <Divider sx={{ borderStyle: "dashed" }} />

      <Typography variant="h3" color={"orange"}>
        Cena
      </Typography>
      <Stack spacing={1.5} direction="row">
        <Iconify icon="mdi:hand-coin" />
        <ListItemText
          primary={"Ukupno za plaćanje"}
          secondary={fCurrency(room.price)}
          primaryTypographyProps={{
            typography: "body1",
            color: "text.secondary",
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            component: "span",
            color: "text.primary",
            typography: "h5",
          }}
        />
      </Stack>
    </Card>
  );
};

export default ReservationOverview;
