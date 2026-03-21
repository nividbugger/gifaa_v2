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
        const avatar = user.user_metadata?.avatar_url as string | undefined;
        const name   = (user.user_metadata?.full_name ?? user.user_metadata?.name) as string | undefined;

        // Claim by avatar_url (primary — unique per Google account)
        if (avatar) {
          await supabase
            .from("registries")
            .update({ user_id: user.id, pending_claim_avatar: null, pending_claim_name: null })
            .eq("pending_claim_avatar", avatar)
            .is("user_id", null);
        }

        // Claim by display name (fallback for users without avatar)
        if (name) {
          await supabase
            .from("registries")
            .update({ user_id: user.id, pending_claim_avatar: null, pending_claim_name: null })
            .eq("pending_claim_name", name)
            .is("user_id", null);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
