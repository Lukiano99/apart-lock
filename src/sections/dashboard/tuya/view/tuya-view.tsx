"use client";
import { env } from "@/env";
import { DashboardContent } from "@/layouts/dashboard";
import { createTemporaryPassword } from "@/utils/tuya/helper";
import { tuyaApiRequest } from "@/utils/tuya/tuya-util";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const TuyaView = () => {
  const [apiResponse, setApiResponse] = useState("");

  const test = env.NEXT_PUBLIC_TUYA_URL;

  const handleListDevices = async () => {
    // const password = "1234567";
    // const newPassword = createTemporaryPassword(password);
    // setEncryptedPassword(newPassword);
    const data = await tuyaApiRequest(
      "GET",
      `/v1.0/users/${env.NEXT_PUBLIC_TUYA_USER_UUID}/devices`
    );
    // const data = await tuyaApiRequest(
    //   "POST",
    //   `/v1.0/devices/${env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID}/door-lock/password-ticket`
    // );
    console.log(data);

    setApiResponse(JSON.stringify(data).toWellFormed());
  };
  const handlePasswordTicket = async () => {
    const data = await tuyaApiRequest(
      "POST",
      `/v1.0/devices/${env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID}/door-lock/password-ticket`
    );

    console.log(data);

    setApiResponse(JSON.stringify(data).toWellFormed());
  };

  return (
    <DashboardContent>
      <Typography variant="h3">Tuya Testing 🔑</Typography>
      <Stack width={300} spacing={4} mt={10}>
        <Stack width={300} spacing={4} mt={10}>
          <Button variant="contained" onClick={handleListDevices}>
            Izlistaj uredjaje
          </Button>
          <Button variant="contained" onClick={handlePasswordTicket}>
            Get Password Ticket
          </Button>
          <Typography variant="body2" color={"primary"} maxWidth={400}>
            {apiResponse}
          </Typography>
          <Typography variant="body2" color={"secondary"}>
            {test}
          </Typography>
        </Stack>
        {/* <Button variant="contained">Click</Button> */}
        {/* <Button variant="contained">Click</Button> */}
      </Stack>
    </DashboardContent>
  );
};

export default TuyaView;
