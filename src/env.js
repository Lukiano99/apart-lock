import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */

  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    EMAIL_APP_PWD: z.string(),
    EMAIL_APP_USER: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_TUYA_URL: z.string(),
    NEXT_PUBLIC_TUYA_CLIENT_ID: z.string(),
    NEXT_PUBLIC_TUYA_SECRET: z.string(),
    NEXT_PUBLIC_TUYA_USER_UUID: z.string(),
    NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_APP_PWD: process.env.EMAIL_APP_PWD,
    EMAIL_APP_USER: process.env.EMAIL_APP_USER,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    NEXT_PUBLIC_TUYA_URL: process.env.NEXT_PUBLIC_TUYA_URL,
    NEXT_PUBLIC_TUYA_CLIENT_ID: process.env.NEXT_PUBLIC_TUYA_CLIENT_ID,
    NEXT_PUBLIC_TUYA_SECRET: process.env.NEXT_PUBLIC_TUYA_SECRET,
    NEXT_PUBLIC_TUYA_USER_UUID: process.env.NEXT_PUBLIC_TUYA_USER_UUID,
    NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID:
      process.env.NEXT_PUBLIC_TUYA_DIDALOCK_DEVICE_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
