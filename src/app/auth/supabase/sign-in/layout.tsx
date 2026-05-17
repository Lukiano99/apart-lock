import { AuthCenteredLayout } from "@/layouts/auth-centered";
import { GuestGuard } from "src/auth/guard";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthCenteredLayout>{children}</AuthCenteredLayout>
    </GuestGuard>
  );
}
