"use client";
import { useAuthContext } from "@/auth/hooks";
import { EmptyContent } from "@/components/empty-content";
import { DashboardContent } from "@/layouts/dashboard";
import { ApartmentList } from "@/sections/apartmani/apartments-list";
import { api } from "@/trpc/react";
import { Typography } from "@mui/material";

const AdminApartmentsListView = () => {
  const { user } = useAuthContext();

  const { data: apartments, isPending } =
    api.apartment.listAdminApartments.useQuery({
      adminId: user?.id ?? "",
    });

  const notFound = apartments && apartments?.length === 0;

  return (
    <DashboardContent>
      {notFound && (
        <EmptyContent
          title="Žao nam je, nema traženih apartmana"
          filled
          sx={{ py: 10 }}
        />
      )}
      <Typography variant="h3" sx={{ mb: 5 }}>
        Vaši apartmani
      </Typography>
      <ApartmentList apartments={apartments} isLoading={isPending} />
    </DashboardContent>
  );
};

export default AdminApartmentsListView;
