import { AuthGuard } from "src/auth/guard";
import { CONFIG } from "@/config-global";
import { ApartmentsLayout } from "@/layouts/apartments";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <ApartmentsLayout>{children}</ApartmentsLayout>;
}
