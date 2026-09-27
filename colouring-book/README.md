# Toddler Colouring Books for Amazon KDP

Four 64-page toddler colouring books (30 original pictures each), ready to upload:

| Book | Folder | Files |
|---|---|---|
| Things That Go! (vehicles) | `out/` | `interior.pdf`, `cover.pdf`, listing in `KDP-LISTING.md` |
| Dino Friends! (dinosaurs) | `out/dino-friends/` | `interior.pdf`, `cover.pdf`, `listing.pdf` |
| Moo! Oink! Baa! (farm animals) | `out/moo-oink-baa/` | `interior.pdf`, `cover.pdf`, `listing.pdf` |
| My First Christmas | `out/my-first-christmas/` | `interior.pdf`, `cover.pdf`, `listing.pdf` |

Build a new-style book: `npm run book -- dinosaurs` (or `farm`, `christmas`); `npm run books` builds all three. Settings for each book (title, cover pictures, colours, listing text) are in `books/`. Check files with `node src/check.mjs <folder-name>`.

---

## Things That Go! (the first book)

- `out/interior.pdf`: upload as the manuscript
- `out/cover.pdf`: upload as the cover
- `KDP-LISTING.md`: every field to fill in on KDP, step by step
- `preview/`: images of all the pages and the cover

Rebuild after changing anything: `npm install`, then `npm run build` (needs Playwright's Chromium), then `npm run check`.
The drawings are code in `src/vehicles*.mjs`, the page layouts are in `src/page.mjs` and `src/build.mjs`, and the drawing helpers are in `src/kit.mjs`.
