import { defineConfig } from "wxt";
import path from "node:path";

// Dev builds also need to read the session cookie from the local Next.js server.
const isDev = process.env.NODE_ENV !== "production";

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
  manifest: {
    name: "Gifaa – Add to Registry",
    description: "Add any product you're browsing to your Gifaa gift registry in one click.",
    // activeTab + scripting: read the product on the page the user explicitly opened us on.
    // cookies: reuse the user's gifaa.in login instead of building a second sign-in.
    permissions: ["activeTab", "scripting", "cookies", "storage"],
    host_permissions: [
      "https://gifaa.in/*",
      "https://www.gifaa.in/*",
      "https://*.supabase.co/*",
      ...(isDev ? ["http://localhost/*"] : []),
    ],
    icons: { 16: "icon/16.png", 32: "icon/32.png", 48: "icon/48.png", 96: "icon/96.png", 128: "icon/128.png" },
    action: { default_title: "Add to Gifaa registry" },
  },
});
