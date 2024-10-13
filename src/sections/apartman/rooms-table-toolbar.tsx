import type { IDatePickerControl } from "src/types/common";
import type { IInvoiceTableFilters } from "src/types/invoice";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { UseSetStateReturn } from "src/hooks/use-set-state";

import { useCallback, useEffect, useState } from "react";

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
import dayjs from "dayjs";
import { Button } from "@mui/material";

import qs from "query-string";
import { useRouter } from "next/navigation";
// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage?: () => void;
  filters?: UseSetStateReturn<IInvoiceTableFilters>;
  startDate: Date | null;
  endDate: Date | null;
};

export function RoomsTableToolbar({
  filters,
  dateError,
  onResetPage,
  startDate: _startDate,
  endDate: _endDate,
}: Props) {
  const popover = usePopover();

  const [startDate, setStartDate] = useState<Date | null>(_startDate);
  const [endDate, setEndDate] = useState<Date | null>(_endDate);

  useEffect(() => {
    setStartDate(_startDate);
    setEndDate(_endDate);
  }, [_startDate, _endDate]);

  const router = useRouter();

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

  const handleFilterStartDate = (newValue: IDatePickerControl) => {
    if (newValue) {
      setStartDate(newValue.toDate()); // Konverzija Dayjs u Date
    } else {
      setStartDate(null); // Ako nema vrednosti, postavi na null
    }
  };

  const handleFilterEndDate = (newValue: IDatePickerControl) => {
    if (newValue) {
      setEndDate(newValue.toDate()); // Konverzija Dayjs u Date
    } else {
      setEndDate(null); // Ako nema vrednosti, postavi na null
    }
  };

  const handleApply = () => {
    const query = {
      startDate: startDate ? startDate.toLocaleDateString("en-CA") : undefined, // Ispravno formatiranje
      endDate: endDate ? endDate.toLocaleDateString("en-CA") : undefined, // Ispravno formatiranje
    };

    // Create query string using query-string package
    const queryStringified = qs.stringify(query, {
      skipNull: true, // Skip null or undefined values
      skipEmptyString: true, // Skip empty strings
    });

    // Push new URL with updated query parameters
    router.push(`?${queryStringified}`);
  };

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
          value={startDate ? dayjs(startDate) : null}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="Odlazak"
          value={endDate ? dayjs(endDate) : null}
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

        <Button variant="text" onClick={handleApply}>
          Primeni
        </Button>
      </Stack>
    </>
  );
}
