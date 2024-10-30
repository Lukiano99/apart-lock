"use client";
import { env } from "@/env";
import { DashboardContent } from "@/layouts/dashboard";
import { createTemporaryPassword } from "@/utils/tuya/helper";
import { tuyaApiRequest } from "@/utils/tuya/tuya-util";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const TuyaView = () => {
  const [apiResponse, setApiResponse] = useState<{
    id: null | string;
    name: null | string;
  }>({
    id: null,
    name: null,
  });

  const test = env.NEXT_PUBLIC_TUYA_URL;

  const handleCreatePassword = async () => {
    // const password = "1234567";
    // const newPassword = createTemporaryPassword(password);
    // setEncryptedPassword(newPassword);
    const data = await tuyaApiRequest(
      "GET",
      `/v1.0/users/${env.NEXT_PUBLIC_TUYA_USER_UUID}/devices`
    );
    console.log(data);
    const responseData = JSON.stringify(data);

    setApiResponse({
      id: data.result[0].id,
      name: data.result[0].name,
    });
  };

  return (
    <DashboardContent>
      <Typography variant="h3">Tuya Testing 🔑</Typography>
      <Stack width={300} spacing={4} mt={10}>
        <Stack width={300} spacing={4} mt={10}>
          <Button variant="contained" onClick={handleCreatePassword}>
            Izlistaj uredjaje
          </Button>
          <Typography variant="body2" color={"primary"} maxWidth={400}>
            device_name: {apiResponse.name}
          </Typography>
          <Typography variant="body2" color={"primary"} maxWidth={400}>
            device_id: {apiResponse.id}
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
