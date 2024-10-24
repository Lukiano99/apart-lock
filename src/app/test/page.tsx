import { CONFIG } from "src/config-global";

import { ApartmentsListView } from "@/sections/apartmani/view";
import TestView from "@/sections/test/view/test-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Dev test - ${CONFIG.appName}` };

export default function Page() {
  return <TestView />;
}
