import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { fCurrency } from "src/utils/format-number";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

type Props = {
  total: number;
  subtotal: number;
  quantity: number;
  discount?: number;
  shipping?: number;
  serviceFee?: number;
  onEdit?: () => void;
  onApplyDiscount?: (discount: number) => void;
};

export function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  quantity,
  shipping,
  serviceFee,
  onApplyDiscount,
}: Props) {
  const displayShipping = shipping !== null ? "Besplatno" : "-";
  const displayServiceFee = serviceFee !== null ? "Besplatno" : "-";

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Detalji rezervacije" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: "text.secondary" }}
          >
            Cena noćenja
          </Typography>
          <Typography component="span" variant="subtitle2">
            {fCurrency(subtotal)}
          </Typography>
        </Box>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: "text.secondary" }}
          >
            Broj noćenja
          </Typography>
          <Typography component="span" variant="subtitle2">
            {quantity}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: "text.secondary" }}
          >
            Usluga čišćenja
          </Typography>
          <Typography component="span" variant="subtitle2">
            {serviceFee ? fCurrency(serviceFee) : displayServiceFee}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box display="flex">
          <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Ukupno
          </Typography>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ display: "block", color: "error.main" }}
            >
              {fCurrency(total)}
            </Typography>
          </Box>
        </Box>

        {onApplyDiscount && (
          <TextField
            fullWidth
            placeholder="Discount codes / Gifts"
            value="DISCOUNT5"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="primary"
                    onClick={() => onApplyDiscount(5)}
                    sx={{ mr: -0.5 }}
                  >
                    Apply
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>
    </Card>
  );
}
