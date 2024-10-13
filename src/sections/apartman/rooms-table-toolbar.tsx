import type { IDatePickerControl } from "src/types/common";
import type { IInvoiceTableFilters } from "src/types/invoice";
import type { UseSetStateReturn } from "src/hooks/use-set-state";

import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formHelperTextClasses } from "@mui/material/FormHelperText";

import { Iconify } from "src/components/iconify";
import { usePopover, CustomPopover } from "src/components/custom-popover";
import dayjs from "dayjs";
import { Box, Button, Typography } from "@mui/material";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { IncrementerButton } from "../apartmani/components/incrementer-button";
// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage?: () => void;
  filters?: UseSetStateReturn<IInvoiceTableFilters>;
  startDate: Date | null;
  endDate: Date | null;
  guests: {
    adults: number;
    children: number;
  };
};

export function RoomsTableToolbar({
  filters,
  dateError,
  onResetPage,
  startDate: _startDate,
  endDate: _endDate,
  guests: _guests,
}: Props) {
  const popover = usePopover();

  const [startDate, setStartDate] = useState<Date | null>(_startDate);
  const [endDate, setEndDate] = useState<Date | null>(_endDate);
  const [guests, setGuests] = useState<{ adults: number; children: number }>(
    _guests
  );

  useEffect(() => {
    setStartDate(_startDate);
    setEndDate(_endDate);
  }, [_startDate, _endDate]);

  const router = useRouter();

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

  const handleFilterAdultGuests = (newValue: number) => {
    setGuests({
      adults: newValue,
      children: guests.children,
    });
  };
  const handleFilterChildrenGuests = (newValue: number) => {
    setGuests({
      adults: guests.adults,
      children: newValue,
    });
  };

  const handleApply = () => {
    const query = {
      startDate: startDate ? startDate.toLocaleDateString("en-CA") : undefined, // Ispravno formatiranje
      endDate: endDate ? endDate.toLocaleDateString("en-CA") : undefined, // Ispravno formatiranje
      adults: guests.adults > 1 ? guests.adults : undefined,
      children: guests.children > 0 ? guests.children : undefined,
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
        <Button
          disableRipple
          color="inherit"
          onClick={popover.onOpen}
          endIcon={
            <Iconify
              icon={
                popover.open
                  ? "eva:arrow-ios-upward-fill"
                  : "eva:arrow-ios-downward-fill"
              }
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            />
          }
          sx={{ fontWeight: "fontWeightSemiBold" }}
        >
          <Iconify icon={"mdi:user"} />
          <Stack
            component="span"
            direction="row"
            sx={{
              ml: 0.5,
              fontWeight: "fontWeightBold",
              textTransform: "capitalize",
              alignItems: "center",
              flex: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            {`Odrasli ${guests.adults}`}
            <Iconify icon={"mdi:dot"} />
            {`Deca ${guests.children}`}
          </Stack>
        </Button>
        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
        >
          <Stack
            direction={"column"}
            sx={{ width: 250, pr: 5, pl: 2, py: 2, gap: 2 }}
          >
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                Odrasli
              </Typography>

              <Stack spacing={1}>
                <IncrementerButton
                  name="quantity"
                  quantity={guests.adults}
                  disabledDecrease={guests.adults <= 1}
                  onIncrease={() => handleFilterAdultGuests(guests.adults + 1)}
                  onDecrease={() => handleFilterAdultGuests(guests.adults - 1)}
                />
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                Deca
              </Typography>

              <Stack spacing={1}>
                <IncrementerButton
                  name="quantity"
                  quantity={guests.children}
                  disabledDecrease={guests.children <= 0}
                  onIncrease={() =>
                    handleFilterChildrenGuests(guests.children + 1)
                  }
                  onDecrease={() =>
                    handleFilterChildrenGuests(guests.children - 1)
                  }
                />
              </Stack>
            </Stack>
          </Stack>
        </CustomPopover>

        <Button
          variant="contained"
          onClick={handleApply}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Primeni
        </Button>
      </Stack>
    </>
  );
}
