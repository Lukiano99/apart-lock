import { EmptyContent } from "@/components/empty-content";
import { IApartmentItem } from "@/schemas/apartment";
import {
  ApartmentCreateView,
  ApartmentEditView,
} from "@/sections/apartman/view";
import { api } from "@/trpc/server";
import { CONFIG } from "src/config-global";
export const metadata = { title: `Pregled apartmana - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

const EditapartmentPage = async ({ params }: Props) => {
  const { id: apartmentId } = params;

  const apartment = await api.apartment.get({
    id: apartmentId,
  });

  if (!apartment) {
    return (
      <EmptyContent
        title="Apartman ne postoji"
        description="Pokušajte ponovo"
      />
    );
  }
  const parsedApartment: IApartmentItem = {
    id: apartment.id,
    adminId: apartment.adminId,
    name: apartment.name,
    price: apartment.price,
    location: apartment.location,
    paymentRequired: apartment.requiresPayment,
    description: apartment.description ?? "",
    images: apartment.images.map((img) => img.imageUrl),
    services: apartment.services.map((service) => service.id.toString()),
    rooms: apartment.rooms.map((room) => ({
      roomNumber: room.number.toString(),
      bed_count: room.bed_count,
      paymentMethod: room.paymentMethod,
      price: room.price,
    })),
  };

  return <ApartmentEditView apartment={parsedApartment} />;
};

export default EditapartmentPage;
