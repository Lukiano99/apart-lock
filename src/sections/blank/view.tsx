"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { varAlpha } from "src/theme/styles";
import { DashboardContent } from "src/layouts/dashboard";
import { Button } from "@mui/material";
import { useCheckoutContext } from "../checkout/context";

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function BlankView({ title = "Blank" }: Props) {
  const checkout = useCheckoutContext();
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Button
          onClick={checkout.onBackStep}
          variant="outlined"
          color="primary"
          disabled={checkout.activeStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={checkout.onNextStep}
          variant="outlined"
          color="primary"
        >
          {checkout.activeStep < 2 ? "Next" : "Finish"}
        </Button>
      </Box>
    </DashboardContent>
  );
}
