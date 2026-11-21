import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { POST_LOGIN_COOKIE, postLoginCookieDomain, safeRedirectPath } from "@/lib/auth/redirect";

function decodeCookie(value: string | undefined): string | null {
  try {
    return value ? decodeURIComponent(value) : null;
  } catch {
    return null; // malformed cookie: ignore it rather than failing the login
  }
}

export async function GET(request: Request) {
  const { searchParams, origin, hostname } = new URL(request.url);
  const code = searchParams.get("code");

  // Destination set by the login page before the Google round-trip (cookie), or an explicit ?next=.
  // Always validated: this must never become an open redirect.
  const cookieStore = await cookies();
  const next = safeRedirectPath(searchParams.get("next") ?? decodeCookie(cookieStore.get(POST_LOGIN_COOKIE)?.value));

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

      const response = NextResponse.redirect(new URL(next, origin));
      response.cookies.set(POST_LOGIN_COOKIE, "", { path: "/", maxAge: 0, domain: postLoginCookieDomain(hostname) });
      return response;
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
