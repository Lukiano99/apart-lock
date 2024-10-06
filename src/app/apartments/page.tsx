import { CONFIG } from "@/config-global";

import { BlankView } from "src/sections/blank/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Appartments - ${CONFIG.appName}` };

export default function Page() {
  return <BlankView title="Page one" />;
}
