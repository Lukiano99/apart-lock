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
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";

import { fDate, fIsAfter, fTime } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";
import { usePopover, CustomPopover } from "src/components/custom-popover";
import { Room } from "@prisma/client";
import { fCurrency } from "@/utils/format-number";
import { Stack } from "@mui/material";
import { RoomsTableToolbar } from "../rooms-table-toolbar";
import { useSetState } from "@/hooks/use-set-state";
import { IInvoiceTableFilters } from "@/types/invoice";
import { INVOICE_SERVICE_OPTIONS } from "@/_mock";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headLabel: TableHeadCustomProps["headLabel"];
  tableData: Room[];
};

export function ApartmentRooms({
  title,
  subheader,
  headLabel,
  tableData,
  ...other
}: Props) {
  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} /> */}
      <RoomsTableToolbar
        // filters={filters}
        dateError={false}
        // onResetPage={table.onResetPage}
        options={{
          services: INVOICE_SERVICE_OPTIONS.map((option) => option.name),
        }}
      />
      <Scrollbar sx={{ minHeight: 462 }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>
            {tableData.map((row) => (
              <RowItem key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: "dashed" }} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: Props["tableData"][number];
};

function RowItem({ row }: RowItemProps) {
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
    <>
      <TableRow>
        <TableCell>
          {row.bed_count} {row.bed_count === 1 ? "krevet" : "kreveta"}
        </TableCell>

        <TableCell>
          {[...Array(row.bed_count)].map((_, index) => (
            <Iconify icon="mdi:account" style={{ marginLeft: 0 }} />
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
            color={
              (!row.occupiedFrom && !row.occupiedUntil && "success") ||
              (row.occupiedFrom &&
                new Date() < row.occupiedFrom &&
                "success") ||
              (row.occupiedUntil &&
                new Date() > row.occupiedUntil &&
                "success") ||
              "error"
            }
          >
            {(!row.occupiedFrom && !row.occupiedUntil && "dostupno") ||
              (row.occupiedFrom &&
                new Date() < row.occupiedFrom &&
                "dostupno") ||
              (row.occupiedUntil &&
                new Date() > row.occupiedUntil &&
                "dostupno") ||
              "nedostupno"}
          </Label>
        </TableCell>

        <TableCell align="left" sx={{ pr: 1 }}>
          <Button color="primary" variant="contained">
            Reserviši
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
      </TableRow>

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
    </>
  );
}
