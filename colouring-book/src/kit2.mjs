// Extra drawing helpers for the Dinosaur, Farm and Christmas books.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, grass, flower, star, THIN, LINE} from './kit.mjs';
import {outlineText} from './page.mjs';

export const rot = (content, a, cx, cy) => g(content, `rotate(${a},${cx},${cy})`);
export const at = (content, x, y, s = 1) => g(content, `translate(${x},${y}) scale(${s})`);

// A cute side-view face: one eye with shine, a smile and a rosy cheek. dir = 1 faces right.
export function sideFace(cx, cy, s = 1, dir = 1, {smile = true} = {}) {
  return circle(cx, cy, 13 * s, 'eye', THIN * Math.min(1, s)) + dot(cx + 2 * s * dir, cy + 1 * s, 7 * s) + `<circle cx="${cx - 1 * s * dir}" cy="${cy - 3 * s}" r="${2.6 * s}" fill="#fff"/>` +
    (smile ? line(`M${cx + 10 * s * dir},${cy + 26 * s} Q${cx + 26 * s * dir},${cy + 36 * s} ${cx + 40 * s * dir},${cy + 22 * s}`, THIN * Math.min(1, s)) : '') +
    circle(cx - 16 * s * dir, cy + 26 * s, 8 * s, 'cheek', 3.5);
}
export const zzz = (x, y) => outlineText('z', x, y, 40, {sw: 4}) + outlineText('z', x + 30, y - 35, 52, {sw: 4}) + outlineText('Z', x + 70, y - 80, 66, {sw: 5});

// Speech bubble with outline letters to colour, e.g. "Moo!". Tail points at (tx,ty).
export function says(text, x, y, tx, ty, size = 58) {
  const w = Math.max(150, text.length * size * 0.62 + 60), h = size + 50;
  return path(`M${x - w / 2 + 30},${y - h / 2} L${x + w / 2 - 30},${y - h / 2} Q${x + w / 2},${y - h / 2} ${x + w / 2},${y - h / 2 + 30} L${x + w / 2},${y + h / 2 - 30} Q${x + w / 2},${y + h / 2} ${x + w / 2 - 30},${y + h / 2} L${(x + tx) / 2 + 22},${y + h / 2} L${tx},${ty} L${(x + tx) / 2 - 18},${y + h / 2} L${x - w / 2 + 30},${y + h / 2} Q${x - w / 2},${y + h / 2} ${x - w / 2},${y + h / 2 - 30} L${x - w / 2},${y - h / 2 + 30} Q${x - w / 2},${y - h / 2} ${x - w / 2 + 30},${y - h / 2} Z`, 'bubble', THIN) +
    outlineText(text, x, y + size * 0.36, size, {sw: 5});
}

// ---- scenery
export function palm(x, ground, s = 1) {
  let leaves = '';
  for (const a of [-160, -120, -60, -20, 200]) leaves += rot(ellipse(x + 70 * s, ground - 250 * s, 75 * s, 22 * s, 'leaves', THIN), a, x, ground - 250 * s);
  return tube(`M${x - 10 * s},${ground} Q${x + 20 * s},${ground - 120 * s} ${x},${ground - 245 * s}`, 38 * s, 'trunk') + leaves + circle(x, ground - 250 * s, 16 * s, 'coconut', THIN);
}
export function fern(x, ground, h = 120, dir = 1) {
  let d = `M${x},${ground} Q${x + 30 * dir},${ground - h * 0.6} ${x + 70 * dir},${ground - h}`;
  let leaves = '';
  for (let i = 1; i <= 4; i++) { const t = i / 5, px = x + 70 * dir * t * t + 30 * dir * t * (1 - t) * 2 * 0.5, py = ground - h * t; leaves += ellipse(px - 22, py, 22, 9, 'leaves', 4) + ellipse(px + 22, py - 4, 22, 9, 'leaves', 4); }
  return leaves + line(d, 5);
}
export const rock = (x, ground, w = 90, h = 50) => path(`M${x - w / 2},${ground} Q${x - w / 2},${ground - h} ${x - w / 6},${ground - h} Q${x + w / 4},${ground - h - 10} ${x + w / 2},${ground - h / 3} L${x + w / 2},${ground} Z`, 'rock', THIN);
export function volcano(x, ground, w = 330, h = 300) {
  const top = ground - h;
  return cloud(x - 20, top - 70, .8) + cloud(x + 50, top - 130, .6) +
    path(`M${x - w / 2},${ground} L${x - 55},${top} L${x + 55},${top} L${x + w / 2},${ground} Z`, 'volcano') +
    path(`M${x - 55},${top} Q${x - 40},${top + 70} ${x - 25},${top + 40} Q${x - 10},${top + 110} ${x + 10},${top + 50} Q${x + 30},${top + 90} ${x + 55},${top} Z`, 'lava', THIN) +
    ellipse(x, top, 55, 14, 'lava', THIN);
}
export function fence(x1, x2, ground, h = 110) {
  let posts = '';
  for (let x = x1; x <= x2; x += 80) posts += path(`M${x - 18},${ground} L${x - 18},${ground - h} L${x},${ground - h - 22} L${x + 18},${ground - h} L${x + 18},${ground} Z`, 'fence', THIN);
  return rect(x1 - 10, ground - h + 15, x2 - x1 + 20, 22, 4, 'fence', THIN) + rect(x1 - 10, ground - h / 2, x2 - x1 + 20, 22, 4, 'fence', THIN) + posts;
}
export function snowflake(x, y, r = 22) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3, ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r, bx = x + Math.cos(a) * r * 0.55, by = y + Math.sin(a) * r * 0.55;
    d += `M${x},${y} L${ex},${ey} M${bx},${by} L${bx + Math.cos(a + 0.8) * r * 0.35},${by + Math.sin(a + 0.8) * r * 0.35} M${bx},${by} L${bx + Math.cos(a - 0.8) * r * 0.35},${by + Math.sin(a - 0.8) * r * 0.35} `;
  }
  return line(d, 4);
}
export const snowGround = (y = 885) => path(`M60,${y + 20} Q200,${y - 30} 380,${y} Q560,${y + 25} 790,${y - 20} L790,${y + 60} L60,${y + 60} Z`, 'snow', THIN);
export function heart(x, y, s = 1) { return path(`M${x},${y + 30 * s} C${x - 45 * s},${y} ${x - 40 * s},${y - 35 * s} ${x - 18 * s},${y - 36 * s} C${x - 6 * s},${y - 36 * s} ${x},${y - 28 * s} ${x},${y - 20 * s} C${x},${y - 28 * s} ${x + 6 * s},${y - 36 * s} ${x + 18 * s},${y - 36 * s} C${x + 40 * s},${y - 35 * s} ${x + 45 * s},${y} ${x},${y + 30 * s} Z`, 'heart', 4); }
export const ground = (y = 885) => line(`M70,${y} L780,${y}`);
export const grassRow = (y = 885, xs = [120, 250, 600, 730]) => xs.map(x => grass(x, y)).join('');
export {flower, star};
