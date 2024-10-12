"use client";

import type { ITourItem, ITourFilters } from "src/types/tour";

import { useState, useCallback } from "react";

import Stack from "@mui/material/Stack";

import { useBoolean } from "src/hooks/use-boolean";
import { useSetState } from "src/hooks/use-set-state";

import { orderBy } from "src/utils/helper";
import { fIsBetween } from "src/utils/format-time";

import {
  _tours,
  _tourGuides,
  TOUR_SORT_OPTIONS,
  TOUR_SERVICE_OPTIONS,
} from "src/_mock";

import { EmptyContent } from "src/components/empty-content";

import { ApartmentList } from "../apartments-list";
import { ApartmentSort } from "../tour-sort";
import { ApartmentSearch } from "../tour-search";
import { ApartmentFilters } from "../tour-filters";
import { ApartmentFiltersResult } from "../tour-filters-result";
import { ApartmentsContent } from "@/layouts/apartments";
import { api } from "@/trpc/react";
import { IApartmentFilters } from "@/schemas/apartment";
import { APARTMENT_SERVICE_OPTIONS } from "@/_mock/_apartment";

// ----------------------------------------------------------------------

export function ApartmentsListView() {
  const openFilters = useBoolean();

  // const [sortBy, setSortBy] = useState("latest");
  const [sortBy, setSortBy] = useState("najnoviji");

  const search = useSetState<{
    query: string;
    results: ITourItem[];
  }>({ query: "", results: [] });

  const filters = useSetState<IApartmentFilters>({
    location: "",
    startDate: null,
    endDate: null,
    guests: {
      adults: 1,
      children: 0,
    },
    services: [],
  });

  const canReset =
    filters.state.location.length > 0 ||
    filters.state.guests.children > 0 ||
    filters.state.guests.adults > 1 ||
    filters.state.services.length > 0 ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      search.setState({ query: inputValue });

      if (inputValue) {
        const results = _tours.filter(
          (tour) =>
            tour.name
              .toLowerCase()
              .indexOf(search.state.query.toLowerCase()) !== -1
        );

        search.setState({ results });
      }
    },
    [search]
  );
  const { data: apartments, isPending } = api.apartment.list.useQuery(
    filters.state
  );
  const notFound = apartments && apartments.length === 0 && canReset;

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
    >
      <ApartmentSearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ApartmentFilters
          defaultFilters={filters}
          canReset={canReset}
          onReset={filters.onResetState}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          services={APARTMENT_SERVICE_OPTIONS.map((option) => option)}
          onApply={(_filters) => filters.setState(_filters)}
        />

        <ApartmentSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={TOUR_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ApartmentFiltersResult
      filters={filters}
      totalResults={apartments?.length ?? 0}
    />
  );

  return (
    <ApartmentsContent>
      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && (
        <EmptyContent
          title="Žao nam je, nema traženih apartmana"
          filled
          sx={{ py: 10 }}
        />
      )}

      <ApartmentList apartments={apartments} isLoading={isPending} />
    </ApartmentsContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  dateError: boolean;
  filters: ITourFilters;
  inputData: ITourItem[];
};

const applyFilter = ({
  inputData,
  filters,
  sortBy,
  dateError,
}: ApplyFilterProps) => {
  const { services, destination, startDate, endDate, tourGuides } = filters;

  const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // Sort by
  // if (sortBy === "najnoviji") {
  if (sortBy === "latest") {
    inputData = orderBy(inputData, ["createdAt"], ["desc"]);
  }

  // if (sortBy === "najstariji") {
  if (sortBy === "oldest") {
    inputData = orderBy(inputData, ["createdAt"], ["asc"]);
  }

  // if (sortBy === "popularni") {
  if (sortBy === "popular") {
    inputData = orderBy(inputData, ["totalViews"], ["desc"]);
  }

  // Filters
  if (destination.length) {
    inputData = inputData.filter((tour) =>
      destination.includes(tour.destination)
    );
  }

  if (tourGuideIds.length) {
    inputData = inputData.filter((tour) =>
      tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
    );
  }

  if (services.length) {
    inputData = inputData.filter((tour) =>
      tour.services.some((item) => services.includes(item))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((tour) =>
        fIsBetween(startDate, tour.available.startDate, tour.available.endDate)
      );
    }
  }

  return inputData;
};
