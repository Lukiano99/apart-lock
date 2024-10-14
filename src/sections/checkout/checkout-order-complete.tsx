import type { DialogProps } from "@mui/material/Dialog";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { OrderCompleteIllustration } from "src/assets/illustrations";

import { Iconify } from "src/components/iconify";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onReset: () => void;
  onDownloadPDF: () => void;
};

export function CheckoutOrderComplete({ open, onReset, onDownloadPDF }: Props) {
  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          width: { md: `calc(100% - 48px)` },
          height: { md: `calc(100% - 48px)` },
        },
      }}
    >
      <Box
        gap={5}
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{
          py: 5,
          m: "auto",
          maxWidth: 600,
          textAlign: "center",
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Rezervacija je spremna!</Typography>
        <Box
          sx={{
            width: "30%",
            height: "30%",
          }}
        >
          <OrderCompleteIllustration />
        </Box>

        <Typography>
          Hvala vam na uspešnom kreiranju i plaćanju rezervacije!
          <br />
          <br />
          <Link>01dc1370-3df6-11eb-b378-0242ac130002</Link>
          <br />
          <br />
          U najkraćem roku, poslaćemo vam obaveštenje putem email-a kada vaša
          rezervacija bude potvrđena kao i ConfirmationKey za bravu apartmana.
          <br /> Ako imate bilo kakvih pitanja ili nedoumica, slobodno nas
          kontaktirajte. <br />
          Sve najbolje,
        </Typography>

        <Divider sx={{ width: 1, borderStyle: "dashed" }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button
            LinkComponent={RouterLink}
            href={`${paths.apartments.root}`}
            size="large"
            color="inherit"
            variant="outlined"
            onClick={onReset}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Nazad na apartmane
          </Button>

          <Button
            size="large"
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-download-fill" />}
            onClick={onDownloadPDF}
          >
            Skini PDF rezervacije
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
