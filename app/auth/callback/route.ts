import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Auto-claim any pending migration registries for this user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const avatar = (user.user_metadata?.avatar_url ?? null) as string | null;
        const name   = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? null) as string | null;

        // Use a SECURITY DEFINER function so it runs as DB owner, bypassing RLS
        // (pending rows have user_id = NULL which would fail normal RLS UPDATE checks)
        await supabase.rpc("claim_pending_registries", {
          p_avatar: avatar,
          p_name: name,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
