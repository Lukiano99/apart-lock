"use client";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ApartmentNewEditForm } from "../apartment-new-edit-form";
import { Typography } from "@mui/material";

// ----------------------------------------------------------------------

export function ApartmentCreateView() {
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 8 }}>
        Unesite novi apartman
      </Typography>
      <ApartmentNewEditForm />
    </DashboardContent>
  );
}
