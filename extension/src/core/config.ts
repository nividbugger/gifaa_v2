const supabaseUrl: string = import.meta.env.WXT_SUPABASE_URL;
const siteUrl: string = import.meta.env.WXT_SITE_URL;

export const config = {
  supabase: { url: supabaseUrl, anonKey: import.meta.env.WXT_SUPABASE_ANON_KEY as string },
  siteUrl,
  /** Supabase project ref, used in the auth cookie name `sb-<ref>-auth-token`. */
  projectRef: new URL(supabaseUrl).hostname.split(".")[0]!,
};

/** The site may be served from apex or www; the host-only auth cookie lives on whichever the user visited. */
export function siteOrigins(): string[] {
  const { origin, hostname, protocol, port } = new URL(config.siteUrl);
  if (hostname === "localhost") return [origin];
  const alt = hostname.startsWith("www.") ? hostname.slice(4) : `www.${hostname}`;
  return [origin, `${protocol}//${alt}${port ? `:${port}` : ""}`];
}
