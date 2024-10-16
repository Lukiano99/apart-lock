import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuList from "@mui/material/MenuList";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "src/hooks/use-boolean";

import { fCurrency } from "src/utils/format-number";
import { fDate, fTime } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import { usePopover, CustomPopover } from "src/components/custom-popover";
import { IReservationItem } from "@/schemas/reservations-table";
import { LoadingButton } from "@mui/lab";
import { api } from "@/trpc/react";
import { Snackbar, toast } from "@/components/snackbar";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/auth/hooks";

// ----------------------------------------------------------------------

type Props = {
  row: IReservationItem;
  selected: boolean;
  onViewRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const router = useRouter();

  const popover = usePopover();

  const { user } = useAuthContext();

  const { mutate: mutateReservationStatus, isPending } =
    api.adminReservation.updateStatus.useMutation();
  const { refetch } = api.adminReservation.list.useQuery({
    adminId: user?.id ?? "",
  });

  const handleAcceptReservation = (reservationId: string) => {
    mutateReservationStatus(
      { reservationId, reservationStatus: "CONFIRMED" },
      {
        onSuccess: () => {
          toast.success("Potvrdili ste rezervaciju", {
            description: reservationId,
          });
          router.refresh();
          refetch();
        },
        onError: (data) => {
          toast.error("Došlo je do greške", { description: data.message });
          router.refresh();
        },
      }
    );
  };
  const handleDeclineReservation = (reservationId: string) => {
    mutateReservationStatus(
      { reservationId, reservationStatus: "CANCELLED" },
      {
        onSuccess: () => {
          toast.success("Otkazali ste rezervaciju", {
            description: reservationId,
          });
          router.refresh();
          refetch();
        },
        onError: (data) => {
          toast.error("Došlo je do greške", { description: data.message });
          router.refresh();
        },
      }
    );
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{
            id: `row-checkbox-${row.id}`,
            "aria-label": `Row checkbox`,
          }}
        />
      </TableCell> */}

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Box component="span" sx={{ color: "text.disabled" }}>
            {row.apartment}
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.customer.name} src={""} />

          <Stack
            sx={{
              typography: "body2",
              flex: "1 1 auto",
              alignItems: "flex-start",
            }}
          >
            <Box component="span">{row.customer.name}</Box>
            <Box component="span" sx={{ color: "text.disabled" }}>
              {row.customer.email}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.created_at)}
          secondary={fTime(row.created_at)}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={fDate(row.check_in)}
          secondary={fTime(row.check_in)}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.check_out)}
          secondary={fTime(row.check_out)}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === "CONFIRMED" && "success") ||
            (row.status === "PENDING" && "warning") ||
            (row.status === "AWAITING_CONFIRMATION" && "info") ||
            (row.status === "CANCELED" && "error") ||
            "default"
          }
        >
          {row.status === "PENDING"
            ? "U procesu kreiranja"
            : row.status === "AWAITING_CONFIRMATION"
              ? "Čeka se potvrda"
              : row.status === "CONFIRMED"
                ? "Potvrđeno"
                : row.status === "CANCELLED"
                  ? "Otkazano"
                  : "Nepoznat status"}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        {row.status === "AWAITING_CONFIRMATION" ? (
          <Stack direction={"row"} spacing={2}>
            <LoadingButton
              variant="contained"
              color="info"
              onClick={() => {
                handleAcceptReservation(row.id);
              }}
              disabled={isPending}
            >
              Potvrdi
            </LoadingButton>
            <LoadingButton
              variant="text"
              color="error"
              onClick={() => handleDeclineReservation(row.id)}
              disabled={isPending}
            >
              Otkazi
            </LoadingButton>
          </Stack>
        ) : (
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      {/* <TableCell sx={{ p: 0, border: "none" }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: "background.neutral" }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  "&:not(:last-of-type)": {
                    borderBottom: (theme) =>
                      `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar
                  src={item.coverUrl}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item.name}
                  secondary={item.sku}
                  primaryTypographyProps={{ typography: "body2" }}
                  secondaryTypographyProps={{
                    component: "span",
                    color: "text.disabled",
                    mt: 0.5,
                  }}
                />

                <div>x{item.quantity} </div>

                <Box sx={{ width: 110, textAlign: "right" }}>
                  {fCurrency(item.price)}
                </Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell> */}
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
