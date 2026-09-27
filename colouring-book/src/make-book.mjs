// Builds a complete KDP colouring book from a book settings file.
// Usage: node src/make-book.mjs <book>   (book = dinosaurs | farm | christmas)
// Output: out/<slug>/interior.pdf, cover.pdf, listing.pdf, specs.json and preview/<slug>/*.png
import {chromium} from 'playwright';
import fs from 'node:fs';
import {svgPage, colouringPage, outlineText, solidText} from './page.mjs';
import {withPalette, rect, circle, line, face, star, THIN} from './kit.mjs';

const book = (await import(`../books/${process.argv[2]}.mjs`)).default;
const {slug, title, coverSubtitle, order, pictures} = book;
const OUT = `out/${slug}`, PREV = `preview/${slug}`;
const YEAR = new Date().getFullYear();
const g2 = (t, c) => `<g transform="${t}">${c}</g>`;
const pic = key => { const fn = pictures[key]; if (!fn) throw new Error(`Unknown picture ${key}`); return fn(); };

// ---------------------------------------------------------------- interior
const titleArt = pic(book.titlePicture);
const titlePage = svgPage(
  outlineText(title, 425, 200, Math.min(92, Math.floor(1350 / title.length)), {sw: 8}) + solidText('Colouring Book', 425, 285, 50) +
  g2(`translate(425,590) scale(.6) translate(-425,-640)`, g2(`translate(0,${titleArt.shift ?? 55})`, titleArt.scene)) +
  rect(165, 800, 520, 170, 26, null, THIN) + solidText('This book belongs to:', 425, 860, 40) + line('M215,935 L635,935', 4));
const swatches = [0, 1, 2, 3, 4, 5, 6, 7].map(i => circle(215 + (i % 4) * 140, 560 + Math.floor(i / 4) * 150, 52, null, THIN)).join('');
const infoPage = svgPage(
  solidText('Test your colours here!', 425, 440, 44) + swatches +
  solidText(`${title} Colouring Book`, 425, 900, 22) +
  solidText(`Copyright © ${YEAR}${book.author ? ' ' + book.author : ''}. All rights reserved.`, 425, 935, 20) +
  solidText('No part of this book may be reproduced without permission, except for personal use.', 425, 965, 17) +
  solidText('Tip: place a sheet of card behind the page when using pens.', 425, 995, 17));
const blankBack = svgPage(solidText('This page is left blank so colours don’t show through.', 425, 1000, 18, {color: '#777'}));
const certificate = svgPage(
  rect(90, 110, 670, 880, 40, null, 9) + rect(120, 140, 610, 820, 28, null, 4) +
  outlineText('Well Done!', 425, 300, 110, {sw: 8}) + solidText('You coloured every page of', 425, 390, 34) + solidText(title, 425, 440, 40, {weight: 700}) +
  star(250, 560, 55) + star(425, 530, 70) + star(600, 560, 55) +
  solidText('Name:', 190, 720, 34, {anchor: 'start'}) + line('M300,722 L660,722', 4) +
  solidText('Date:', 190, 810, 34, {anchor: 'start'}) + line('M300,812 L660,812', 4) +
  g2('translate(425,900) scale(.28) translate(-425,-700)', face(425, 700, 3)));

const pages = [titlePage, infoPage];
for (const key of order) pages.push(colouringPage(pic(key)), blankBack);
pages.push(certificate, blankBack);
if (new Set(order).size !== order.length) throw new Error('A picture is used twice');
if (pages.length % 2 || pages.length < 24) throw new Error('Page count must be even and at least 24');

