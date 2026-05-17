import { DashboardLayout } from "src/layouts/dashboard";

import { AuthGuard } from "src/auth/guard";
import { CONFIG } from "@/config-global";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
