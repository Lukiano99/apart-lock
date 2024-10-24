import { DashboardContent } from "@/layouts/dashboard";
import { varAlpha } from "@/theme/styles";
import { Box, Typography } from "@mui/material";

const TestView = () => {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> Test page </Typography>

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
      />
    </DashboardContent>
  );
};

export default TestView;
