import { ApartmentsLayout } from "@/layouts/apartments";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <ApartmentsLayout>{children}</ApartmentsLayout>;
}
