import { EmptyContent } from "@/components/empty-content";
import CreatedReservationStatusView from "@/sections/reservation/created-reservation-status/view/created-reservation-status";
import { api } from "@/trpc/server";

const ReservationIdLayout = async ({
  params,
  children,
}: {
  params: {
    reservationId: string;
  };
  children: React.ReactNode;
}) => {
  const { reservationId } = params;
  const reservation = await api.reservation.get({
    reservationId: reservationId.toString(),
  });
  if (reservation) {
    return <CreatedReservationStatusView status={reservation.status} />;
  }
  return <>{children}</>;
};

export default ReservationIdLayout;
