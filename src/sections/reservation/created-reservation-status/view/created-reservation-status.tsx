"use client";
import { Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { ReservationStatus } from "@prisma/client";
import CanceledReservation from "../canceled-reservation";

interface CreatedReservationStatusViewProps {
  status: ReservationStatus;
}
const steps = [
  "Popunili ste rezervaciju 📝",
  "Rezervacija čeka na obradu ⏳",
  "Rezervacija je potvrđena ✅",
];
const CreatedReservationStatusView = ({
  status,
}: CreatedReservationStatusViewProps) => {
  let activeStep;
  switch (status) {
    case "PENDING":
      activeStep = 0;
      break;
    case "AWAITING_CONFIRMATION":
      activeStep = 1;
      break;
    case "CONFIRMED":
      activeStep = 2;
      break;
    case "CANCELLED":
      activeStep = -1;
      break;
  }
  if (activeStep === -1) {
    return <CanceledReservation />;
  }

  return (
    <Stack
      sx={{
        pt: 5,
      }}
    >
      <Typography variant="h3" mx={"auto"}>
        Status vaše rezervacije
      </Typography>

      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 5,
          height: 500,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: {
              completed?: boolean;
            } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Stack>
    </Stack>
  );
};

export default CreatedReservationStatusView;
