import { _tours } from "src/_mock/_tour";
import { CONFIG } from "src/config-global";

import { TourDetailsView } from "@/sections/apartman/view";
import { api } from "@/trpc/server";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Tour details | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const currentTour = _tours.find((tour) => tour.id === id);
  const currentAppartment = await api.apartment.get({ id });

  return <TourDetailsView apartment={currentAppartment} />;
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
