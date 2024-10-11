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
  params: {
    reservationId: string;
  };
}) => {
  const { reservationId } = params;

  const reservation = await api.reservation.get({
    reservationId,
  });

  if (!reservation) {
    return (
      <ApartmentsLayout>
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
        ;
      </ApartmentsLayout>
    );
  }
  const customer = await api.customer.get({
    customerId: reservation.customerId,
  });
  if (!customer) {
    return (
      <ApartmentsLayout>
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
        ;
      </ApartmentsLayout>
    );
  }
  return (
    <ApartmentsLayout>
      <ReservationDetailsView
        reservation={reservation}
        customer={customer}
        title="Detalji rezervacije"
      />
    </ApartmentsLayout>
  );
};

export default ReservationIdPage;
