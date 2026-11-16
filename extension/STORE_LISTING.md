# Store submission pack (v1.0.0)

Privacy policy URL (all stores): **https://gifaa.in/privacy-policy** (section 11 covers the extension — deploy the web app *before* submitting).
Support: letsgifaa@gmail.com · Website: https://gifaa.in

## Listing copy
**Name:** Gifaa – Add to Registry
**Short description (≤132 chars):** Add any product you're browsing to your Gifaa gift registry in one click.
**Category:** Shopping (Chrome/Edge) · Shopping or Lifestyle (App Store)
**Long description:**
> Building a wedding, baby shower, housewarming or birthday registry on Gifaa? Found the perfect gift on another site?
> Click the Gifaa icon on any product page. We read the product's name, price and photo, you pick which of your registries it belongs to, and it's added — no copying links, no retyping.
>
> • Works on Amazon, Flipkart, Myntra and most online stores
> • Choose from all your Gifaa registries; we remember your last pick
> • Edit the name, price or notes before adding
> • Uses your existing Gifaa login — no extra account
> • Only reads a page when you click the icon
>
> You need a free Gifaa account (gifaa.in). Eligible Amazon links may be converted into affiliate links, allowing Gifaa to earn a small commission on qualifying purchases.

## Single purpose (Chrome dashboard)
Lets a signed-in Gifaa user add the product on the current page to one of their Gifaa gift registries.

## Permission justifications
| Permission | Why |
|---|---|
| `activeTab` | Read the product details of the page the user opened the extension on, only at the moment they click. |
| `scripting` | Inject the small product-reader script into that active tab (no always-on content scripts). |
| `cookies` | Read the Gifaa sign-in cookie on gifaa.in so the user doesn't have to log in twice. No other site's cookies are read. |
| `storage` | Remember the user's last-selected registry locally. |
| Host: `gifaa.in`, `www.gifaa.in` | Read the sign-in cookie; open registry pages. |
| Host: Supabase project origin | Gifaa's backend: list registries, save the gift, product lookup. |

## Data-use disclosures (Chrome "Privacy practices" tab)
- Collects: **authentication information** (session token, used only to call Gifaa's API) and **website content** (product name/price/image/URL of the page, on click).
- Not collected: browsing history, location, health, financial, personal communications.
- Certify: not sold; not used for unrelated purposes; not used for creditworthiness/lending.
- Remote code: **No**.

## Assets you must supply
- Screenshots: 1280×800 (or 640×400), 1–5. Suggested: (1) popup on an Amazon product with form filled, (2) registry dropdown, (3) success screen, (4) gift visible in dashboard.
- Promo tile (Chrome, optional): 440×280 small tile.
- Icon 128×128: already in the package.

## Submit
**Chrome Web Store** — $5 one-time developer account → https://chrome.google.com/webstore/devconsole → New item → upload `.output/gifaa-extension-1.0.0-chrome.zip` (`npm run zip`). Review typically 1–3 days; `cookies` may trigger extra scrutiny, the justification above is the answer.

**Microsoft Edge Add-ons** — free → https://partner.microsoft.com/dashboard/microsoftedge → upload `.output/gifaa-extension-1.0.0-edge.zip` (`npm run zip:edge`). Review ~1–7 days.

**Safari (macOS + iOS)** — Apple Developer Program ($99/yr).
1. `npm run safari:convert` (regenerates `safari/Gifaa`), open `safari/Gifaa/Gifaa.xcodeproj`.
2. For all four targets: set your **Team**; bundle IDs are `in.gifaa.extension` (app) and `in.gifaa.extension.Extension` (extension) — change if taken.
3. Product → Archive each scheme (`Gifaa (macOS)`, `Gifaa (iOS)`) → Distribute App → App Store Connect.
4. In App Store Connect create the app record (macOS and iOS), add screenshots, the privacy policy URL, and complete **App Privacy** (same disclosures as above). Review ~1–3 days.
5. Users enable it in Safari → Settings → Extensions (iOS: Settings → Apps → Safari → Extensions) and grant website access.
