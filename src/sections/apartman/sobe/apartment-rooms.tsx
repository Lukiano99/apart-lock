import type { IDateValue } from "src/types/common";
import type { CardProps } from "@mui/material/Card";
import type { TableHeadCustomProps } from "src/components/table";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { TableHeadCustom, TableSkeleton } from "src/components/table";
import { usePopover, CustomPopover } from "src/components/custom-popover";
import { fCurrency } from "@/utils/format-number";
import { RoomsTableToolbar } from "../rooms-table-toolbar";
import { paths } from "@/routes/paths";
import { api, RouterOutputs } from "@/trpc/react";
import { RouterLink } from "@/routes/components";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import qs from "query-string";
import { LoadingIcon } from "yet-another-react-lightbox";
// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headLabel: TableHeadCustomProps["headLabel"];
  apartmentId: string;
};

export function ApartmentRooms({
  title,
  subheader,
  headLabel,
  apartmentId,
  ...other
}: Props) {
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (searchParams) {
      const params = qs.parse(searchParams.toString());
      const parsedStartDate = params.startDate
        ? new Date(params.startDate as string)
        : null;
      const parsedEndDate = params.endDate
        ? new Date(params.endDate as string)
        : null;

      setStartDate(parsedStartDate);
      setEndDate(parsedEndDate);
    }
  }, [searchParams]);

  const { data: tableDateRooms, isPending } = api.room.list.useQuery({
    apartmentId,
  });
  const ids = tableDateRooms?.map((r) => r.id);
  console.log({ ids });
  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} /> */}
      <RoomsTableToolbar
        dateError={false}
        startDate={startDate}
        endDate={endDate}
        // onResetPage={table.onResetPage}
      />
      <Scrollbar sx={{ minHeight: 462 }}>
        {
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={headLabel} />

            <TableBody>
              {!isPending &&
                tableDateRooms &&
                tableDateRooms.length > 0 &&
                tableDateRooms.map((row, idx) => (
                  <RowItem
                    key={row.id}
                    row={row}
                    startDate={startDate as Date}
                    endDate={endDate as Date}
                  />
                ))}
              {/* {isPending &&
                !tableDateRooms &&
                Array(10)
                  .fill(null)
                  .map((_, idx) => <TableSkeleton key={idx} />)} */}
            </TableBody>
          </Table>
        }
      </Scrollbar>

      <Divider sx={{ borderStyle: "dashed" }} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  // row: Props["tableData"][number];
  row: RouterOutputs["room"]["list"][number];
  startDate: Date;
  endDate: Date;
};

function RowItem({ row, startDate, endDate }: RowItemProps) {
  const available = !row.reservations.some(
    (reservation) =>
      startDate <= reservation.check_out && endDate >= reservation.check_in
  );

  const theme = useTheme();

  const popover = usePopover();

  const lightMode = theme.palette.mode === "light";

  const handleDownload = () => {
    popover.onClose();
    console.info("DOWNLOAD", row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info("PRINT", row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info("SHARE", row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info("DELETE", row.id);
  };

  return (
    <TableRow>
      <TableCell>
        {row.bed_count} {row.bed_count === 1 ? "krevet" : "kreveta"}
      </TableCell>

      <TableCell>
        {[...Array(row.bed_count)].map((_, index) => (
          <Iconify key={index} icon="mdi:account" style={{ marginLeft: 0 }} />
        ))}
      </TableCell>

      <TableCell>{fCurrency(row.price, { currency: "eur" })}</TableCell>

      <TableCell>
        <Label
          variant={lightMode ? "soft" : "filled"}
          color={
            (row.paymentMethod === "CARD" && "warning") ||
            (row.paymentMethod === "CASH" && "info") ||
            "error"
          }
        >
          {row.paymentMethod === "CASH" ? "Gotovina po dolasku" : "Karticom"}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant={lightMode ? "soft" : "filled"}
          color={available ? "success" : "error"}
        >
          {available ? "Dostupno" : "Nedostupno"}
        </Label>
        {/* <Label variant={lightMode ? "soft" : "filled"} color={"success"}>
            dostupno
          </Label>*/}
      </TableCell>

      <TableCell align="left" sx={{ pr: 1 }}>
        <Button
          component={RouterLink}
          href={paths.apartments.roomReservation(row.apartmentId, row.id)}
          size="large"
          variant="contained"
          color="primary"
          disabled={!available}
        >
          Rezerviši
        </Button>
      </TableCell>

      <TableCell align="right" sx={{ pr: 1 }}>
        <IconButton
          color={popover.open ? "inherit" : "default"}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          <MenuItem onClick={handleDownload}>
            <Iconify icon="eva:cloud-download-fill" />
            Download
          </MenuItem>

          <MenuItem onClick={handleShare}>
            <Iconify icon="solar:share-bold" />
            Share
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </TableRow>
  );
}
