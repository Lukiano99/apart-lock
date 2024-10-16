import { CONFIG } from "@/config-global";
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  `${CONFIG.supabase.url}`,
  `${CONFIG.supabase.key}`
);
