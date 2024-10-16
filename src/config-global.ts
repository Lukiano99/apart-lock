import { env } from "@/env";
import { paths } from "./routes/paths";

export const CONFIG = {
  site: {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  },
  assetsDir: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  appName: "ApartLock",
  auth: {
    method: "supabase",
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    key: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  amplify: {
    userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID ?? "",
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? "",
    region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION ?? "",
  },
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
  isStaticExport: true,
};
