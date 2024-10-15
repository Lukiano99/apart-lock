import { EmptyContent } from "@/components/empty-content";
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
  if (reservation && reservation.status !== "PENDING") {
    return (
      <EmptyContent
        title="Rezervacija je kreirana"
        description={`Status rezervacije: ${reservation.status}`}
      />
    );
  }
  return <>{children}</>;
};

export default ReservationIdLayout;
