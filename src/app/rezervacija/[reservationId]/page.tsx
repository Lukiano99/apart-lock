import { EmptyContent } from "@/components/empty-content";
import { ApartmentsContent, ApartmentsLayout } from "@/layouts/apartments";
import { ReservationDetailsView } from "@/sections/reservation/view/reservation-details-view";
import { api } from "@/trpc/server";
import { Typography } from "@mui/material";

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
    return <EmptyContent title="Rezervacija nije pronadjena" />;
  }
  const customer = await api.customer.get({
    customerId: reservation.customerId,
  });
  if (!customer) {
    return <EmptyContent title="Rezervacija nije pronadjena" />;
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
