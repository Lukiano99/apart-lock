import { Skeleton } from "@mui/material";
import { Grid } from "@mui/material";

const ApartmentsSkeleton = () => {
  return (
    <>
      {Array(9)
        .fill(null)
        .map((_, idx) => (
          <Grid xs={12} md={4} item key={idx}>
            <Skeleton
              sx={{
                width: 1,
                height: "300px",
              }}
            />
          </Grid>
        ))}
    </>
  );
};

export default ApartmentsSkeleton;
