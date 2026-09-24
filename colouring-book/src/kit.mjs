// Drawing kit for the colouring pages. Units: 1 = 0.01 inch (page is 850 × 1100).
// Every shape takes a "part" name. Interior pages leave every part white; the cover
// passes a palette so the same drawings appear in colour.
export const LINE = 7, THIN = 5;
let palette = null;
export const withPalette = (p, fn) => { const prev = palette; palette = p; try { return fn(); } finally { palette = prev; } };
const fill = part => (palette && part && palette[part]) || '#fff';
const st = (part, w = LINE) => `fill="${fill(part)}" stroke="#000" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

export const rect = (x, y, w, h, r = 0, part, sw) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${st(part, sw)}/>`;
export const circle = (cx, cy, r, part, sw) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${st(part, sw)}/>`;
export const ellipse = (cx, cy, rx, ry, part, sw) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st(part, sw)}/>`;
export const path = (d, part, sw) => `<path d="${d}" ${st(part, sw)}/>`;
export const line = (d, sw = LINE) => `<path d="${d}" fill="none" stroke="#000" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const dot = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000"/>`;
export const g = (content, transform = '') => `<g${transform ? ` transform="${transform}"` : ''}>${content}</g>`;

// A chunky wheel with a hub.
export const wheel = (cx, cy, r, part = 'tyre') => circle(cx, cy, r, part) + circle(cx, cy, r * 0.46, 'hub', THIN) + circle(cx, cy, r * 0.14, 'hub', THIN);

// A friendly face: two eyes with shine and a smile. s = size multiplier.
export function face(cx, cy, s = 1, { smile = true, cheeks = true } = {}) {
  const ex = 22 * s, er = 13 * s;
  let out = '';
  for (const x of [cx - ex, cx + ex]) out += circle(x, cy, er, 'eye', THIN * Math.min(1, s)) + dot(x + 2 * s, cy + 2 * s, 6.5 * s) + `<circle cx="${x - 2 * s}" cy="${cy - 3 * s}" r="${2.4 * s}" fill="#fff"/>`;
  if (smile) out += line(`M${cx - 16 * s},${cy + 24 * s} Q${cx},${cy + 38 * s} ${cx + 16 * s},${cy + 24 * s}`, THIN * Math.min(1, s));
  if (cheeks) out += circle(cx - 40 * s, cy + 20 * s, 7 * s, 'cheek', 3.5) + circle(cx + 40 * s, cy + 20 * s, 7 * s, 'cheek', 3.5);
  return out;
}

// ---- scenery
export const cloud = (x, y, s = 1) => path(`M${x - 60 * s},${y + 20 * s} a${28 * s},${28 * s} 0 0 1 ${22 * s},${-42 * s} a${34 * s},${34 * s} 0 0 1 ${60 * s},${-12 * s} a${28 * s},${28 * s} 0 0 1 ${46 * s},${22 * s} a${22 * s},${22 * s} 0 0 1 ${-4 * s},${32 * s} Z`, 'cloud', THIN);
export function sun(x, y, r = 45) {
  let rays = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; rays += line(`M${x + Math.cos(a) * (r + 12)},${y + Math.sin(a) * (r + 12)} L${x + Math.cos(a) * (r + 30)},${y + Math.sin(a) * (r + 30)}`, THIN); }
  return rays + circle(x, y, r, 'sun', THIN) + dot(x - 13, y - 6, 4.5) + dot(x + 13, y - 6, 4.5) + line(`M${x - 13},${y + 12} Q${x},${y + 22} ${x + 13},${y + 12}`, 4);
}
export const bird = (x, y, s = 1) => line(`M${x - 18 * s},${y - 6 * s} Q${x - 9 * s},${y - 14 * s} ${x},${y} Q${x + 9 * s},${y - 14 * s} ${x + 18 * s},${y - 6 * s}`, 4.5);
export const tree = (x, ground, s = 1) => rect(x - 12 * s, ground - 90 * s, 24 * s, 90 * s, 4, 'trunk', THIN) + circle(x, ground - 125 * s, 55 * s, 'leaves', THIN);
export const hill = (x1, x2, ground, h) => path(`M${x1},${ground} Q${(x1 + x2) / 2},${ground - h * 2} ${x2},${ground} Z`, 'hill', THIN);
export const grass = (x, y) => line(`M${x - 12},${y} L${x - 6},${y - 18} M${x},${y} L${x},${y - 24} M${x + 12},${y} L${x + 6},${y - 18}`, 4);
export function flower(x, y) { let p = ''; for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; p += circle(x + Math.cos(a) * 11, y - 40 + Math.sin(a) * 11, 9, 'petal', 3.5); } return line(`M${x},${y} L${x},${y - 30}`, 4) + p + circle(x, y - 40, 7, 'flowerMid', 3.5); }
export function star(x, y, r = 16) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)} `; } return path(d + 'Z', 'star', 4); }
export const road = (y = 885) => line(`M70,${y} L780,${y}`) + [150, 330, 510, 690].map(x => line(`M${x - 40},${y + 45} L${x + 40},${y + 45}`, 6)).join('');
export const waves = (y, x1 = 70, x2 = 780, amp = 14) => { let d = `M${x1},${y}`; for (let x = x1; x < x2; x += 60) d += ` q15,${-amp} 30,0 q15,${amp} 30,0`; return line(d, THIN); };
// Hollow tube (for bike frames etc.): thick black line with a colourable centre.
export const tube = (d, w = 26, part = 'frame') => `<path d="${d}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill(part)}" stroke-width="${w - 13}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const fish = (x, y, s = 1, flip = false) => g(path(`M${-38},0 L${-72},${-24} L${-72},${24} Z`, 'fish', 4.5) + ellipse(0, 0, 46, 28, 'fish', 4.5) + dot(22, -6, 5) + line('M-8,-18 Q2,0 -8,18', 4), `translate(${x},${y}) scale(${flip ? -s : s},${s})`);
export const seaweed = (x, y, h = 120) => line(`M${x},${y} q-18,${-h / 4} 0,${-h / 2} q18,${-h / 4} 0,${-h / 2}`, 6);
export const bubble = (x, y, r = 12) => circle(x, y, r, 'bubble', 4);
export function moon(x, y, r = 40) { return path(`M${x},${y - r} A${r},${r} 0 1 0 ${x},${y + r} A${r * 0.75},${r} 0 1 1 ${x},${y - r} Z`, 'moon', THIN); }
