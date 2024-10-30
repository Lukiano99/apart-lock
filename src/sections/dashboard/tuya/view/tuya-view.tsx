"use client";
import { env } from "@/env";
import { DashboardContent } from "@/layouts/dashboard";
import { createTemporaryPassword } from "@/utils/tuya/helper";
import { tuyaApiRequest } from "@/utils/tuya/tuya-util";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const TuyaView = () => {
  const [encryptedPassword, setEncryptedPassword] = useState("");

  const test = env.NEXT_PUBLIC_TUYA_URL;

  const handleCreatePassword = async () => {
    // const password = "1234567";
    // const newPassword = createTemporaryPassword(password);
    // setEncryptedPassword(newPassword);
    const data = await tuyaApiRequest(
      "GET",
      `v1.0/devices/${process.env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID}/door-lock/temp-passwords`
    );
    console.log(data);
    setEncryptedPassword("izvrseno, proveri konzolu");
  };

  return (
    <DashboardContent>
      <Typography variant="h3">Tuya Testing 🔑</Typography>
      <Stack width={300} spacing={4} mt={10}>
        <Stack width={300} spacing={4} mt={10}>
          <Button variant="contained" onClick={handleCreatePassword}>
            Kreiraj sifru
          </Button>
          <Typography variant="body2" color={"primary"}>
            {encryptedPassword}
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
