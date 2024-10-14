import { Iconify } from "@/components/iconify";
import { fCurrency } from "@/utils/format-number";
import { fDate, fDuration } from "@/utils/format-time";
import {
  Card,
  Divider,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Apartment, Room } from "@prisma/client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import qs from "query-string";
import ApartmentsSkeleton from "../apartmani/apartments-skeleton";

interface ReservationOverviewProps {
  apartment: Apartment;
  room: Room;
}

const ReservationOverview = ({ apartment, room }: ReservationOverviewProps) => {
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<{ adults: number; children: number }>({
    adults: 1,
    children: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (searchParams) {
      const params = qs.parse(searchParams.toString());
      const parsedStartDate = params.startDate
        ? new Date(params.startDate as string)
        : null;
      const parsedEndDate = params.endDate
        ? new Date(params.endDate as string)
        : null;

      const parsedAdults = params.adults ? Number(params.adults) : 1;
      const parsedChildren = params.children ? Number(params.children) : 0;

      setStartDate(parsedStartDate);
      setEndDate(parsedEndDate);
      setGuests({
        adults: parsedAdults,
        children: parsedChildren,
      });

      setIsLoading(false);
    }
  }, [searchParams]);

  const duration = startDate && endDate ? fDuration({ startDate, endDate }) : 1;
  const totalPrice = room.price * duration;

  return (
    <Card
      sx={{ mb: 3, p: 3, gap: 2, display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h4">Detalji rezervacije</Typography>
      {isLoading &&
        Array(3)
          .fill(null)
          .map((_, idx) => <Skeleton key={idx} sx={{ height: 50 }} />)}
      {!isLoading &&
        [
          {
            label: "Dolazak - odlazak",
            value: `${fDate(startDate, "ddd D MMM YYYY")} - ${fDate(endDate, "ddd D MMM YYYY")}`,
            icon: <Iconify icon="solar:calendar-bold-duotone" />,
          },
          {
            label: "Trajanje boravka",
            value: `${duration} ${duration === 1 ? "noć" : "noći"}`,
            icon: <Iconify icon="solar:moon-stars-bold-duotone" />,
          },
          {
            label: "Izabrali ste sobu za",
            value: `${guests.adults} ${guests.adults === 1 ? "osobu" : guests.adults < 5 ? "osobe" : "osoba"} ${guests.children > 0 ? `i ${guests.children} ${guests.children === 1 ? "dete" : "deteta"}` : ""}`,
            icon: <Iconify icon="solar:bed-bold-duotone" />,
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
      {isLoading &&
        Array(1)
          .fill(null)
          .map((_) => <Skeleton sx={{ height: 50 }} />)}
      {!isLoading && (
        <Stack spacing={1.5} direction="row">
          <Iconify icon="solar:hand-money-bold-duotone" />
          <ListItemText
            primary={"Ukupno za plaćanje"}
            secondary={fCurrency(totalPrice)}
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
      )}
    </Card>
  );
};

export default ReservationOverview;
