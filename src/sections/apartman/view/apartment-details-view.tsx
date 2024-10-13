"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { paths } from "src/routes/paths";

import { useTabs } from "src/hooks/use-tabs";

import { _bookings, TOUR_PUBLISH_OPTIONS } from "src/_mock";

import { Label } from "src/components/label";

import { ApartmentDetailsContent } from "../apartment-details-content";
import { TourDetailsToolbar } from "../apartment-details-toolbar";
import { ApartmentsContent } from "@/layouts/apartments";
import { ApartmentRooms } from "../sobe/apartment-rooms";
import { RouterOutputs } from "@/trpc/react";
import { APARTMENT_DETAILS_TABS } from "@/_mock/_apartment";

// ----------------------------------------------------------------------

type Props = {
  // tour?: ITourItem;
  apartment: RouterOutputs["apartment"]["get"];
};

export function ApartmentDetailsView({ apartment }: Props) {
  const tabs = useTabs("content");

  const renderTabs = (
    <Tabs
      value={tabs.value}
      onChange={tabs.onChange}
      sx={{ mb: { xs: 3, md: 5 } }}
    >
      {APARTMENT_DETAILS_TABS.map((tab) => (
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

      {tabs.value === "content" && (
        <ApartmentDetailsContent apartment={apartment} />
      )}

      {tabs.value === "rooms" && apartment && (
        <ApartmentRooms
          // title="Izaberite sobu koja vam odgovara"
          apartmentId={apartment.id}
          headLabel={[
            { id: "destination", label: "Tip sobe" },
            { id: "customer", label: "Broj gostiju" },
            { id: "checkIn", label: "Cena za X noći" },
            { id: "checkOut", label: "Način plaćanja" },
            { id: "status", label: "Status" },
            { id: "reservation", label: "Rezervacije" },
            { id: "", label: "" },
          ]}
        />
      )}
    </ApartmentsContent>
  );
}
