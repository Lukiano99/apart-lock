import { EmptyContent } from "@/components/empty-content";
import { Iconify } from "@/components/iconify";
import { ApartmentsLayout } from "@/layouts/apartments";
import { paths } from "@/routes/paths";
import { ReservationDetailsView } from "@/sections/reservation/view/reservation-details-view";
import { api } from "@/trpc/server";
import { Button } from "@mui/material";
import Link from "next/link";

const ReservationIdPage = async ({
  params,
}: {
  params: Promise<{
    reservationId: string;
  }>;
}) => {
  const { reservationId } = await params;

  const reservation = await api.reservation.get({
    reservationId,
  });

  const emptyContent = (
    <EmptyContent
      title="Rezervacija nije pronadjena"
      action={
        <Link href={paths.apartments.root}>
          <Button
            variant="contained"
            sx={{ mt: 5 }}
            startIcon={<Iconify icon="solar:arrow-left-outline" />}
          >
            Nazad na apartmane
          </Button>
        </Link>
      }
    />
  );

  if (!reservation) {
    return emptyContent;
  }

  const customer = await api.customer.get({
    customerId: reservation.customerId,
  });

  if (!customer) {
    return emptyContent;
  }
  return (
    <ReservationDetailsView
      reservation={reservation}
      customer={customer}
      title="Detalji rezervacije"
    />
  );
};

export default ReservationIdPage;
