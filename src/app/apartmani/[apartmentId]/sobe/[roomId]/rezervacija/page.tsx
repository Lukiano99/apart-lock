"use server";
import { EmptyContent } from "@/components/empty-content";
import { ReservationView } from "@/sections/reservation/view/reservation-view";
import { api } from "@/trpc/server";

const ReservationPage = async ({
  params,
}: {
  params: Promise<{ apartmentId: string; roomId: string }>;
}) => {
  const { apartmentId, roomId } = await params;
  const apartment = await api.apartment.get({
    id: apartmentId,
  });

  if (!apartment) {
    return <EmptyContent title="Traženi apartman ne postoji" />;
  }

  const room = apartment.rooms.find((room) => room.id === roomId);
  if (!room) {
    return <EmptyContent title="Tražena soba ne postoji" />;
  }

  return <ReservationView apartment={apartment} room={room} />;
};

export default ReservationPage;
