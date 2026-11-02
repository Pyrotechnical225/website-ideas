// Makes a free printable sample pack (5 pages + welcome + "get the full book" page)
// for marketing, in US Letter and A4. Usage:
//   node src/make-sample.mjs christmas [amazonLink]
// With an Amazon link, the last page also gets the link and a QR code.
import {chromium} from 'playwright';
import fs from 'node:fs';
import {svgPage, colouringPage, outlineText, solidText} from './page.mjs';
import {rect, line, star, THIN} from './kit.mjs';

const book = (await import(`../books/${process.argv[2]}.mjs`)).default;
const link = process.argv[3] || '';
const YEAR = new Date().getFullYear();
const {title, slug, pictures} = book;
const S = book.sample;   // {pages: [5 keys], teaser: [6 keys], theme, search}
const pic = k => pictures[k]();
const dir = `marketing/${slug}`; fs.mkdirSync(dir, {recursive: true});

const footer = solidText(`Free sample from “${title}” Colouring Book · © ${YEAR} · Free for home & classroom use — please don’t resell`, 425, 1045, 15, {color: '#666'});
const withFooter = svg => svg.replace(/<\/svg>$/, footer + '</svg>');
const inner = svg => svg.replace(/^<svg[^>]*>|<\/svg>$/g, '');
const thumb = (k, x, y, w) => `<g transform="translate(${x},${y})">${rect(0, 0, w, w * 1.294, 10, null, 4)}<svg x="4" y="4" width="${w - 8}" height="${w * 1.294 - 8}" viewBox="0 0 850 1100">${inner(colouringPage(pic(k)))}</svg></g>`;

let qr = '';
if (link) {
  const QR = (await import('qrcode')).default;
  const m = QR.create(link, {errorCorrectionLevel: 'M'}).modules, n = m.size, cell = 200 / (n + 8);
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m.get(r, c)) d += `M${(c + 4) * cell},${(r + 4) * cell}h${cell}v${cell}h${-cell}Z`;
  qr = `<g transform="translate(560,800)"><rect width="200" height="200" fill="#fff" stroke="#000" stroke-width="3"/><path d="${d}" fill="#000"/></g>`;
}

const coverPng = fs.readFileSync(`preview/${slug}/cover.png`).toString('base64');
const welcome = svgPage(
  outlineText('FREE Colouring Pages', 425, 170, 70, {sw: 7}) + solidText(`${S.pages.length} ${S.theme} pictures for toddlers to print & colour`, 425, 235, 30) +
  `<svg x="215" y="290" width="420" height="520" viewBox="880 0 858 1125" preserveAspectRatio="xMidYMid slice"><image href="data:image/png;base64,${coverPng}" x="0" y="0" width="1739" height="1125"/></svg>` +
  rect(215, 290, 420, 520, 12, null, 4).replace('fill="#fff"', 'fill="none"') +
  solidText(`From the book “${title}”`, 425, 865, 30, {weight: 700}) +
  solidText('Tip: print on thicker paper, or put card behind the page when using pens.', 425, 925, 20) +
  solidText('Print “fit to page” on A4 or US Letter. One picture per page.', 425, 960, 20) + footer);

const teaser = svgPage(
  outlineText('Did they love it?', 425, 160, 76, {sw: 7}) +
  solidText(`The full book has ${book.order.length} big & simple pictures, including these:`, 425, 230, 28) +
  S.teaser.map((k, i) => thumb(k, 95 + (i % 3) * 230, 280 + Math.floor(i / 3) * 250, 180)).join('') +
  (link
    ? ['Blank backs, so pens don’t bleed through', 'Thick, easy lines · Large 8.5 × 11 in pages', 'Picture names · “Well done!” certificate']
    : ['One picture per page, with blank backs so pens don’t bleed through', 'Thick, easy lines for first crayons · Large 8.5 × 11 in pages', 'Each picture named to learn new words · “Well done!” certificate']
  ).map((t, i) => solidText(t, link ? 95 : 425, 820 + i * 40, 22, {anchor: link ? 'start' : 'middle'})).join('') +
  (link
    ? solidText('Find it on Amazon — scan or visit:', 95, 960, 24, {weight: 700, anchor: 'start'}) + solidText(link.replace(/^https?:\/\//, ''), 95, 995, 20, {anchor: 'start'}) + qr
    : solidText('Find it on Amazon — search:', 425, 960, 26, {weight: 700}) + solidText(`“${S.search}”`, 425, 998, 24)) +
  star(70, 120, 24) + star(780, 120, 24) + footer);

const pages = [welcome, ...S.pages.map(k => withFooter(colouringPage(pic(k)))), teaser];
const b = await chromium.launch(); const p = await b.newPage();
for (const [fmt, css, label] of [['Letter', 'size:8.5in 11in', 'US Letter'], ['A4', 'size:210mm 297mm', 'A4 (UK & Europe)']]) {
  const w = fmt === 'A4' ? '210mm' : '8.5in', h = fmt === 'A4' ? '297mm' : '11in';
  await p.setContent(`<!doctype html><style>@page{${css};margin:0}html,body{margin:0}svg.pg{display:block;width:${w};height:${h};break-after:page}svg.pg:last-child{break-after:auto}</style>${pages.map(s => s.replace('<svg ', '<svg class="pg" preserveAspectRatio="xMidYMid meet" ')).join('')}`);
  await p.waitForTimeout(300);
  const file = `${dir}/1 - FREE ${S.pages.length} ${S.theme} Colouring Pages for Toddlers - ${label}.pdf`;
  await p.pdf({path: file, preferCSSPageSize: true, printBackground: true});
  console.log('wrote', file);
}
await p.setViewportSize({width: 850, height: 1100});
for (const [i, n] of [[0, 'welcome'], [pages.length - 1, 'teaser']]) { await p.setContent(`<style>body{margin:0}</style>${pages[i].replace('width="8.5in" height="11in"', 'width="850" height="1100"')}`); await p.waitForTimeout(200); await p.screenshot({path: `${dir}/_preview-${n}.png`}); }
await b.close();
fs.copyFileSync(`preview/${slug}/cover.png`, `${dir}/3 - Preview - Full Book Cover.png`);
