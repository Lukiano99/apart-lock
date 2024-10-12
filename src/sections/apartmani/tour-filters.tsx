import type { ITourGuide } from "src/types/tour";
import { useSetState, type UseSetStateReturn } from "src/hooks/use-set-state";

import { useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { IApartmentFilters } from "@/schemas/apartment";
import dayjs, { Dayjs } from "dayjs";
import { fIsAfter } from "@/utils/format-time";
import { IncrementerButton } from "./components/incrementer-button";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  canReset: boolean;

  onOpen: () => void;
  onClose: () => void;
  onApply: (filters: IApartmentFilters) => void;
  defaultFilters: UseSetStateReturn<IApartmentFilters>;

  services: {
    label: string;
    value: string;
  }[];
};

export function ApartmentFilters({
  open,
  onOpen,
  onClose,
  onApply,
  defaultFilters,
  canReset,
  services,
}: Props) {
  const filters = useSetState<IApartmentFilters>(defaultFilters.state);
  const [dateError, setDateError] = useState(false);

  const handleFilterServices = useCallback(
    (newValue: string) => {
      const checked = filters.state.services.includes(newValue)
        ? filters.state.services.filter((value) => value !== newValue)
        : [...filters.state.services, newValue];

      filters.setState({ services: checked });
    },
    [filters]
  );

  const handleLocationChange = useCallback(
    (newValue: string) => {
      filters.setState({ location: newValue });
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date) => {
      if (fIsAfter(filters.state.startDate, newValue)) {
        setDateError(true);
      }

      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  const handleFilterDestination = useCallback(
    (newValue: string) => {
      filters.setState({ location: newValue });
    },
    [filters]
  );

  const handleFilterTourGuide = useCallback(
    (newValue: ITourGuide[]) => {
      // filters.setState({ guests: newValue });
    },
    [filters]
  );

  const handleApply = () => {
    onApply(filters.state);
  };

  const handleFilterAdultGuests = useCallback(
    (newValue: number) => {
      filters.setState({
        guests: {
          adults: newValue,
          children: filters.state.guests.children,
        },
      });
    },
    [filters]
  );
  const handleFilterChildrenGuests = useCallback(
    (newValue: number) => {
      filters.setState({
        guests: {
          children: newValue,
          adults: filters.state.guests.adults,
        },
      });
    },
    [filters]
  );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* Filters */}
          Filteri
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />
    </>
  );

  const renderDateRange = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {/* Durations */}
        Period
      </Typography>

      <DatePicker
        label="Datum dolaska"
        value={dayjs(filters.state.startDate) as Dayjs}
        onChange={(_date) => handleFilterStartDate(_date?.toDate() as Date)}
        sx={{ mb: 2.5 }}
      />

      <DatePicker
        label="Datum odlaska"
        value={dayjs(filters.state.endDate) as Dayjs}
        onChange={(_date) => handleFilterEndDate(_date?.toDate() as Date)}
        slotProps={{
          textField: {
            error: dateError,
            helperText: dateError
              ? "End date must be later than start date"
              : null,
          },
        }}
      />
    </Box>
  );

  const renderDestination = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Lokacija
      </Typography>
      <Autocomplete
        value={filters.state.location}
        options={[
          "",
          "Beograd",
          "Novi Sad",
          "Niš",
          "Pirot",
          "Kopaonik",
          "Zlatibor",
          "Subotica",
          "Tara",
        ]}
        onChange={(_, value) => handleLocationChange(value ?? "")}
        autoHighlight={false}
        disableCloseOnSelect={false}
        renderInput={(params) => <TextField {...params} label="Grad" />}
      />
    </Box>
  );

  const renderAdultGuests = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Odrasli
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={filters.state.guests.adults}
          disabledDecrease={filters.state.guests.adults <= 1}
          onIncrease={() =>
            handleFilterAdultGuests(filters.state.guests.adults + 1)
          }
          onDecrease={() =>
            handleFilterAdultGuests(filters.state.guests.adults - 1)
          }
        />
      </Stack>
    </Stack>
  );
  const renderChildrenGuests = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Deca
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={filters.state.guests.children}
          disabledDecrease={filters.state.guests.children <= 0}
          onIncrease={() =>
            handleFilterChildrenGuests(filters.state.guests.children + 1)
          }
          onDecrease={() =>
            handleFilterChildrenGuests(filters.state.guests.children - 1)
          }
        />
      </Stack>
    </Stack>
  );
  const renderServices = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {/* Services */}
        Usluge
      </Typography>
      {services.map((option) => (
        <FormControlLabel
          key={option.label}
          control={
            <Checkbox
              checked={filters.state.services.includes(option.label)}
              onClick={() => handleFilterServices(option.label)}
            />
          }
          label={option.label}
        />
      ))}
    </Box>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        {/* Filters */}
        Filteri
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        {renderHead}

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            <Button variant="contained" onClick={handleApply}>
              Primeni filtere
            </Button>
            {renderDestination}
            {renderDateRange}
            {renderAdultGuests}
            {renderChildrenGuests}
            {renderServices}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
