import { defineConfig } from "wxt";
import path from "node:path";
import { loadEnv } from "vite";

export default defineConfig({
  srcDir: "src",
  // Branded Chrome 137+ ignores --load-extension, so the auto-launcher can't work; load the dev build manually.
  webExt: { disabled: true },
  // WXT's dev server defaults to 3000, which is the Next.js app's port.
  dev: { server: { port: 3100 } },
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    resolve: { alias: { "@shared": path.resolve(__dirname, "../shared") } },
  }),
  manifest: ({ mode }) => {
    const env = loadEnv(mode, __dirname, "WXT_");
    // Dev builds also need to read the session cookie from the local Next.js server.
    const isDev = mode !== "production";
    // A WXT_* variable exported in the shell overrides .env.production, so guard against shipping a dev URL.
    if (!isDev && /localhost|127\.0\.0\.1/.test(env.WXT_SITE_URL ?? "")) {
      throw new Error(`Refusing production build: WXT_SITE_URL is "${env.WXT_SITE_URL}". Unset WXT_* shell variables (env | grep WXT) and rebuild.`);
    }
    if (!env.WXT_SUPABASE_URL) throw new Error(`WXT_SUPABASE_URL is not set for mode "${mode}" (see .env.example)`);

    return {
      name: "Gifaa – Add to Registry",
      description: "Add any product you're browsing to your Gifaa gift registry in one click.",
      // activeTab + scripting: read the product on the page the user explicitly opened us on.
      // cookies: reuse the user's gifaa.in login instead of building a second sign-in.
      permissions: ["activeTab", "scripting", "cookies", "storage"],
      host_permissions: [
        "https://gifaa.in/*",
        "https://www.gifaa.in/*",
        `${new URL(env.WXT_SUPABASE_URL).origin}/*`,
        ...(isDev ? ["http://localhost/*"] : []),
      ],
      icons: { 16: "icon/16.png", 32: "icon/32.png", 48: "icon/48.png", 96: "icon/96.png", 128: "icon/128.png" },
      action: { default_title: "Add to Gifaa registry" },
    };
  },
});
