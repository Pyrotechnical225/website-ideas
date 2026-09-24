// Builds the KDP files:
//   out/interior.pdf  — 64 pages, 8.5 × 11 in, no bleed, black & white
//   out/cover.pdf     — full wrap cover (back + spine + front) with 0.125 in bleed
//   preview/*.png     — images to check the pages and cover
import {chromium} from 'playwright';
import fs from 'node:fs';
import {FONT_CSS, svgPage, colouringPage, outlineText, solidText} from './page.mjs';
import {withPalette, rect, circle, path, line, face, wheel, cloud, sun, star, THIN} from './kit.mjs';
import * as v1 from './vehicles1.mjs';
import * as v2 from './vehicles2.mjs';
import * as v3 from './vehicles3.mjs';

const V = {...v1, ...v2, ...v3};
export const ORDER = ['car', 'bus', 'fireEngine', 'tractor', 'digger', 'aeroplane', 'train', 'policeCar', 'sailingBoat', 'dumpTruck',
  'helicopter', 'iceCreamVan', 'ambulance', 'rocket', 'bicycle', 'cementMixer', 'taxi', 'submarine', 'motorbike', 'bulldozer',
  'hotAirBalloon', 'camperVan', 'crane', 'tugboat', 'raceCar', 'binLorry', 'scooter', 'towTruck', 'monsterTruck', 'roadRoller'];
export const TITLE = 'Things That Go!', SUBTITLE = 'Colouring Book for Toddlers';
const YEAR = new Date().getFullYear();

// ---------------------------------------------------------------- interior
const titlePage = svgPage(
  outlineText('Things That Go!', 425, 200, 92, {sw: 8}) + solidText('Colouring Book', 425, 285, 50) +
  g2(`translate(425,590) scale(.6) translate(-425,-640)`, V.digger().scene) +
  rect(165, 800, 520, 170, 26, null, THIN) + solidText('This book belongs to:', 425, 860, 40) + line('M215,935 L635,935', 4));
function g2(t, c) { return `<g transform="${t}">${c}</g>`; }
const swatches = [0, 1, 2, 3, 4, 5, 6, 7].map(i => circle(215 + (i % 4) * 140, 560 + Math.floor(i / 4) * 150, 52, null, THIN)).join('');
const infoPage = svgPage(
  solidText('Test your colours here!', 425, 440, 44) + swatches +
  solidText(`${TITLE} ${SUBTITLE}`, 425, 900, 22, {weight: 600}) +
  solidText(`Copyright © ${YEAR}. All rights reserved.`, 425, 935, 20, {weight: 400}) +
  solidText('No part of this book may be reproduced without permission, except for personal use.', 425, 965, 17, {weight: 400}) +
  solidText('Tip: place a sheet of card behind the page when using pens.', 425, 995, 17, {weight: 400}));
const blankBack = svgPage(solidText('This page is left blank so colours don’t show through.', 425, 1000, 18, {weight: 400, color: '#777'}));
const certificate = svgPage(
  rect(90, 110, 670, 880, 40, null, 9) + rect(120, 140, 610, 820, 28, null, 4) +
  outlineText('Well Done!', 425, 300, 110, {sw: 8}) + solidText('You coloured every page of', 425, 390, 34) + solidText('Things That Go!', 425, 440, 40, {weight: 700}) +
  star(250, 560, 55) + star(425, 530, 70) + star(600, 560, 55) +
  solidText('Name:', 190, 720, 34, {anchor: 'start'}) + line('M300,722 L660,722', 4) +
  solidText('Date:', 190, 810, 34, {anchor: 'start'}) + line('M300,812 L660,812', 4) +
  g2('translate(425,900) scale(.28) translate(-425,-700)', face(425, 700, 3)));

const pages = [titlePage, infoPage];
for (const key of ORDER) pages.push(colouringPage(V[key]()), blankBack);
pages.push(certificate, blankBack);
if (pages.length % 2 || pages.length < 24) throw new Error('Page count must be even and at least 24');

// ---------------------------------------------------------------- cover
const PAGES = pages.length;
const SPINE = +(PAGES * 0.002252).toFixed(4);           // inches, white paper (KDP formula)
const BLEED = 0.125, TRIM_W = 8.5, TRIM_H = 11;
const COVER_W = +(BLEED * 2 + TRIM_W * 2 + SPINE).toFixed(4), COVER_H = TRIM_H + BLEED * 2;
const u = x => x * 100;                                   // inches → drawing units
const backX = u(BLEED), spineX = u(BLEED + TRIM_W), frontX = u(BLEED + TRIM_W + SPINE);