// ---------------------------------------------------------------- cover (full wrap, 0.125 in bleed)
const PAGES = pages.length;
const SPINE = +(PAGES * 0.002252).toFixed(4);            // inches, white paper
const BLEED = 0.125, TRIM_W = 8.5, TRIM_H = 11;
const COVER_W = +(BLEED * 2 + TRIM_W * 2 + SPINE).toFixed(4), COVER_H = TRIM_H + BLEED * 2;
const u = x => x * 100;
const backX = u(BLEED), spineX = u(BLEED + TRIM_W), fx = u(BLEED + TRIM_W + SPINE), cw = u(TRIM_W), W = u(COVER_W), H = u(COVER_H);
const C = book.cover;
const tile = ({key, palette, bg}, x, y, size) => withPalette(palette, () => {
  const v = pic(key), sh = v.shift ?? 55;
  const t = `translate(0,${sh})${v.scale ? ` translate(425,600) scale(${v.scale}) translate(-425,-600)` : ''}`;
  return `<g transform="translate(${x},${y})">${rect(0, 0, size, size, 34, null, 8).replace('fill="#fff"', `fill="${bg}"`)}
    <svg x="10" y="10" width="${size - 20}" height="${size - 20}" viewBox="70 ${260 + sh} 710 710"><g transform="${t}">${v.scene}</g></svg></g>`;
});
const thumb = (key, x, y, w) => `<g transform="translate(${x},${y})">${rect(0, 0, w, w * 1.294, 10, null, 4)}<svg x="4" y="4" width="${w - 8}" height="${w * 1.294 - 8}" viewBox="0 0 850 1100">${colouringPage(pic(key)).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></g>`;
const tick = (x, y, c) => `<path d="M${x},${y} l9,10 l17,-22" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
const cover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${COVER_W}in" height="${COVER_H}in">
  <rect width="100%" height="100%" fill="${C.sky}"/>
  <path d="M0,${H - 170 + (C.groundDrop || 0)} Q${W / 4},${H - 260 + (C.groundDrop || 0)} ${W / 2},${H - 175 + (C.groundDrop || 0)} T${W},${H - 180 + (C.groundDrop || 0)} L${W},${H} L0,${H} Z" fill="${C.ground}"/>
  ${C.decor ? C.decor({backX, fx, cw, W, H}) : ''}
  ${outlineText(title, fx + cw / 2, 235, Math.min(100, Math.floor(1600 / title.length)), {sw: 10, fillc: C.titleColour})}
  ${outlineText(coverSubtitle, fx + cw / 2, 315, Math.min(48, Math.floor(1450 / coverSubtitle.length)), {sw: 7, fillc: '#fff', weight: 700})}
  ${tile(C.tiles[0], fx + 100, 360, 315)}${tile(C.tiles[1], fx + cw - 415, 360, 315)}
  ${tile(C.tiles[2], fx + 100, 690, 315)}${tile(C.tiles[3], fx + cw - 415, 690, 315)}
  <g transform="translate(${fx + cw / 2},1052)">${rect(-300, -38, 600, 64, 32, null, 6).replace('fill="#fff"', `fill="${C.badgeColour}"`)}${solidText(`${order.length} Big &amp; Simple Pictures · Ages 2–5`, 0, 8, 32, {weight: 700, color: '#fff'})}</g>
  ${outlineText(C.backHeading, backX + cw / 2, 290, Math.min(66, Math.floor(1500 / C.backHeading.length)), {sw: 8, fillc: C.titleColour})}
  ${C.backLines.map((t, i) => solidText(t, backX + cw / 2, 370 + i * 42, 27, {color: C.textColour})).join('')}
  ${thumb(C.thumbs[0], backX + 115, 505, 185)}${thumb(C.thumbs[1], backX + cw / 2 - 92, 505, 185)}${thumb(C.thumbs[2], backX + cw - 300, 505, 185)}
  ${C.bullets.map((t, i) => tick(backX + 118, 805 + i * 40, C.textColour) + solidText(t, backX + 155, 815 + i * 40, 26, {anchor: 'start', color: C.textColour})).join('')}
  <rect x="${spineX}" y="0" width="${u(SPINE)}" height="${H}" fill="${C.spineColour}"/>
</svg>`;

