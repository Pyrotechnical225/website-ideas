# Things That Go! Colouring Book

A 64-page toddler colouring book (30 original vehicle pictures) ready for Amazon KDP.

- `out/interior.pdf`: upload as the manuscript
- `out/cover.pdf`: upload as the cover
- `KDP-LISTING.md`: every field to fill in on KDP, step by step
- `preview/`: images of all the pages and the cover

Rebuild after changing anything: `npm install`, then `npm run build` (needs Playwright's Chromium), then `npm run check`.
The drawings are code in `src/vehicles*.mjs`, the page layouts are in `src/page.mjs` and `src/build.mjs`, and the drawing helpers are in `src/kit.mjs`.
