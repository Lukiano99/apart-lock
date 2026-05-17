import { ApartmentsLayout } from "@/layouts/apartments";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <ApartmentsLayout>{children}</ApartmentsLayout>;
}
