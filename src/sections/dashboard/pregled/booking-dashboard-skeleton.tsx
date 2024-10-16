import { Box, Grid, Skeleton } from "@mui/material";

const DashboardSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {/* Skeleton for Overall Reservations */}
      <Grid item xs={12} md={4}>
        <Box sx={{ padding: 2 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={118} />
        </Box>
      </Grid>

      {/* Skeleton for Sold */}
      <Grid item xs={12} md={4}>
        <Box sx={{ padding: 2 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={118} />
        </Box>
      </Grid>

      {/* Skeleton for Canceled */}
      <Grid item xs={12} md={4}>
        <Box sx={{ padding: 2 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={118} />
        </Box>
      </Grid>

      {/* Skeleton for Total Incomes and Bookings Overview */}
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12} md={7} lg={8}>
          <Box
            sx={{
              mb: 3,
              p: { md: 1 },
              display: "flex",
              gap: { xs: 3, md: 1 },
              borderRadius: { md: 2 },
              flexDirection: "column",
              bgcolor: { md: "background.neutral" },
            }}
          >
            <Box
              sx={{
                p: { md: 1 },
                display: "grid",
                gap: { xs: 3, md: 0 },
                borderRadius: { md: 2 },
                bgcolor: { md: "background.paper" },
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                },
              }}
            >
              <Box sx={{ padding: 2 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="rectangular" height={118} />
              </Box>

              <Box sx={{ padding: 2 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rectangular" height={118} />
              </Box>
            </Box>

            <Box sx={{ padding: 2 }}>
              <Skeleton variant="rectangular" height={200} />
            </Box>
          </Box>
        </Grid>

        {/* Skeleton for Available Apartments */}
        <Grid item xs={12} md={5} lg={4}>
          <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rectangular" height={118} />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardSkeleton;
