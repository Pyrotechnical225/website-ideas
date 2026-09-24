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
npm run build     # bundles public/ + the AI endpoint into dist/server/index.js
npm start         # http://localhost:8787  (studio at /studio)
npm test          # server checks: routes, fonts, AI endpoint (mocked, no key needed)
```

To turn on AI suggestions, start the server with `OPENAI_API_KEY` set (optionally `OPENAI_DESIGN_MODEL`). Never commit the key.

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
- AI panel with quick-question chips; same honest "not connected" state until a key is added.
- Friendly notice on phones (with "Continue anyway").

Unchanged on purpose: the import sanitising/security rules, the export formats (`oakline-canvas-project` v2), and the AI endpoint (`server/assistant.mjs`).

## Deploying

`revamp/.openai/hosting.json` still points at the existing Sites project, and the build output has the same shape as before (`dist/server/index.js`), so it can replace the current deployment. Not deployed yet.

## Still to do (from the project plan)

Accounts + cloud saving (Supabase), Luna/Sol model routing and server-side allowances, Stripe billing, multi-page projects, version history. See `revamp/OAKLINE-PLAN-DRAFT.md`.
