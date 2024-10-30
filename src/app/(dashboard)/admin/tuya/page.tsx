import TuyaView from "@/sections/dashboard/tuya/view/tuya-view";
import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

export const metadata = { title: `Tuya | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <TuyaView />;
}
