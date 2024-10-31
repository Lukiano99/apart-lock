import { env } from "@/env";
import axios from "axios";
import { decrypt_AES_128, encrypt_AES_128 } from "./encript-decript";
var CryptoJS = require("crypto-js");

const TUYA_URL = env.NEXT_PUBLIC_TUYA_URL;
const TUYA_CLIENT_ID = env.NEXT_PUBLIC_TUYA_CLIENT_ID;
const TUYA_SECRET = env.NEXT_PUBLIC_TUYA_SECRET;
const TUYA_DEVICE_ID = env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID;

let accessToken: string | null = null;
let accessTicketKey: string | null = null;

function getTimestamp(): number {
  var timestamp = new Date().getTime();
  return timestamp;
}

// Pribavlja access token od Tuya API-ja
async function fetchAccessToken(): Promise<string> {
  const timestamp = getTimestamp();

  const nonce = "";
  const signStr = createSignUrl({}, "GET", `/v1.0/token?grant_type=1`, "");
  const signature = calcSignToken(
    TUYA_CLIENT_ID,
    timestamp,
    nonce,
    signStr,
    TUYA_SECRET
  );

  // console.log("Iz access tokena");
  // console.log({ signStr });
  // console.log({ signature });

  const response = await axios.get(`${TUYA_URL}/v1.0/token?grant_type=1`, {
    headers: {
      client_id: TUYA_CLIENT_ID,
      sign: signature,
      t: timestamp,
      sign_method: "HMAC-SHA256",
    },
  });

  if (response.data.success === true)
    accessToken = response.data.result.access_token;

  if (!accessToken) throw Error("Tuya access token error");
  console.log({ accessToken });
  return accessToken;
}

export async function fetchTicketAccessKey() {
  const path = `/v1.0/devices/${env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID}/door-lock/password-ticket`;
  const method = "POST";
  const timestamp = getTimestamp();
  // const timestamp = 1730213625;
  const nonce = "";
  const accessToken = await getAccessToken();
  const signStr = createSignUrl({}, method, path, "");
  const signature = calcSignApiCall(
    TUYA_CLIENT_ID,
    accessToken,
    timestamp,
    nonce,
    signStr,
    TUYA_SECRET
  );

  // console.log("Iz ticket access key-a");
  // console.log({ signStr });
  // console.log({ signature });

  const headers = {
    client_id: TUYA_CLIENT_ID,
    sign: signature,
    t: timestamp,
    sign_method: "HMAC-SHA256",
    access_token: accessToken,
  };

  try {
    const url = `${TUYA_URL}${path}`;
    const response = await axios({
      method,
      url,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Tuya ticket access key error:", error);
    throw error;
  }
}

function generateSignature(signStr: string, secret: string): string {
  const hash = CryptoJS.HmacSHA256(signStr, secret);
  return hash.toString(CryptoJS.enc.Hex).toUpperCase();
}

function createSignUrl(
  queryParams: any,
  method: string,
  path: string,
  body: any = ""
): string {
  const sortedParams = Object.keys(queryParams)
    .sort()
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");

  const formattedBody = body !== "" ? JSON.stringify(body) : "";
  const sha256 = CryptoJS.SHA256(formattedBody);

  if (path === "/v1.0/devices/bf04f237cdc8bcbabecnj8/door-lock/temp-password") {
    console.log({ sha256: sha256.toString() });
    console.log(formattedBody);
  }

  const signUrl = `${method}\n${sha256}\n\n${path}${sortedParams && `?${sortedParams}`}`;

  // console.log({ signUrl });

  return signUrl;
}

async function getAccessToken(): Promise<string> {
  if (!accessToken) {
    return await fetchAccessToken();
  }
  return accessToken;
}
async function getAccessTicketKey() {
  if (!accessTicketKey) {
    return await fetchTicketAccessKey();
  }
  return accessTicketKey;
}

export async function tuyaApiRequest(
  method: "GET" | "POST",
  path: string,
  queryParams: Record<string, any> = {},
  body: any = ""
) {
  const timestamp = getTimestamp();
  // const timestamp =
  //   path === "/v1.0/devices/bf04f237cdc8bcbabecnj8/door-lock/temp-password"
  //     ? 1730213625000
  //     : getTimestamp();
  // const timestamp = 1730213625;
  const nonce = "";
  const accessToken = await getAccessToken();

  const signStr = createSignUrl({}, method, path, body);
  const signature = calcSignApiCall(
    TUYA_CLIENT_ID,
    accessToken,
    timestamp,
    nonce,
    signStr,
    TUYA_SECRET
  );
  if (path === "/v1.0/devices/bf04f237cdc8bcbabecnj8/door-lock/temp-password") {
    console.log({ signature });
    console.log({ signStr });
  }
  // console.log("Iz requesta");
  // console.log({ signature }); // ovaj je dobar takodje, kao u postman-u
  // console.log({ signStr }); // ovaj je dobar, kao u postman-u

  const headers = {
    client_id: TUYA_CLIENT_ID,
    sign: signature,
    t: timestamp,
    sign_method: "HMAC-SHA256",
    access_token: accessToken,
  };

  try {
    const url = `${TUYA_URL}${path}`;
    const response = await axios({
      method,
      url,
      headers,
      params: queryParams,
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Tuya API request error:", error);
    throw error;
  }
}
// Token verification calculation
function calcSignToken(
  clientId: string,
  timestamp: number,
  nonce: string,
  signStr: string,
  secret: string
): string {
  var str = clientId + timestamp.toString() + nonce + signStr;
  var hash = CryptoJS.HmacSHA256(str, secret);
  var hashInBase64 = hash.toString();
  var signUp = hashInBase64.toUpperCase();

  // console.log({ str });
  // console.log({ hash });
  // console.log({ hashInBase64 });
  // console.log({ signUp });

  return signUp;
}

// Business verification calculation
function calcSignApiCall(
  clientId: string,
  accessToken: string,
  timestamp: number,
  nonce: string,
  signStr: string,
  secret: string
) {
  var str = clientId + accessToken + timestamp + nonce + signStr;
  // var str = clientId + accessToken + getTimestamp() + nonce + signStr;
  var hash = CryptoJS.HmacSHA256(str, secret);
  var hashInBase64 = hash.toString();
  var signUp = hashInBase64.toUpperCase();

  // console.log({ str });
  return signUp;
}

export async function createTemporaryPassword() {
  const password = "1234567";
  const ticket = await getAccessTicketKey();
  const ticket_id = ticket.result.ticket_id;
  const access_key = ticket.result.ticket_key;
  const decrypted_access_key = decrypt_AES_128(access_key, TUYA_SECRET);
  const encryptedPassowrd = encrypt_AES_128(password, decrypted_access_key);

  // console.log({ access_key });
  // console.log({ decripted_access_key: decrypted_access_key });
  console.log({ encryptedPassowrd });
  // console.log({ ticket_id });

  const body = {
    password: encryptedPassowrd,
    name: "ApartLock App Password 1234567",
    password_type: "ticket",
    ticket_id: ticket_id,
    effective_time: 1730807737,
    invalid_time: 1731239737,
  };

  const data = await tuyaApiRequest(
    "POST",
    `/v1.0/devices/${env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID}/door-lock/temp-password`,
    undefined,
    body
  );

  console.log({ data });
}
