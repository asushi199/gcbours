import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServiceRoleKey, getSupabaseEnv } from "@/lib/supabase/env";

/** Server-only admin client. Never import from client components. */
export function createServiceClient() {
  const { url } = getSupabaseEnv();
  return createSupabaseClient(url, getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
