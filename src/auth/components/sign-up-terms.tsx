import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="span"
      sx={{
        mt: 3,
        display: "block",
        textAlign: "center",
        typography: "caption",
        color: "text.secondary",
        ...sx,
      }}
      {...other}
    >
      {"Prijavom prihvatam "}
      <Link underline="always" color="text.primary">
        Terms of service
      </Link>
      {" i "}
      <Link underline="always" color="text.primary">
        Privacy policy
      </Link>
      .
    </Box>
  );
}
