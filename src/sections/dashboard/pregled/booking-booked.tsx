import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import { fShortenNumber } from "src/utils/format-number";

import { varAlpha } from "src/theme/styles";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: {
    value: number;
    status: string;
    quantity: number;
  }[];
};

export function BookingBooked({ title, subheader, data, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        component="ul"
        sx={{ p: 3, gap: 3, display: "flex", flexDirection: "column" }}
      >
        {data.map((progress) => (
          <li key={progress.status}>
            <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
              <Box sx={{ typography: "overline", flexGrow: 1 }}>
                {progress.status === "PENDING"
                  ? "U procesu kreiranja"
                  : progress.status === "AWAITING_CONFIRMATION"
                    ? "Čeka se potvrda"
                    : progress.status === "CONFIRMED"
                      ? "Potvrđeno"
                      : progress.status === "CANCELLED"
                        ? "Otkazano"
                        : "Nepoznat status"}
              </Box>
              <Box sx={{ typography: "subtitle1" }}>
                {fShortenNumber(progress.quantity)}
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress.value}
              sx={{
                height: 8,
                bgcolor: (theme) =>
                  varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
                [`& .${linearProgressClasses.bar}`]: {
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.vars.palette.success.light} 0%, ${theme.vars.palette.success.main} 100%)`,

                  ...(progress.status === "PENDING" && {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.vars.palette.warning.light} 0%, ${theme.vars.palette.warning.main} 100%)`,
                  }),

                  ...(progress.status === "AWAITING_CONFIRMATION" && {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.vars.palette.info.light} 0%, ${theme.vars.palette.info.main} 100%)`,
                  }),

                  ...(progress.status === "CONFIRMED" && {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.vars.palette.success.light} 0%, ${theme.vars.palette.success.main} 100%)`,
                  }),

                  ...(progress.status === "CANCELLED" && {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.vars.palette.error.light} 0%, ${theme.vars.palette.error.main} 100%)`,
                  }),
                },
              }}
            />
          </li>
        ))}
      </Box>
    </Card>
  );
}
