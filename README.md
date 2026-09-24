# Oakline Creator

A blank-canvas website builder with optional AI layout ideas. Two versions live here:

| Folder | What it is |
|---|---|
| `original/` | Exact rebuild of the live site (oakline-digital…chatgpt.site), restored from the handoff source. |
| `revamp/` | The redesigned version — new front page and studio, same product and brand. **Use this one going forward.** |

## Run it locally

```bash
cd revamp
npm install
npm run build     # bundles public/ + server/ into dist/server/index.js
npm start         # http://localhost:8787  (studio at /studio)
```

Accounts, AI and payments switch on when their keys are set. **See [`revamp/SETUP.md`](revamp/SETUP.md) for the step-by-step guide.** Without keys the site still works: signed-out editing, browser autosave and downloads.

## Tests

| Command | What it checks |
|---|---|
| `npm test` | Server: pages, AI sign-in/allowance/refunds, Luna/Sol routing, Stripe checkout, webhook signatures, out-of-order events (18 checks, no network needed) |
| `npm run test:db` | Database rules on a local Postgres: customers can't see each other's projects, plan limits, AI allowance, downgrade keeps work, 60 simultaneous requests can't overspend (needs `PGHOST`/`PGPORT`/`PGUSER`) |
| `npm run test:e2e` | Full browser journey against stand-in services (`test/fake-services.mjs` runs the real migration on local Postgres): sign-up → confirm → cloud save → pages → zip export → AI → privacy between customers → reopen on another device → upgrade to Pro (26 checks; needs Playwright) |

For the browser test, start `DATABASE_URL=postgres://… npm run fake-services`, then run the site with `SUPABASE_URL=http://localhost:54321 SUPABASE_ANON_KEY=fake-anon-key SUPABASE_SERVICE_ROLE_KEY=fake-service-key OPENAI_API_KEY=fake OPENAI_BASE_URL=http://localhost:54321/openai/v1 STRIPE_SECRET_KEY=sk_test_fake STRIPE_WEBHOOK_SECRET=whsec_fake STRIPE_PRICE_MONTHLY=price_m STRIPE_PRICE_YEARLY=price_y STRIPE_API_BASE=http://localhost:54321/stripe/v1 PORT=8788 npm start`.

## Accounts, cloud saving, AI allowances and payments

- **Accounts** (Supabase): sign up with email confirmation, sign in, password reset. The account panel shows the plan, AI usage and project count.
- **Cloud saving:** signed-in work saves to the account automatically and can be opened from "Your projects" on any device. Each customer can only reach their own projects (database row-level security). It still saves in the browser too.
- **Multi-page websites:** a Pages tab lets you add, rename and delete pages, and link buttons to pages. A multi-page download is a `.zip` with `index.html` plus one file per page. The project file format is now v3; v2 files still open.
- **Plan limits,** enforced by the database: Free has 3 projects × 3 pages, Pro has 25 × 25. After a downgrade, existing work stays editable. Only new projects and pages are blocked.
- **AI:** Luna for everyone, Sol for Pro. You need a confirmed account. Allowances are reserved atomically on the server (Free 25 Luna; Pro 1,000 Luna + 100 Sol a month, resetting on the 1st), and failed replies are refunded.
- **Payments** (Stripe): monthly £19 or yearly £180 checkout, a billing portal, and a signed webhook. Pro only switches on from Stripe's confirmed data.

The database schema is in `revamp/supabase/migrations/0001_oakline_core.sql`.

## What changed in the revamp

**Front page**
- New dark-green hero with a live, animated editor preview and an "idea bar" that hands your brief straight to the studio.
- Feature grid, AI section with a sample suggestion, 3-step "how it works", FAQ and closing call-to-action.
- Pricing section (Free / Pro, monthly ↔ yearly toggle: £19/month or £180/year). Pro is clearly marked **Coming soon** because accounts and billing aren't built yet.
- Self-hosted Fraunces + Inter fonts, mobile menu, scroll animations (switched off for people who prefer reduced motion), custom 404 page.

**Studio (editor)**
- Redesigned layout: slimmer top bar with device switcher, grouped building blocks, cleaner inspector.
- **Drag and drop** blocks onto the canvas (click-to-add still works).
- **New blocks:** subheading, label, link, card, menu bar, footer (still simple editable pieces — no forced templates).
- **Theme tab:** one-click colour palettes and font pairings.
- **Autosave** to this browser (IndexedDB) and a "Continue editing" option when you come back.
- **Keyboard shortcuts:** Ctrl/⌘+Z, Ctrl/⌘+Shift+Z, Ctrl/⌘+D duplicate, Delete, Ctrl/⌘+S save project, Ctrl/⌘+P preview, Esc select parent.
- Preview now switches between desktop, tablet and mobile widths.
- AI panel with quick-question chips and a Luna/Sol switch.
- Friendly notice on phones (with "Continue anyway").

Unchanged on purpose: the import sanitising/security rules.

## Deploying

`revamp/.openai/hosting.json` still points at the existing Sites project, and the build output has the same shape as before (`dist/server/index.js`), so it can replace the current deployment. Not deployed yet.

## Still to do (from the project plan)

Connect the real services (see `revamp/SETUP.md`), custom email sending, 30-day version history, reusable components/brand settings, screenshot design review. See `revamp/OAKLINE-PLAN-DRAFT.md`.
