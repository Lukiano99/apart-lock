import { OverviewBookingView } from "@/sections/dashboard/pregled/view";
import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

export const metadata = { title: `Booking | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewBookingView />;
}
