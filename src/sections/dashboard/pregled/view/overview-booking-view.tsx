"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { DashboardContent } from "src/layouts/dashboard";
import {
  _bookings,
  _bookingNew,
  _bookingReview,
  _bookingsOverview,
} from "src/_mock";
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from "src/assets/illustrations";

import { BookingBooked } from "../booking-booked";
import { BookingAvailable } from "../booking-available";
import { BookingTotalIncomes } from "../booking-total-incomes";
import { BookingWidgetSummary } from "../booking-widget-summary";
import { BookingCheckInWidgets } from "../booking-check-in-widgets";
import { Typography } from "@mui/material";
import { useAuthContext } from "@/auth/hooks";
import { api } from "@/trpc/react";
import DashboardSkeleton from "../booking-dashboard-skeleton";
import { ReservationStatus } from "@prisma/client";
import { EmptyContent } from "@/components/empty-content";

// ----------------------------------------------------------------------

export function OverviewBookingView() {
  const { user } = useAuthContext();
  const { data, isPending } = api.adminReservation.list.useQuery({
    adminId: user?.id ?? "",
    // adminId: "f811e9b5-f284-4310-aca5-0033e2a47d06",
    // adminId: "",
  });
  console.log({ res: data?.reservations });
  const reservationStatuses: ReservationStatus[] = [
    "PENDING",
    "AWAITING_CONFIRMATION",
    "CONFIRMED",
    "CANCELLED",
  ];

  if (data && data.reservations.length === 0) {
    return (
      <DashboardContent maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Dobrodošli nazad, {user?.displayName} 👋
        </Typography>
        <EmptyContent
          title="Jos uvek nemate kreiranih rezervacija"
          description="Nakon prve kreirane rezervacije prikazaćemo Vaš dashboard"
        />
        ;
      </DashboardContent>
    );
  }

  const allApartments =
    data && data.reservations.map((res) => res.Room.apartmentId);

  const apartmentIdsWithReservations =
    data && data.reservations
      ? data.reservations
          .map((reservation) => reservation.Room.apartment.id)
          .filter((id, index, self) => self.indexOf(id) === index) // Uklanja duplikate
      : [];

  // Pronađi apartmane koji nemaju nijednu rezervaciju
  const apartmentsWithoutReservations =
    allApartments &&
    allApartments.filter(
      (apartmentId) =>
        apartmentIdsWithReservations &&
        !apartmentIdsWithReservations.includes(apartmentId)
    );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 5 }}>
        Dobrodošli nazad, {user?.displayName} 👋
      </Typography>
      {!isPending && data && data.reservations && (
        <Grid container spacing={3} disableEqualOverflow>
          <Grid xs={12} md={4}>
            <BookingWidgetSummary
              title="Ukupno rezervacija"
              percent={0}
              total={data.reservations.length}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <BookingWidgetSummary
              title="Prodatih"
              percent={0}
              total={
                data.reservations.filter((res) => res.status === "CONFIRMED")
                  .length
              }
              icon={<CheckInIllustration />}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <BookingWidgetSummary
              title="Nedovršene rezervacije"
              percent={0}
              total={
                data.reservations.filter((res) => res.status === "PENDING")
                  .length
              }
              icon={<CheckoutIllustration />}
            />
          </Grid>

          <Grid container xs={12}>
            <Grid xs={12} md={7} lg={8}>
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
                  <BookingTotalIncomes
                    title="Ukupni prihodi"
                    total={data.totalIncome}
                    // TODO
                    percent={0}
                    chart={{
                      categories: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                      ],
                      series: [
                        { data: [10, 41, 80, 100, 60, 120, 69, 91, 160] },
                      ],
                    }}
                  />

                  <BookingBooked
                    title="Rezervacije"
                    data={reservationStatuses.map((status) => ({
                      status: status,
                      quantity: data.reservations.filter(
                        (_res) => _res.status === status
                      ).length,
                      value:
                        (data.reservations.filter(
                          (_res) => _res.status === status
                        ).length /
                          data.reservations.length) *
                        100,
                    }))}
                    sx={{ boxShadow: { md: "none" } }}
                  />
                </Box>

                <BookingCheckInWidgets
                  chart={{
                    series: [
                      {
                        label: "Naplaćeno",
                        percent: Number(
                          (
                            (data.reservations.filter(
                              (res) => res.status === "CONFIRMED"
                            ).length /
                              data.reservations.length) *
                            100
                          ).toFixed(0)
                        ),
                        total: data.reservations.filter(
                          (res) => res.status === "CONFIRMED"
                        ).length,
                      },
                      {
                        label: "Čeka na naplatu",
                        percent: Number(
                          (
                            (data.reservations.filter(
                              (res) => res.status === "AWAITING_CONFIRMATION"
                            ).length /
                              data.reservations.length) *
                            100
                          ).toFixed(0)
                        ),
                        total: data.reservations.filter(
                          (res) => res.status === "AWAITING_CONFIRMATION"
                        ).length,
                      },
                    ],
                  }}
                  sx={{ boxShadow: { md: "none" } }}
                />
              </Box>
            </Grid>

            <Grid xs={12} md={5} lg={4}>
              <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
                <BookingAvailable
                  title="Iskorišćenost apartmana"
                  chart={{
                    series: [
                      {
                        label: "Sa rezervacijom",
                        value: apartmentIdsWithReservations?.length ?? 0,
                      },
                      {
                        label: "Bez rezervacije",
                        value: apartmentsWithoutReservations?.length ?? 0,
                      },
                    ],
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      )}
      {isPending && <DashboardSkeleton />}
    </DashboardContent>
  );
}
