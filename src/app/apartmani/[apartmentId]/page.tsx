import { ApartmentDetailsView } from "@/sections/apartman/view";
import { api } from "@/trpc/server";
import { EmptyContent } from "@/components/empty-content";

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ apartmentId: string }>;
};

export default async function Page({ params }: Props) {
  const { apartmentId } = await params;

  const currentAppartment = await api.apartment.get({ id: apartmentId });
  if (!currentAppartment) {
    return <EmptyContent title="Traženi apartman ne postoji" />;
  }
  return <ApartmentDetailsView apartment={currentAppartment} />;
}
