"use client";

import { DashboardContent } from "src/layouts/dashboard";

import { ApartmentNewEditForm } from "../apartment-new-edit-form";
import { Typography } from "@mui/material";
import { IApartmentItem } from "@/schemas/apartment";

// ----------------------------------------------------------------------

type Props = {
  apartment?: IApartmentItem;
};

export function ApartmentEditView({ apartment }: Props) {
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 8 }}>
        Izmenite apartman
      </Typography>
      <ApartmentNewEditForm currentApartment={apartment} />
    </DashboardContent>
  );
}
