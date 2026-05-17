import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ITourGuide, ITourFilters } from "src/types/tour";
import type { UseSetStateReturn } from "src/hooks/use-set-state";

import { useCallback } from "react";

import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import { fDateRangeShortLabel } from "src/utils/format-time";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "src/components/filters-result";
import { IApartmentFilters } from "@/schemas/apartment";
import { useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<IApartmentFilters>;
};

export function ApartmentFiltersResult({ filters, totalResults, sx }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  // Parse current search params from URL
  const params = qs.parse(searchParams?.toString() ?? '');

  const handleRemoveServices = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.services.filter(
        (item) => item !== inputValue
      );
      removeServiceFromUrl(newValue);
      filters.setState({ services: newValue });
    },
    [filters]
  );
  const handleRemoveAdultGuests = useCallback(() => {
    removeFromUrl("adults");

    filters.setState({
      guests: {
        adults: 1,
        children: filters.state.guests.children,
      },
    });
  }, [filters]);

  const handleRemoveChildrenGuests = useCallback(() => {
    removeFromUrl("children");

    filters.setState({
      guests: {
        children: 0,
        adults: filters.state.guests.adults,
      },
    });
  }, [filters]);

  const handleRemoveAvailable = useCallback(() => {
    removeFromUrl("startDate");
    removeFromUrl("endDate");

    filters.setState({ startDate: null, endDate: null });
  }, [filters]);

  const handleRemoveLocation = useCallback(() => {
    removeFromUrl("location");

    const newValue = "";

    filters.setState({ location: newValue });
  }, [filters]);

  const handleResetFilters = () => {
    filters.onResetState;
    router.replace(window.location.pathname);
  };

  const removeFromUrl = (filterKey: string, isArray?: boolean) => {
    delete params[filterKey];
    const newQueryString = qs.stringify(params, {
      skipNull: true, // Skip null or undefined values
      skipEmptyString: true, // Skip empty strings
    });

    // Update the URL without reloading the page
    router.push(`?${newQueryString}`);
  };

  const removeServiceFromUrl = (newValue: string[]) => {
    const newQueryString = qs.stringify(
      {
        ...params,
        services: newValue.length > 0 ? newValue : undefined, // Remove services key if empty
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(`?${newQueryString}`);
  };

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={handleResetFilters}
      sx={sx}
    >
      <FiltersBlock
        label="Dostupno:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(
            filters.state.startDate,
            filters.state.endDate
          )}
          onDelete={handleRemoveAvailable}
        />
      </FiltersBlock>

      <FiltersBlock label="Dodaci:" isShow={!!filters.state.services.length}>
        {filters.state.services.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveServices(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Odrasli:" isShow={filters.state.guests.adults > 0}>
        {filters.state.guests.adults > 0 && (
          <Chip
            {...chipProps}
            label={filters.state.guests.adults}
            onDelete={handleRemoveAdultGuests}
          />
        )}
      </FiltersBlock>
      <FiltersBlock label="Deca:" isShow={filters.state.guests.children > 0}>
        {filters.state.guests.children > 0 && (
          <Chip
            {...chipProps}
            label={filters.state.guests.children}
            onDelete={handleRemoveChildrenGuests}
          />
        )}
      </FiltersBlock>

      <FiltersBlock label="Lokacija:" isShow={!!filters.state.location}>
        {filters.state.location && (
          <Chip
            {...chipProps}
            label={filters.state.location}
            onDelete={handleRemoveLocation}
          />
        )}
      </FiltersBlock>
    </FiltersResult>
  );
}