// ---------------------------------------------------------------- listing sheet (for you, not for KDP)
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const L = book.listing;
const prices = [['Amazon.com', 'USD', '9.99'], ['Amazon.co.uk', 'GBP', '7.99'], ['Amazon.de / .fr / .es / .it / .nl / .be', 'EUR', '9.99 each'], ['Amazon.pl', 'PLN', '41.99'], ['Amazon.se', 'SEK', '119'], ['Amazon.co.jp', 'JPY', '1,200'], ['Amazon.ca', 'CAD', '13.99'], ['Amazon.com.au', 'AUD', '13.99']];
const fontCss = `@font-face{font-family:Fredoka;font-weight:600;src:url(data:font/woff2;base64,${fs.readFileSync('fonts/fredoka-latin-600-normal.woff2').toString('base64')})}@font-face{font-family:Fredoka;font-weight:700;src:url(data:font/woff2;base64,${fs.readFileSync('fonts/fredoka-latin-700-normal.woff2').toString('base64')})}`;
const listingHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
@page{size:A4;margin:16mm 16mm 18mm}body{font:10.5pt/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1b2a33}
h1{font:700 24pt/1.1 Fredoka,sans-serif;margin:0 0 4px;color:#0b3d5c}h2{font:700 13pt Fredoka,sans-serif;color:#0b3d5c;margin:20px 0 8px;border-bottom:2px solid #ffd23f;padding-bottom:3px}
.sub{color:#58707e;margin:0 0 14px}table{width:100%;border-collapse:collapse;margin:4px 0}td,th{border:1px solid #dde5ea;padding:6px 8px;text-align:left;vertical-align:top}th{background:#f3f7fa;width:32%;font-weight:600}
.box{background:#f7fbfe;border:1px solid #dde5ea;border-radius:8px;padding:10px 14px;white-space:pre-wrap}.copy{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10pt}
ol{margin:4px 0;padding-left:20px}.note{background:#fff8e1;border-left:4px solid #ffd23f;padding:8px 12px;border-radius:4px}img{width:100%;border-radius:6px;border:1px solid #dde5ea}</style></head><body>
<h1>${esc(title)} — KDP upload sheet</h1><p class="sub">${esc(L.subtitle)}</p>
<img src="data:image/png;base64,__COVER__">
<h2>Files to upload</h2><table><tr><th>Manuscript</th><td><b>${slug}/interior.pdf</b> — ${PAGES} pages, 8.5 × 11 in, no bleed</td></tr><tr><th>Cover</th><td><b>${slug}/cover.pdf</b> — ${COVER_W} × ${COVER_H} in (spine ${SPINE} in)</td></tr></table>
<h2>1 · Paperback details</h2><table>
<tr><th>Language</th><td>English</td></tr><tr><th>Book title</th><td class="copy">${esc(title)}</td></tr><tr><th>Subtitle</th><td class="copy">${esc(L.subtitle)}</td></tr>
<tr><th>Series (optional)</th><td class="copy">Big &amp; Simple Colouring for Toddlers — ${esc(L.seriesNumber)}</td></tr>
<tr><th>Author</th><td>Your dad’s first and last name (the same on every book)</td></tr>
<tr><th>Publishing rights</th><td>“I own the copyright and I hold the necessary publishing rights”</td></tr>
<tr><th>Audience</th><td>Sexually explicit: <b>No</b> · Reading age: <b>2 to 5</b></td></tr>
<tr><th>Categories</th><td>${L.categories.map(esc).join('<br>')}</td></tr><tr><th>Low-content book</th><td>Leave unticked</td></tr></table>
<h2>Description (copy into the description box)</h2><div class="box">${esc(L.description)}</div>
<h2>Keywords (one per box)</h2><ol class="copy">${L.keywords.map(k => `<li>${esc(k)}</li>`).join('')}</ol>
<h2>2 · Paperback content</h2><table>
<tr><th>ISBN</th><td>Get a free KDP ISBN</td></tr><tr><th>Print options</th><td><b>Black &amp; white interior, white paper</b></td></tr>
<tr><th>Trim size</th><td><b>8.5 × 11 in</b></td></tr><tr><th>Bleed</th><td><b>No bleed</b></td></tr><tr><th>Cover finish</th><td><b>Glossy</b></td></tr>
<tr><th>AI-generated content</th><td><b>Yes</b> — Images: “Entire work, with minimal or no editing”. Text: “Some sections, with minimal or no editing”.</td></tr></table>
<p>Then click <b>Launch Previewer</b> and check every page before approving.</p>
<h2>3 · Rights &amp; pricing</h2><p>Territories: <b>All territories</b>. Set each price yourself (don’t tick “base on Amazon.com price”):</p>
<table>${prices.map(([m, c, p]) => `<tr><th>${m} (${c})</th><td><b>${p}</b></td></tr>`).join('')}</table>
<p class="note">These prices sit at or just above Amazon’s 60% royalty line (below it you get 50%). Check the royalty KDP shows next to each price is above zero.</p>
${L.extraNote ? `<h2>Good to know</h2><p class="note">${esc(L.extraNote)}</p>` : ''}
<h2>Checks already done</h2><p>${PAGES} pages (even, over the 24-page minimum) · every page exactly 8.5 × 11 in · all artwork at least 0.5 in inside the edge · cover sized for ${PAGES} pages on white paper · no spine text (KDP only allows it over 79 pages) · barcode area on the back left clear · no fonts inside the PDFs (all lettering drawn as shapes) · all pictures original, with no brands or known characters.</p>
</body></html>`;

// ---------------------------------------------------------------- render
fs.mkdirSync(OUT, {recursive: true}); fs.mkdirSync(PREV, {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<!doctype html><html><head><style>@page{size:8.5in 11in;margin:0}html,body{margin:0}svg{display:block;width:8.5in;height:11in;page-break-after:always;break-after:page}svg:last-child{page-break-after:auto;break-after:auto}</style></head><body>${pages.join('')}</body></html>`);
const tooClose = await page.evaluate(() => [...document.querySelectorAll('body > svg')].map((svg, i) => {
  const sr = svg.getBoundingClientRect(), k = 850 / sr.width;
  const b = [...svg.children].reduce((acc, el) => { const r = el.getBoundingClientRect(); return {x1: Math.min(acc.x1, (r.left - sr.left) * k), y1: Math.min(acc.y1, (r.top - sr.top) * k), x2: Math.max(acc.x2, (r.right - sr.left) * k), y2: Math.max(acc.y2, (r.bottom - sr.top) * k)}; }, {x1: 1e9, y1: 1e9, x2: -1e9, y2: -1e9});
  return b.x1 < 50 || b.y1 < 50 || b.x2 > 800 || b.y2 > 1050 ? {page: i + 1, ...b} : null;
}).filter(Boolean));
if (tooClose.length) { console.error('Artwork too close to the edge:', tooClose); await browser.close(); process.exit(1); }
await page.pdf({path: `${OUT}/interior.pdf`, width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true});

await page.setViewportSize({width: 850, height: 1100});
for (const [i, name] of [[0, 'title'], [pages.length - 2, 'certificate']]) { await page.setContent(`<style>body{margin:0}</style>${pages[i].replace('width="8.5in" height="11in"', 'width="850" height="1100"')}`); await page.screenshot({path: `${PREV}/${name}.png`}); }
// contact sheets of all pictures (10 per image)
for (let s = 0; s < order.length; s += 10) {
  const keys = order.slice(s, s + 10);
  await page.setViewportSize({width: 425 * 5, height: 550 * Math.ceil(keys.length / 5)});
  await page.setContent(`<style>body{margin:0;display:flex;flex-wrap:wrap;width:${425 * 5}px;background:#999}svg{width:425px;height:550px;background:#fff;outline:1px solid #999}</style>${keys.map(k => colouringPage(pic(k))).join('')}`);
  await page.screenshot({path: `${PREV}/pages-${s / 10 + 1}.png`, fullPage: true});
}

await page.setContent(`<!doctype html><style>@page{size:${COVER_W}in ${COVER_H}in;margin:0}html,body{margin:0}svg{display:block}</style>${cover}`);
await page.pdf({path: `${OUT}/cover.pdf`, width: `${COVER_W}in`, height: `${COVER_H}in`, printBackground: true});
{ const {PDFDocument} = await import('pdf-lib'); const doc = await PDFDocument.load(fs.readFileSync(`${OUT}/cover.pdf`)); const pg = doc.getPage(0);
  const w = COVER_W * 72, h = COVER_H * 72, top = pg.getHeight();
  for (const box of ['MediaBox', 'CropBox', 'TrimBox', 'BleedBox']) pg[`set${box}`](0, top - h, w, h);
  fs.writeFileSync(`${OUT}/cover.pdf`, await doc.save()); }
await page.setViewportSize({width: Math.round(W), height: Math.round(H)});
await page.setContent(`<style>body{margin:0}</style>${cover.replace(`width="${COVER_W}in" height="${COVER_H}in"`, `width="${W}" height="${H}"`)}`);
await page.screenshot({path: `${PREV}/cover.png`});

await page.setContent(listingHtml.replace('__COVER__', fs.readFileSync(`${PREV}/cover.png`).toString('base64')));
await page.setViewportSize({width: 900, height: 1270}); await page.evaluate(() => document.fonts.ready); await page.screenshot({path: `${PREV}/listing-page1.png`});
await page.evaluate(() => document.fonts.ready);
await page.pdf({path: `${OUT}/listing.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true});
await browser.close();
fs.writeFileSync(`${OUT}/specs.json`, JSON.stringify({pages: PAGES, trim: '8.5 x 11 in', bleed: 'none (interior)', spineInches: SPINE, coverInches: [COVER_W, COVER_H], pictures: order.length}, null, 2));
console.log(`${title}: interior ${PAGES} pages, cover ${COVER_W} × ${COVER_H} in (spine ${SPINE} in), listing sheet → ${OUT}/`);
