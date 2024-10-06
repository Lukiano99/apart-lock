import { paths } from "./routes/paths";

export const CONFIG = {
  site: {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  },
  assetsDir: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  appName: "ApartLock",
  auth: {
    method: "jwt",
    skip: true,
    redirectPath: paths.apartments.root,
  },
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
  isStaticExport: true,
};
