import type { IDatePickerControl } from "src/types/common";
import type { IInvoiceTableFilters } from "src/types/invoice";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { UseSetStateReturn } from "src/hooks/use-set-state";

import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formHelperTextClasses } from "@mui/material/FormHelperText";

import { Iconify } from "src/components/iconify";
import { usePopover, CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage?: () => void;
  filters?: UseSetStateReturn<IInvoiceTableFilters>;
  options: {
    services: string[];
  };
};

export function RoomsTableToolbar({
  filters,
  options,
  dateError,
  onResetPage,
}: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage && onResetPage();
      filters && filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value;

      onResetPage && onResetPage();
      filters && filters.setState({ service: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage && onResetPage();
      filters && filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage && onResetPage();
      filters && filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: "flex-end", md: "center" }}
        direction={{ xs: "column", md: "row" }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <DatePicker
          label="Dolazak"
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="Odlazak"
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError
                ? "Datum odlaska mora biti kasniji od datuma dolaska"
                : null,
            },
          }}
          sx={{
            maxWidth: { md: 180 },
            [`& .${formHelperTextClasses.root}`]: {
              bottom: { md: -40 },
              position: { md: "absolute" },
            },
          }}
        />
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">
            Gosti
          </InputLabel>

          <Select
            disabled
            onChange={handleFilterService}
            input={<OutlinedInput label="Service" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            inputProps={{ id: "invoice-filter-service-select-label" }}
            sx={{ textTransform: "capitalize" }}
          >
            {options.services.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={false} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
