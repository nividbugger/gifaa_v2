# Secret Santa (seasonal feature)

Friends join a group from one invite link (no account needed), add a wishlist, the organiser draws
names, and each person reveals only their own match. Matches are secret from everyone, organiser included.

## Where everything lives
| Piece | Location |
|---|---|
| UI, art, styles, API client, config | `features/secret-santa/` (`styles/santa.css` holds every `.santa-*` animation; `art/` the SVG illustrations; `components/` the screens) |
| Pages | `app/santa/` (landing, new, manage/[id], join/[code], me/[token]) |
| Database | `features/secret-santa/sql/up.sql` (tables/functions all prefixed `santa_`) |
| Draw + email template (server side) | `supabase/functions/santa-draw/` (sending itself uses the shared `supabase/functions/_shared/email/`, which stays when Santa is removed) |
| Promo mounts (only edits outside the above) | `app/page.tsx`, `app/dashboard/page.tsx` (banner) and `components/layout/Header.tsx` (nav link, desktop + mobile menu) |

## Go live
1. **Database:** paste `sql/up.sql` into the Supabase SQL editor and run it.
2. **Edge function:** `supabase functions deploy santa-draw` (CLI: `brew install supabase/tap/supabase`, then `supabase login` and `supabase link`).
3. **Email:** configure the shared email secrets once (`SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`); see `supabase/functions/_shared/email/README.md`. Without them the feature still works: everyone reveals via their personal link and the organiser shares links on WhatsApp.
4. After configuring email, use "Re-send everyone's email" on a drawn group to send the notifications.

## How the secrecy works
- `santa_assignments` has RLS enabled and **no policies**: only the edge function (service role) can touch it.
- The organiser can read names/emails but the `token` column is excluded from their grants, so they can't open anyone's link.
- Everything participants do goes through `SECURITY DEFINER` functions keyed by their private token.
- `sql/verify.mjs` tries to break all of this on a real Postgres engine (`npm i --no-save @electric-sql/pglite && node features/secret-santa/sql/verify.mjs`).
- Draw + template tests: `node --test supabase/functions/santa-draw/*.test.ts`.

## Design notes
- Visual identity: midnight blue, ivory and gold (Gifaa's palette), with playful SVG illustrations, falling snow, an envelope-and-gift reveal and confetti. All motion respects `prefers-reduced-motion`.
- Each group gets one of five covers chosen from its invite code (`covers.ts`), so nothing extra is stored.
- Pure logic with tests: `covers.ts`, `countdown.ts`, `invite-input.ts`, `avatar.ts` (`helpers.test.ts`).
- `tailwind.config.ts` must list `./features/**/*` in `content`, otherwise classes used only here are never generated.

## Hiding it after New Year
- The promos hide themselves after `SANTA_PROMO_UNTIL` in `config.ts` (6 Jan 2027). Nothing to deploy.
- To hide immediately: set `NEXT_PUBLIC_SECRET_SANTA=off` and redeploy.
- `/santa/*` links keep working afterwards so existing groups can still reveal.

## Removing it completely
1. Delete `features/secret-santa/` and `app/santa/`.
2. Delete the `SantaPromo` import + usage in `app/page.tsx` and `app/dashboard/page.tsx`, and the `SantaNavLink` import + two usages in `components/layout/Header.tsx` (search for `Santa`).
3. Run `sql/down.sql` in the Supabase SQL editor **before** deleting that folder (or keep a copy). It drops every `santa_*` object.
4. `supabase functions delete santa-draw`. Leave the shared email secrets and `_shared/email/` in place; other features use them.

## Not built yet (ideas)
Reminder emails before the exchange date, WhatsApp delivery (needs Meta Business verification + approved templates), anonymous Q&A with your match, re-draw before anyone has revealed.
