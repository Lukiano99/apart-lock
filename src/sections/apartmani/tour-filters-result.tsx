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

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<IApartmentFilters>;
};

export function ApartmentFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveServices = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.services.filter(
        (item) => item !== inputValue
      );

      filters.setState({ services: newValue });
    },
    [filters]
  );
  const handleRemoveGuests = useCallback(() => {
    filters.setState({
      guests: {
        adults: 1,
        children: 0,
      },
    });
  }, [filters]);

  const handleRemoveAvailable = useCallback(() => {
    filters.setState({ startDate: null, endDate: null });
  }, [filters]);

  const handleRemoveLocation = useCallback(() => {
    const newValue = "";

    filters.setState({ location: newValue });
  }, [filters]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={filters.onResetState}
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
            onDelete={handleRemoveGuests}
          />
        )}
      </FiltersBlock>
      <FiltersBlock label="Deca:" isShow={filters.state.guests.children > 0}>
        {filters.state.guests.children > 0 && (
          <Chip
            {...chipProps}
            label={filters.state.guests.children}
            onDelete={handleRemoveGuests}
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