const base = {window: '#bfe6ff', tyre: '#3b3b3b', hub: '#d9d9d9', light: '#ffe066', light2: '#ff8a8a', eye: '#fff', cheek: '#ffb3c1', sun: '#ffd23f', cloud: '#fff', trim: '#d9d9d9', leaves: '#5cc16b', trunk: '#a0673c', hill: '#8fd694', petal: '#ff8fb1', flowerMid: '#ffd23f', smoke: '#eee', star: '#ffd23f', ground: '#fff'};
const palettes = {
  fireEngine: {...base, body: '#ff4b3e', cab: '#ff4b3e', ladder: '#e0e0e0', locker: '#ff7a6e', stripe: '#ffd23f', siren: '#4dabf7', hose: '#ffd23f'},
  digger: {...base, body: '#ffc53d', cab: '#ffc53d', arm: '#ffc53d', bucket: '#9e9e9e', track: '#555', exhaust: '#777', dirt: '#b07a4f'},
  rocket: {...base, body: '#f1f3f5', fin: '#ff4b3e', nozzle: '#868e96', flame: '#ff922b', flame2: '#ffd23f', window: '#74c0fc', planet: '#b197fc', ring: '#ffd23f', moon: '#fff3bf'},
  train: {...base, boiler: '#2f9e44', cab: '#2f9e44', dome: '#ffd23f', chimney: '#555', roof: '#c92a2a', base: '#c92a2a', carriage: '#4dabf7', cowcatcher: '#ffd23f', sleeper: '#a0673c'},
  bus: {...base, body: '#ff4b3e', door: '#ffd23f', sign: '#fff3bf'},
  tractor: {...base, cab: '#51cf66', bonnet: '#51cf66', roof: '#ffd23f', exhaust: '#777', puff: '#eee'},
};
const tile = (key, x, y, size, bg) => withPalette(palettes[key], () => {
  const vehicle = V[key]();
  return `<g transform="translate(${x},${y})">${rect(0, 0, size, size, 34, null, 8).replace('fill="#fff"', `fill="${bg}"`)}
    <svg x="10" y="10" width="${size - 20}" height="${size - 20}" viewBox="70 ${260 + (vehicle.shift ?? 55)} 710 710"><g transform="translate(0,${vehicle.shift ?? 55})">${vehicle.scene}</g></svg></g>`;
});
const thumb = (key, x, y, w) => `<g transform="translate(${x},${y})">${rect(0, 0, w, w * 1.294, 10, null, 4)}<svg x="4" y="4" width="${w - 8}" height="${w * 1.294 - 8}" viewBox="0 0 850 1100">${colouringPage(V[key]()).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></g>`;

const fx = frontX, cw = u(TRIM_W);
const cover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${u(COVER_W)} ${u(COVER_H)}" width="${COVER_W}in" height="${COVER_H}in">
  <rect width="100%" height="100%" fill="#7cc8f8"/>
  <path d="M0,${u(COVER_H) - 170} Q${u(COVER_W) / 4},${u(COVER_H) - 260} ${u(COVER_W) / 2},${u(COVER_H) - 175} T${u(COVER_W)},${u(COVER_H) - 180} L${u(COVER_W)},${u(COVER_H)} L0,${u(COVER_H)} Z" fill="#7bd389"/>
  ${withPalette(base, () => cloud(fx + 120, 120, 1) + cloud(fx + 720, 110, .9) + cloud(backX + 700, 140, .9) + sun(backX + 120, 130, 45))}
  ${outlineText('Things That Go!', fx + cw / 2, 235, 100, {sw: 10, fillc: '#ffd23f'})}
  ${outlineText('Colouring Book for Toddlers', fx + cw / 2, 315, 48, {sw: 7, fillc: '#fff', weight: 700})}
  ${tile('fireEngine', fx + 100, 360, 315, '#fff8e1')}${tile('digger', fx + cw - 415, 360, 315, '#e7f5ff')}
  ${tile('rocket', fx + 100, 690, 315, '#f3f0ff')}${tile('train', fx + cw - 415, 690, 315, '#ebfbee')}
  <g transform="translate(${fx + cw / 2},1052)">${rect(-300, -38, 600, 64, 32, null, 6).replace('fill="#fff"', 'fill="#ff4b3e"')}${solidText('30 Big &amp; Simple Pictures · Ages 2–5', 0, 8, 32, {weight: 700, color: '#fff'})}</g>
  ${outlineText('Colour, Learn &amp; Go!', backX + cw / 2, 290, 66, {sw: 8, fillc: '#ffd23f'})}
  ${['Diggers, fire engines, trains, rockets and more!', '30 friendly vehicles with thick, easy lines —', 'made for little hands and first crayons.'].map((t, i) => solidText(t, backX + cw / 2, 370 + i * 42, 27, {color: '#0b2a3c'})).join('')}
  ${thumb('bus', backX + 115, 505, 185)}${thumb('tractor', backX + cw / 2 - 92, 505, 185)}${thumb('helicopter', backX + cw - 300, 505, 185)}
  ${['One picture per page, blank on the back', 'Each vehicle named to learn new words', 'Large 8.5 × 11 in pages', '“Well done!” certificate at the end'].map((t, i) => `<path d="M${backX + 118},${805 + i * 40} l9,10 l17,-22" fill="none" stroke="#0b2a3c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` + solidText(t, backX + 155, 815 + i * 40, 26, {anchor: 'start', color: '#0b2a3c'})).join('')}
  <rect x="${spineX}" y="0" width="${u(SPINE)}" height="${u(COVER_H)}" fill="#ffd23f"/>
