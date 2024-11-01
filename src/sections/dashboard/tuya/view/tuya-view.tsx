"use client";
import { env } from "@/env";
import { DashboardContent } from "@/layouts/dashboard";
import { api } from "@/trpc/react";
import {
  createTemporaryPassword,
  fetchTicketAccessKey,
  sendEmail,
  tuyaApiRequest,
} from "@/utils/tuya/tuya-util";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const TuyaView = () => {
  const [apiResponse, setApiResponse] = useState("");

  const test = env.NEXT_PUBLIC_TUYA_URL;

  const handleListDevices = async () => {
    const data = await tuyaApiRequest(
      "GET",
      `/v1.0/users/${env.NEXT_PUBLIC_TUYA_USER_UUID}/devices`
    );

    console.log(data);
    setApiResponse(JSON.stringify(data).toWellFormed());
  };

  const handleTicketAccessKey = async () => {
    const data = await fetchTicketAccessKey();
    console.log(data);

    setApiResponse(
      JSON.stringify(
        `ticket_key: ${data.result.ticket_key}, ticket_id: ${data.result.ticket_id}, expire_time: ${data.result.expire_time},`
      ).toWellFormed()
    );
  };

  const handleSetTemporaryPassword = async () => {
    const password = "1234567";
    const data = await createTemporaryPassword({
      password,
      customer: "hard coded 1234567",
      check_in: new Date(Date.now() - 2 * 1000 * 60 * 60 * 24).getTime(),
      check_out: new Date(Date.now() + 5 * 1000 * 60 * 60 * 24).getTime(),
    });
    console.log(data);

    setApiResponse(JSON.stringify(data).toWellFormed());
  };

  const handleSendTuyaEmail = async () => {
    const data = await sendEmail();
    console.log(data);

    setApiResponse(JSON.stringify(data).toWellFormed());
  };
  const { mutate: sendGmailEmail } = api.email.send.useMutation();
  const handleSendGmailEmail = async () => {
    const data = sendGmailEmail();
    console.log(data);

    // setApiResponse(JSON.stringify(data).toWellFormed());
  };

  return (
    <DashboardContent>
      <Typography variant="h3">Tuya Testing 🔑</Typography>

      <Stack spacing={4} mt={10}>
        <Typography variant="caption">
          Tuya URL:
          <Typography variant="body2" color={"secondary"}>
            {test}
          </Typography>
        </Typography>

        <Stack spacing={4} direction={"row"}>
          <Button fullWidth variant="contained" onClick={handleListDevices}>
            Izlistaj uredjaje
          </Button>

          <Button fullWidth variant="contained" onClick={handleTicketAccessKey}>
            Get Password Ticket
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSetTemporaryPassword}
          >
            Postavi sifru 1234567
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleSendTuyaEmail}
          >
            Posalji mail preko Tuya-e
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="info"
            onClick={handleSendGmailEmail}
          >
            Posalji mail preko Gmail-a
          </Button>
        </Stack>

        <Typography variant="body1" color="primary">
          {apiResponse}
        </Typography>
      </Stack>
    </DashboardContent>
  );
};

export default TuyaView;
