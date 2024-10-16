import { CONFIG } from "@/config-global";
import { AdminReservationsView } from "@/sections/dashboard/rezervacije/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Rezervacije | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AdminReservationsView />;
}
