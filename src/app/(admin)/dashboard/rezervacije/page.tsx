import { CONFIG } from "@/config-global";

import { BlankView } from "src/sections/blank/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Rezervacije | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <BlankView title="Rezervacije" />;
}
