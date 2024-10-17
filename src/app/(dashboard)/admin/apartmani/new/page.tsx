import { CONFIG } from "@/config-global";
import { ApartmentCreateView } from "@/sections/apartman/view";
// ----------------------------------------------------------------------

export const metadata = {
  title: `Create a new Apartment | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <ApartmentCreateView />;
}
