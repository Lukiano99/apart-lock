import "src/global.css";

// ----------------------------------------------------------------------

import type { Viewport } from "next";

import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";
import { ThemeProvider } from "src/theme/theme-provider";

import { ProgressBar } from "src/components/progress-bar";
import { MotionLazy } from "src/components/animate/motion-lazy";
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from "src/components/settings";

import { I18nProvider, LocalizationProvider } from "@/locales";
import { detectLanguage } from "@/locales/server";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { Snackbar } from "@/components/snackbar";
import { AuthProvider as SupabaseAuthProvider } from "@/auth/context/supabase";

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    {
      rel: "icon",
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const lang = CONFIG.isStaticExport ? "en" : await detectLanguage();
  const AuthProvider = SupabaseAuthProvider;

  return (
    <html lang={lang ?? "en"} suppressHydrationWarning>
      <body>
        <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
          <TRPCReactProvider>
            <HydrateClient>
              <LocalizationProvider>
                <AuthProvider>
                  <SettingsProvider settings={defaultSettings}>
                    <ThemeProvider>
                      <Snackbar />
                      <MotionLazy>
                        <ProgressBar />
                        <SettingsDrawer />
                        {children}
                      </MotionLazy>
                    </ThemeProvider>
                  </SettingsProvider>
                </AuthProvider>
              </LocalizationProvider>
            </HydrateClient>
          </TRPCReactProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
