import { env } from "@/env";
import axios from "axios";
var CryptoJS = require("crypto-js");

const TUYA_URL = env.NEXT_PUBLIC_TUYA_URL;
const TUYA_CLIENT_ID = env.NEXT_PUBLIC_TUYA_CLIENT_ID;
const TUYA_SECRET = env.NEXT_PUBLIC_TUYA_SECRET;
const TUYA_DEVICE_ID = env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID;

let accessToken: string | null = null;

function getTimestamp(): number {
  var timestamp = new Date().getTime();
  return timestamp;
}

// Pribavlja access token od Tuya API-ja
async function fetchAccessToken(): Promise<string> {
  const timestamp = getTimestamp();
  // const signStr = `${TUYA_CLIENT_ID}${timestamp}`;
  // const signature = generateSignature(signStr, TUYA_SECRET!);
  const nonce = "";
  const signStr = createSignUrl({}, "GET", `/v1.0/token?grant_type=1`, "");
  const signature = calcSign(
    TUYA_CLIENT_ID,
    timestamp,
    nonce,
    signStr,
    TUYA_SECRET
  );

  // console.log("Iz access tokena");
  // console.log({ signStr });
  console.log({ signature });

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

  console.log({ resp: response });

  if (!accessToken) throw Error("Tuya access token error");
  console.log({ accessToken });
  return accessToken;
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
  const sha256 = CryptoJS.SHA256(body);

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

export async function tuyaApiRequest(
  method: "GET" | "POST",
  path: string,
  queryParams: Record<string, any> = {},
  body: any = {}
) {
  const timestamp = getTimestamp();
  const accessToken = await getAccessToken();
  const signStr = createSignUrl(queryParams, method, path, body);
  const signature = generateSignature(
    `${TUYA_CLIENT_ID}${accessToken}${timestamp}${signStr}`,
    TUYA_SECRET!
  );

  // console.log("Iz requesta");
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
    const url = `${TUYA_URL}/${path}`;
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

function calcSign(
  clientId: string,
  timestamp: number,
  nonce: string,
  signStr: string,
  secret: string
): string {
  var str = clientId + timestamp + nonce + signStr;
  var hash = CryptoJS.HmacSHA256(str, secret);
  var hashInBase64 = hash.toString();
  var signUp = hashInBase64.toUpperCase();

  // console.log({ str });
  // console.log({ hash });
  // console.log({ hashInBase64 });
  console.log({ signUp });

  return signUp;
}
