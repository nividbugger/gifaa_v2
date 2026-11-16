# Gifaa browser extension

Adds the product on the current page to one of the user's Gifaa registries. Built with [WXT](https://wxt.dev), React and TypeScript.

## How it works
- **Auth:** no separate login. It reads the Supabase auth cookie the website already sets (`cookies` permission). It never refreshes tokens itself (Supabase rotates them, which would log the user out of the site); when expired it loads the site in a background tab so the site refreshes the cookie.
- **Extraction:** injected on demand via `activeTab`. Layers: JSON-LD → site-specific selectors → meta tags, with the `scrape-product` edge function filling gaps.
- **Writes:** PostgREST with the user's JWT; row-level security authorises. Row shape comes from `../shared/gift-payload.ts`, shared with the web app.

## Develop
```bash
cp .env.example .env     # fill in Supabase values; WXT_SITE_URL=http://localhost:3000
npm install
npm run dev              # WXT dev server on :3100 (Next.js keeps :3000)
```
Then load `.output/chrome-mv3-dev` via `chrome://extensions` → Developer mode → Load unpacked. (Branded Chrome 137+ ignores `--load-extension`, so auto-launch is disabled.)

Run the web app (`npm run dev` in the repo root) and log in at localhost:3000.

## Test / build
```bash
npm test                 # extraction + session-cookie unit tests
npm run typecheck
npm run build            # Chrome → .output/chrome-mv3 (uses .env.production → gifaa.in)
npm run build:edge       # Edge
npm run zip              # store-ready zip (zip:edge for Edge)
```

## Not yet done
Safari (needs `xcrun safari-web-extension-converter` + Apple Developer account) and store listings/privacy-policy entry.