</svg>`;

// ---------------------------------------------------------------- render
fs.mkdirSync('out', {recursive: true}); fs.mkdirSync('preview', {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage();
const interiorHtml = `<!doctype html><html><head><style>${FONT_CSS}@page{size:8.5in 11in;margin:0}html,body{margin:0}svg{display:block;width:8.5in;height:11in;page-break-after:always;break-after:page}svg:last-child{page-break-after:auto;break-after:auto}</style></head><body>${pages.join('')}</body></html>`;
await page.setContent(interiorHtml); await page.evaluate(() => document.fonts.ready);

// Safety check: every drawing must sit inside the page with at least 0.5 in to spare.
const tooClose = await page.evaluate(() => [...document.querySelectorAll('body > svg')].map((svg, i) => {
  const b = svg.querySelector(':scope > *') ? [...svg.children].reduce((acc, el) => { const r = el.getBBox(); return {x1: Math.min(acc.x1, r.x), y1: Math.min(acc.y1, r.y), x2: Math.max(acc.x2, r.x + r.width), y2: Math.max(acc.y2, r.y + r.height)}; }, {x1: 1e9, y1: 1e9, x2: -1e9, y2: -1e9}) : null;
  return b && (b.x1 < 50 || b.y1 < 50 || b.x2 > 800 || b.y2 > 1050) ? {page: i + 1, ...b} : null;
}).filter(Boolean));
if (tooClose.length) { console.error('Artwork too close to the edge:', tooClose); process.exit(1); }

await page.pdf({path: 'out/interior.pdf', width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true});
await page.setViewportSize({width: 850, height: 1100});
for (const [i, name] of [[0, 'page-01-title'], [2, 'page-03-car'], [pages.length - 2, `page-${pages.length - 1}-certificate`]]) {
  await page.setContent(`<style>${FONT_CSS}body{margin:0}</style>${pages[i].replace('width="8.5in" height="11in"', 'width="850" height="1100"')}`);
  await page.evaluate(() => document.fonts.ready); await page.screenshot({path: `preview/${name}.png`});
}
await page.setContent(`<!doctype html><style>${FONT_CSS}@page{size:${COVER_W}in ${COVER_H}in;margin:0}html,body{margin:0}svg{display:block}</style>${cover}`);
await page.evaluate(() => document.fonts.ready);
await page.pdf({path: 'out/cover.pdf', width: `${COVER_W}in`, height: `${COVER_H}in`, printBackground: true});
{ const {PDFDocument} = await import('pdf-lib'); const doc = await PDFDocument.load(fs.readFileSync('out/cover.pdf')); const pg = doc.getPage(0);
  const w = COVER_W * 72, h = COVER_H * 72, top = pg.getHeight();
  for (const box of ['MediaBox', 'CropBox', 'TrimBox', 'BleedBox']) pg[`set${box}`](0, top - h, w, h);
  fs.writeFileSync('out/cover.pdf', await doc.save()); }
await page.setViewportSize({width: Math.round(u(COVER_W)), height: Math.round(u(COVER_H))});
await page.setContent(`<style>${FONT_CSS}body{margin:0}</style>${cover.replace(`width="${COVER_W}in" height="${COVER_H}in"`, `width="${u(COVER_W)}" height="${u(COVER_H)}"`)}`);
await page.evaluate(() => document.fonts.ready); await page.screenshot({path: 'preview/cover.png'});
await browser.close();
fs.writeFileSync('out/specs.json', JSON.stringify({pages: PAGES, trim: '8.5 x 11 in', bleed: 'none (interior)', spineInches: SPINE, coverInches: [COVER_W, COVER_H], pictures: ORDER.length}, null, 2));
console.log(`Interior: ${PAGES} pages. Cover: ${COVER_W} × ${COVER_H} in (spine ${SPINE} in).`);
