"use client";

import type { ITourItem } from "src/types/tour";

import { useState, useCallback } from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { paths } from "src/routes/paths";

import { useTabs } from "src/hooks/use-tabs";

import { _bookings, TOUR_DETAILS_TABS, TOUR_PUBLISH_OPTIONS } from "src/_mock";

import { Label } from "src/components/label";

import { TourDetailsContent } from "../tour-details-content";
import { TourDetailsToolbar } from "../tour-details-toolbar";
import { ApartmentsContent } from "@/layouts/apartments";
import { ApartmentRooms } from "../sobe/apartment-rooms";
import { Apartment, Image, Room } from "@prisma/client";
import { RouterOutputs } from "@/trpc/react";

// ----------------------------------------------------------------------

type Props = {
  // tour?: ITourItem;
  apartment: RouterOutputs["apartment"]["get"];
};

export function TourDetailsView({ apartment }: Props) {
  const tabs = useTabs("content");

  const renderTabs = (
    <Tabs
      value={tabs.value}
      onChange={tabs.onChange}
      sx={{ mb: { xs: 3, md: 5 } }}
    >
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === "rooms" ? (
              <Label variant="filled">{apartment?.rooms.length}</Label>
            ) : (
              ""
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <ApartmentsContent>
      <TourDetailsToolbar
        backLink={paths.apartments.root}
        editLink={paths.apartments.edit(`${apartment?.id}`)}
        liveLink="#"
        publish={""}
        onChangePublish={() => {}}
        publishOptions={TOUR_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {tabs.value === "content" && <TourDetailsContent apartment={apartment} />}

      {tabs.value === "rooms" && (
        <ApartmentRooms
          // title="Izaberite sobu koja vam odgovara"
          tableData={_bookings}
          headLabel={[
            { id: "destination", label: "Tip sobe" },
            { id: "customer", label: "Broj gostiju" },
            { id: "checkIn", label: "Cena za X noći" },
            { id: "checkOut", label: "Način plaćanja" },
            { id: "status", label: "Status" },
            { id: "", label: "Rezerviši" },
          ]}
        />
      )}
    </ApartmentsContent>
  );
}
