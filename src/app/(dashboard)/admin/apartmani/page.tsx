import AdminApartmentsListView from "@/sections/dashboard/apartmani/view/admin-apartments-list";
import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

export const metadata = { title: `Pregled apartmana - ${CONFIG.appName}` };

export default function Page() {
  return <AdminApartmentsListView />;
}
