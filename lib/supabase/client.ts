import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Strip __InternalSupabase for compatibility with @supabase/ssr
type AppDatabase = Omit<Database, "__InternalSupabase">;

export function createClient() {
  return createBrowserClient<AppDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for use in client components
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}
