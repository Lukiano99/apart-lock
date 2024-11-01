import { env } from "@/env";
import axios from "axios";
import { decrypt_AES_128, encrypt_AES_128 } from "./encrypt-decrypt";
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

  return accessToken;
}

export async function fetchTicketAccessKey() {
  const path = `/v1.0/devices/${TUYA_DEVICE_ID}/door-lock/password-ticket`;
  const method = "POST";
  const timestamp = getTimestamp();
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

  const signUrl = `${method}\n${sha256}\n\n${path}${sortedParams && `?${sortedParams}`}`;

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

  const headers = {
    client_id: TUYA_CLIENT_ID,
    sign: signature,
    t: timestamp,
    sign_method: "HMAC-SHA256",
    access_token: accessToken,
  };

  console.log(JSON.stringify(body));

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
  var hash = CryptoJS.HmacSHA256(str, secret);
  var hashInBase64 = hash.toString();
  var signUp = hashInBase64.toUpperCase();

  return signUp;
}

interface createTemporaryPasswordProps {
  password: string;
  customer: string;
  check_in: number;
  check_out: number;
}
export async function createTemporaryPassword({
  password,
  customer,
  check_in,
  check_out,
}: createTemporaryPasswordProps) {
  // const password = "1234567";
  const ticket = await getAccessTicketKey();
  const ticket_id = ticket.result.ticket_id;
  const access_key = ticket.result.ticket_key;
  const decrypted_access_key = decrypt_AES_128(access_key, TUYA_SECRET);
  const encryptedPassowrd = encrypt_AES_128(password, decrypted_access_key);

  const body = {
    password: encryptedPassowrd,
    name: `ApartLock | Customer: ${customer}`,
    password_type: "ticket",
    ticket_id: ticket_id,
    effective_time: check_in,
    invalid_time: check_out,
    // effective_time: new Date(Date.now() - 1 * 1000 * 60 * 60 * 24).getTime(),
  };
  console.log;
  const data = await tuyaApiRequest(
    "POST",
    `/v1.0/devices/${TUYA_DEVICE_ID}/door-lock/temp-password`,
    undefined,
    body
  );

  return data;
}

export async function sendEmail() {
  const password = "1234567";
  const ticket = await getAccessTicketKey();
  const ticket_id = ticket.result.ticket_id;
  const access_key = ticket.result.ticket_key;
  const decrypted_access_key = decrypt_AES_128(access_key, TUYA_SECRET);
  const encryptedPassowrd = encrypt_AES_128(password, decrypted_access_key);

  const body = {
    to_address: "l.stojadinovic99@gmail.com",
    template_id: "MAIL_4309536561",
    // reply_to_address: "test@example.com",
    // template_param: '{"code":"1234"}',
  };
  const data = await tuyaApiRequest(
    "POST",
    `/v1.0/iot-03/messages/mails/actions/push`,
    undefined,
    body
  );

  return data;
}
