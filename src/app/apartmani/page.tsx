import { CONFIG } from "src/config-global";

import { ApartmentsListView } from "@/sections/apartmani/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Pregled apartmana - ${CONFIG.appName}` };

export default function Page() {
  return <ApartmentsListView />;
}
