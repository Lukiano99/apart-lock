"use client";
import { ApartmentsContent } from "@/layouts/apartments";
import { RouterLink } from "@/routes/components";
import { varAlpha } from "@/theme/styles";
import { Button } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material";

type Props = {
  title?: string;
};
const TestReservationView = ({ title = "Test" }: Props) => {
  return (
    <ApartmentsContent maxWidth="xl">
      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4"> {title} </Typography>

        <Box
          sx={{
            p: 10,
            mt: 5,
            width: 1,
            height: 320,
            borderRadius: 2,
            bgcolor: (theme) =>
              varAlpha(theme.vars.palette.grey["500Channel"], 0.04),
            border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          }}
        ></Box>
      </Stack>
    </ApartmentsContent>
  );
};

export default TestReservationView;
