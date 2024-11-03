"use client";

import { useAuthContext } from "@/auth/hooks";
import { EmptyContent } from "@/components/empty-content";
import { DashboardContent } from "@/layouts/dashboard";
import { api, RouterOutputs } from "@/trpc/react";
import {
  Box,
  Card,
  IconButton,
  Tab,
  TableBody,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReservationStatus } from "@prisma/client";
import DashboardSkeleton from "../../pregled/booking-dashboard-skeleton";
import { BookingDetails } from "../booking-details";
import { _bookings } from "@/_mock";
import { useSetState } from "@/hooks/use-set-state";
import { IReservationFilters } from "@/schemas/reservations-table";
import {
  emptyRows,
  getComparator,
  rowInPage,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from "@/components/table";
import { useCallback, useEffect, useState } from "react";
import { varAlpha } from "@/theme/styles";
import { Label } from "@/components/label";
import { OrderTableToolbar } from "../order-table-toolbar";
import { fIsAfter, fIsBetween } from "@/utils/format-time";
import { OrderTableFiltersResult } from "../order-table-filters-result";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { Table } from "@mui/material";
import { OrderTableRow } from "../order-table-row";
import { useBoolean } from "@/hooks/use-boolean";
import { toast } from "@/components/snackbar";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------
const RESERVATION_STATUSES: {
  value: ReservationStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "U procesu kreiranja" },
  { value: "AWAITING_CONFIRMATION", label: "Čeka se potvrda" },
  { value: "CONFIRMED", label: "Potvrđeno" },
  { value: "CANCELLED", label: "Otkazano" },
];

const TABLE_HEAD = [
  { id: "apartment", label: "Apartman" },
  { id: "room", label: "Soba" },
  { id: "confirmationKey", label: "Lozinka" },
  { id: "name", label: "Korisnik" },
  { id: "createdAt", label: "Kreirana" },
  { id: "checkIn", label: "Check in" },
  { id: "checkOut", label: "Check out" },
  { id: "status", label: "Status" },
  { id: "", label: "" },
];

export function AdminReservationsView() {
  const { user } = useAuthContext();

  const { data, isPending } = api.adminReservation.list.useQuery({
    adminId: user?.id ?? "",
    // adminId: "f811e9b5-f284-4310-aca5-0033e2a47d06",
    // adminId: "",
  });

  const table = useTable({ defaultOrderBy: "createdAt" });

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<
    RouterOutputs["adminReservation"]["list"]["reservations"]
  >(data?.reservations ?? []);

  useEffect(() => {
    if (data) setTableData(data.reservations);
  }, [data]);

  const filters = useSetState<IReservationFilters>({
    name: "",
    status: "all",
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== "all" ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success("Delete success!");

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id)
    );

    toast.success("Delete success!");

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (id: string) => {
      // router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    ...RESERVATION_STATUSES,
  ];

  if (!data || data.reservations.length === 0) {
    return (
      <DashboardContent maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Upravljajte rezervacijama ⚙️
        </Typography>
        <EmptyContent
          title="Jos uvek nemate kreiranih rezervacija"
          description="Nakon prve kreirane rezervacije prikazaćemo Vaš dashboard"
        />
        ;
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 5 }}>
        Upravljajte rezervacijama ⚙️
      </Typography>
      <Card>
        <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.08
              )}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === "all" ||
                      tab.value === filters.state.status) &&
                      "filled") ||
                    "soft"
                  }
                  color={
                    (tab.value === "PENDING" && "warning") ||
                    (tab.value === "AWAITING_CONFIRMATION" && "info") ||
                    (tab.value === "CONFIRMED" && "success") ||
                    (tab.value === "CANCELLED" && "error") ||
                    "default"
                  }
                >
                  {[
                    "PENDING",
                    "AWAITING_CONFIRMATION",
                    "CONFIRMED",
                    "CANCELLED",
                  ].includes(tab.value)
                    ? tableData.filter((user) => user.status === tab.value)
                        .length
                    : tableData.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        {canReset && (
          <OrderTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: "relative" }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar sx={{ minHeight: 444 }}>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={{
                        apartment: row.Room.apartment.name,
                        roomNumber: row.Room.number,
                        check_in: row.check_in,
                        check_out: row.check_out,
                        customer: {
                          email: row.customer.email,
                          name: `${row.customer.firstName} ${row.customer.lastName}`,
                          phone: row.customer.phone,
                        },
                        created_at: row.createdAt,
                        id: row.id,
                        status: row.status,
                        confirmationKey:
                          row.confirmationKey.length > 0
                            ? row.confirmationKey[0].key
                            : "",
                      }}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    dataFiltered.length
                  )}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      {isPending && <DashboardSkeleton />}
    </DashboardContent>
  );
}

type ApplyFilterProps = {
  dateError: boolean;
  inputData: RouterOutputs["adminReservation"]["list"]["reservations"];
  filters: IReservationFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (reservation) =>
        reservation.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        reservation.customer.firstName
          .toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 ||
        reservation.customer.email.toLowerCase().indexOf(name.toLowerCase()) !==
          -1
    );
  }

  if (status !== "all") {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.createdAt, startDate, endDate)
      );
    }
  }

  return inputData;
}
