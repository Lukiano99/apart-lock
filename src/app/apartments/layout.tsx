import { AuthGuard } from "src/auth/guard";
import { CONFIG } from "@/config-global";
import { ApartmentsLayout } from "@/layouts/apartments";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <ApartmentsLayout>{children}</ApartmentsLayout>;
  }

  return (
    <AuthGuard>
      <ApartmentsLayout>{children}</ApartmentsLayout>
    </AuthGuard>
  );
}
