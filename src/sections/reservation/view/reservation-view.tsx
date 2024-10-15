"use client";

import { Apartment, Room, Service } from "@prisma/client";
import { ApartmentsContent } from "@/layouts/apartments";
import { Grid, Skeleton } from "@mui/material";
import ReservationOverview from "../reservation-overview";
import { CustomerReservationForm } from "../reservation-form";
import ReservationApartmentOverview from "../reservation-apartment-overview";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";

// ----------------------------------------------------------------------

interface ReservationViewProps {
  apartment: Apartment & {
    services: Service[];
  };
  room: Room;
}

export function ReservationView({ apartment, room }: ReservationViewProps) {
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

  return (
    <ApartmentsContent>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          <ReservationOverview room={room} apartment={apartment} />

          <ReservationApartmentOverview room={room} apartment={apartment} />
        </Grid>

        <Grid xs={12} md={8} item>
          {startDate && endDate && (
            <CustomerReservationForm
              roomId={room.id}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          {isLoading && <Skeleton />}
        </Grid>
      </Grid>
    </ApartmentsContent>
  );
}
