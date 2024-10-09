import { _tours } from "src/_mock/_tour";
import { CONFIG } from "src/config-global";

import { ApartmentDetailsView } from "@/sections/apartman/view";
import { api } from "@/trpc/server";
import { EmptyContent } from "@/components/empty-content";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Tour details | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: { apartmentId: string };
};

export default async function Page({ params }: Props) {
  const { apartmentId } = params;

  const currentAppartment = await api.apartment.get({ id: apartmentId });
  if (!currentAppartment) {
    return <EmptyContent title="Traženi apartman ne postoji" />;
  }
  return <ApartmentDetailsView apartment={currentAppartment} />;
}

// ----------------------------------------------------------------------
/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? "auto" : "force-dynamic";

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _tours.map((tour) => ({ id: tour.id }));
  }
  return [];
}
