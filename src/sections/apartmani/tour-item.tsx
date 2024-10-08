import type { ITourItem } from "src/types/tour";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fCurrency } from "src/utils/format-number";
import { fDateTime, fDateRangeShortLabel } from "src/utils/format-time";

import { Image } from "src/components/image";
import { Iconify } from "src/components/iconify";
import { usePopover, CustomPopover } from "src/components/custom-popover";
import { Apartment, Image as ApartmentImage } from "@prisma/client";

// ----------------------------------------------------------------------

type Props = {
  // apartment: ITourItem;
  apartment: Apartment & { images: ApartmentImage[] };
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ApartmentItem({ apartment, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: "absolute",
        p: "2px 6px 2px 4px",
        typography: "subtitle2",
        bgcolor: "warning.lighter",
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: "warning.main", mr: 0.25 }} />{" "}
      {/* {apartment.ratingNumber} */}
      {/* TODO */}4
    </Stack>
  );

  const renderPrice = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: "grey.800",
        position: "absolute",
        p: "2px 6px 2px 4px",
        color: "common.white",
        typography: "subtitle2",
      }}
    >
      {/* {!!apartment.priceSale && (
        <Box
          component="span"
          sx={{ color: "grey.500", mr: 0.25, textDecoration: "line-through" }}
        >
          {fCurrency(apartment.priceSale)}
        </Box>
      )} */}
      {fCurrency(apartment.price)}
    </Stack>
  );

  const renderImages = (
    <Box gap={0.5} display="flex" sx={{ p: 1 }}>
      <Box flexGrow={1} sx={{ position: "relative" }}>
        {renderPrice}
        {renderRating}
        <Image
          alt={apartment.images[0].imageUrl}
          src={apartment.images[0].imageUrl}
          sx={{ width: 1, height: 164, borderRadius: 1 }}
        />
      </Box>

      <Box gap={0.5} display="flex" flexDirection="column">
        <Image
          alt={apartment.images[1].imageUrl}
          src={apartment.images[1].imageUrl}
          ratio="1/1"
          sx={{ borderRadius: 1, width: 80, height: 80 }}
        />
        <Image
          alt={apartment.images[2].imageUrl}
          src={apartment.images[2].imageUrl}
          ratio="1/1"
          sx={{ borderRadius: 1, width: 80, height: 80 }}
        />
      </Box>
    </Box>
  );

  const renderTexts = (
    <ListItemText
      sx={{ p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5) }}
      primary={`Posted date: ${fDateTime(apartment.createdAt)}`}
      secondary={
        <Link
          component={RouterLink}
          href={paths.apartments.details(apartment.id)}
          color="inherit"
        >
          {apartment.name}
        </Link>
      }
      primaryTypographyProps={{ typography: "caption", color: "text.disabled" }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: "span",
        color: "text.primary",
        typography: "subtitle1",
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: "relative",
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      {/* Admins only */}
      {/* <IconButton
        onClick={popover.onOpen}
        sx={{ position: "absolute", bottom: 20, right: 8 }}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton> */}

      {[
        {
          icon: (
            <Iconify
              icon="mingcute:location-fill"
              sx={{ color: "error.main" }}
            />
          ),
          // label: apartment.destination,
          label: apartment.location,
        },
        // {
        //   icon: (
        //     <Iconify
        //       icon="solar:clock-circle-bold"
        //       sx={{ color: "info.main" }}
        //     />
        //   ),
        //   label: fDateRangeShortLabel(
        //     apartment.available.startDate,
        //     apartment.available.endDate
        //   ),
        // },
        // {
        //   icon: (
        //     <Iconify
        //       icon="solar:users-group-rounded-bold"
        //       sx={{ color: "primary.main" }}
        //     />
        //   ),
        //   label: `${apartment.bookers.length} Booked`,
        // },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: "body2" }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}

        {renderTexts}

        {renderInfo}
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onView();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          {/* Admins only can edit */}
          {/* <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem> */}
          {/* Admins only can delete */}
          {/* <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}
        </MenuList>
      </CustomPopover>
    </>
  );
}
