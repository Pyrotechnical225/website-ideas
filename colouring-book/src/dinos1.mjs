// Dinosaur book, pages 1–10. Original cartoon dinosaurs built from two body shapes.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, sun, bird, grass, THIN} from './kit.mjs';
import {rot, sideFace, palm, fern, rock, volcano, ground, grassRow, says} from './kit2.mjs';

// Four-legged dinosaur facing right. behind/front get the body geometry for extras (plates, horns…).
export function quad({cx = 425, gy = 885, bw = 360, bh = 180, legH = 110, lw = 62, neckDx = 70, neckDy = 110, neckW = 70, headR = 42, tail = 220, tailDrop = 40, spots = false, behind = () => '', front = () => ''}) {
  const by = gy - legH - bh * 0.28, L = cx - bw / 2, R = cx + bw / 2;
  const hx = R + neckDx, hy = by - neckDy;
  const geo = {cx, gy, by, bw, bh, L, R, hx, hy, headR, tipX: L - tail, tipY: by + bh * 0.3 + tailDrop};
  const legs = (x, part) => rect(x - lw / 2, by, lw, gy - by, lw * 0.45, part) + line(`M${x - lw / 2 + 12},${gy - 4} l0,-14 M${x},${gy - 4} l0,-14 M${x + lw / 2 - 12},${gy - 4} l0,-14`, 4);
  return behind(geo) +
    path(`M${L + 50},${by - bh * 0.22} Q${L - tail * 0.45},${by - bh * 0.05} ${L - tail},${by + bh * 0.3 + tailDrop} Q${L - tail * 0.35},${by + bh * 0.42} ${L + 60},${by + bh * 0.3} Z`, 'body') +
    legs(cx - bw * 0.28 + 30, 'legFar') + legs(cx + bw * 0.26 + 30, 'legFar') +
    tube(`M${R - bw * 0.15},${by - bh * 0.12} Q${R + neckDx * 0.25},${by - neckDy * 0.75} ${hx},${hy}`, neckW, 'body') +
    ellipse(cx, by, bw / 2, bh / 2, 'body') +
    ellipse(cx - bw * 0.05, by + bh * 0.2, bw * 0.3, bh * 0.2, 'belly', THIN) +
    (spots ? [[-0.25, -0.2, 20], [0.05, -0.28, 15], [0.25, -0.12, 18], [-0.05, -0.05, 12]].map(([dx, dy, r]) => circle(cx + bw * dx, by + bh * dy, r, 'spot', 4)).join('') : '') +
    legs(cx - bw * 0.28, 'body') + legs(cx + bw * 0.26, 'body') +
    ellipse(hx + headR * 0.4, hy, headR * 1.4, headR, 'body') +
    sideFace(hx + headR * 0.55, hy - headR * 0.18, headR / 45) + dot(hx + headR * 1.6, hy - 2, 4) +
    front(geo);
}

// Two-legged dinosaur (T-rex style) facing right. s scales it.
export function biped({cx = 400, gy = 885, s = 1, head = 'rex', behind = () => '', front = () => ''}) {
  const bx = cx, byy = gy - 260 * s;
  const geo = {cx, gy, s, bx, byy, hx: cx + 90 * s, hy: gy - 420 * s};
  const hx = cx + 90 * s, hy = gy - 420 * s;
  const heads = {
    rex: path(`M${hx - 60 * s},${hy + 40 * s} Q${hx - 70 * s},${hy - 60 * s} ${hx + 20 * s},${hy - 62 * s} L${hx + 140 * s},${hy - 50 * s} Q${hx + 180 * s},${hy - 40 * s} ${hx + 180 * s},${hy} L${hx + 180 * s},${hy + 30 * s} Q${hx + 175 * s},${hy + 70 * s} ${hx + 120 * s},${hy + 70 * s} L${hx - 20 * s},${hy + 75 * s} Z`, 'body') +
      line(`M${hx + 20 * s},${hy + 30 * s} L${hx + 170 * s},${hy + 30 * s}`, THIN) + path(`M${hx + 60 * s},${hy + 30 * s} l12,16 l12,-16 M${hx + 100 * s},${hy + 30 * s} l12,16 l12,-16 M${hx + 140 * s},${hy + 30 * s} l10,14 l10,-14`, 'tooth', 3.5),
    raptor: path(`M${hx - 50 * s},${hy + 40 * s} Q${hx - 55 * s},${hy - 40 * s} ${hx + 10 * s},${hy - 45 * s} L${hx + 150 * s},${hy - 10 * s} Q${hx + 170 * s},${hy + 5 * s} ${hx + 150 * s},${hy + 25 * s} L${hx - 10 * s},${hy + 55 * s} Z`, 'body') + line(`M${hx + 30 * s},${hy + 18 * s} L${hx + 150 * s},${hy + 12 * s}`, THIN),
    dome: ellipse(hx + 30 * s, hy - 40 * s, 80 * s, 60 * s, 'dome') + path(`M${hx - 50 * s},${hy + 30 * s} Q${hx - 50 * s},${hy - 30 * s} ${hx + 30 * s},${hy - 25 * s} L${hx + 130 * s},${hy} Q${hx + 150 * s},${hy + 30 * s} ${hx + 120 * s},${hy + 50 * s} L${hx},${hy + 60 * s} Z`, 'body') + [0, 1, 2, 3].map(i => circle(hx - 30 * s + i * 38 * s, hy - 95 * s + Math.abs(i - 1.5) * 12 * s, 9 * s, 'spike', 4)).join(''),
    spino: path(`M${hx - 50 * s},${hy + 40 * s} Q${hx - 55 * s},${hy - 40 * s} ${hx + 10 * s},${hy - 45 * s} L${hx + 200 * s},${hy - 5 * s} Q${hx + 215 * s},${hy + 10 * s} ${hx + 195 * s},${hy + 25 * s} L${hx - 10 * s},${hy + 55 * s} Z`, 'body') + line(`M${hx + 30 * s},${hy + 20 * s} L${hx + 195 * s},${hy + 12 * s}`, THIN),
  };
  return behind(geo) +
    path(`M${cx - 70 * s},${gy - 350 * s} Q${cx - 240 * s},${gy - 270 * s} ${cx - 330 * s},${gy - 50 * s} Q${cx - 210 * s},${gy - 130 * s} ${cx - 40 * s},${gy - 160 * s} Z`, 'body') +
    rect(cx + 45 * s, gy - 150 * s, 46 * s, 140 * s, 20 * s, 'legFar') + ellipse(cx + 85 * s, gy - 13 * s, 48 * s, 16 * s, 'legFar', THIN) +
    rot(ellipse(bx, byy, 145 * s, 118 * s, 'body'), -30, bx, byy) +
    rot(ellipse(bx + 35 * s, byy + 20 * s, 70 * s, 55 * s, 'belly', THIN), -30, bx + 35 * s, byy + 20 * s) +
    path(`M${cx + 120 * s},${gy - 300 * s} q34,6 42,36 q-6,10 -16,2 q-6,-16 -30,-18 Z`, 'body', 5) +
    heads[head] +
    ellipse(cx - 20 * s, gy - 190 * s, 68 * s, 82 * s, 'body') + rect(cx - 50 * s, gy - 140 * s, 56 * s, 128 * s, 20 * s, 'body') + ellipse(cx - 5 * s, gy - 14 * s, 58 * s, 18 * s, 'body', THIN) +
    sideFace(hx + 20 * s, hy - 15 * s, s * (head === 'rex' ? 1.05 : 0.9)) + dot(hx + (head === 'spino' ? 195 : head === 'rex' ? 165 : 140) * s, hy - 12 * s, 4) +
    front(geo);
}

export const sky = (a = 'sun') => (a === 'sun' ? sun(680, 320, 42) : cloud(680, 320, 1)) + cloud(190, 330, 1) + bird(430, 320) + bird(475, 340, .8);

export const tRex = () => ({label: 'T-Rex', scene: sky() + fern(745, 885, 110, -1) + biped({cx: 430, s: .95}) + ground() + grassRow(885, [120, 560]) + rock(640, 885, 90, 45)});

export const triceratops = () => ({label: 'Triceratops', scene: sky('cloud') + fern(110, 885, 130, 1) + fern(750, 885, 110, -1) +
  quad({cx: 430, bw: 330, bh: 185, neckDx: 40, neckDy: 60, neckW: 90, headR: 52, tail: 150, spots: true,
    behind: gg => ellipse(gg.hx + 5, gg.hy - 35, 90, 105, 'frill') + [-60, -20, 20, 60].map(a => circle(gg.hx + 5 + Math.sin(a * Math.PI / 180) * 88, gg.hy - 35 - Math.cos(a * Math.PI / 180) * 100, 12, 'spike', 4)).join(''),
    front: gg => path(`M${gg.hx + 30},${gg.hy - 40} L${gg.hx + 70},${gg.hy - 125} L${gg.hx + 60},${gg.hy - 38} Z`, 'horn', THIN) + path(`M${gg.hx + 70},${gg.hy - 30} L${gg.hx + 125},${gg.hy - 105} L${gg.hx + 102},${gg.hy - 25} Z`, 'horn', THIN) + path(`M${gg.hx + 105},${gg.hy - 20} L${gg.hx + 130},${gg.hy - 62} L${gg.hx + 125},${gg.hy - 10} Z`, 'horn', THIN)}) + ground()});

export const stegosaurus = () => ({label: 'Stegosaurus', scene: sky() + rock(130, 885, 100, 55) +
  quad({cx: 440, bw: 360, bh: 200, neckDx: 55, neckDy: 40, neckW: 60, headR: 36, tail: 160, tailDrop: 10,
    behind: gg => [-150, -95, -40, 15, 70, 120].map((dx, i) => { const x = gg.cx + dx, top = gg.by - Math.sqrt(Math.max(0, 1 - (dx / (gg.bw / 2)) ** 2)) * gg.bh / 2; const h = 60 + (i === 2 || i === 3 ? 25 : 0); return path(`M${x - 34},${top + 20} L${x},${top - h} L${x + 34},${top + 20} Z`, 'plate', THIN); }).join('') +
      path(`M${gg.tipX + 30},${gg.tipY - 8} l-10,-55 l28,48 Z M${gg.tipX + 55},${gg.tipY - 14} l5,-55 l18,50 Z`, 'spike', 4)}) + ground() + grassRow(885, [700, 750])});

export const longNeck = () => ({label: 'Brachiosaurus', shift: 45, scene: sun(170, 330, 40) + cloud(690, 470, .8) + fern(745, 885, 110, -1) +
  quad({cx: 380, bw: 300, bh: 190, legH: 150, lw: 64, neckDx: 90, neckDy: 330, neckW: 70, headR: 40, tail: 120, spots: true}) + ground() + grassRow(885, [110, 520])});

export const pterodactyl = () => ({label: 'Pterodactyl', scene: sun(170, 330, 42) + cloud(640, 320, 1) + cloud(200, 780, .9) + cloud(650, 820, 1.1) +
  path('M420,560 L140,470 Q180,560 250,580 Q300,640 400,620 Z', 'wing') + path('M440,560 L720,470 Q680,560 610,580 Q560,640 460,620 Z', 'wing') +
  line('M190,520 L330,590 M660,520 L520,590', 4) +
  ellipse(430, 590, 55, 80, 'body') + path('M430,500 L400,420 L440,470 Z', 'crest', THIN) +
  ellipse(470, 490, 60, 38, 'body') + path('M510,480 L600,500 L510,510 Z', 'beak', THIN) + sideFace(470, 482, .8) +
  line('M405,662 l-15,40 M455,662 l15,40', 8)});

export const ankylosaurus = () => ({label: 'Ankylosaurus', scene: sky('cloud') + rock(130, 885, 70, 40) +
  quad({cx: 450, bw: 360, bh: 170, legH: 80, lw: 70, neckDx: 40, neckDy: 20, neckW: 80, headR: 44, tail: 130, tailDrop: -10,
    behind: gg => [-150, -100, -50, 0, 50, 100, 150].map(dx => { const x = gg.cx + dx, top = gg.by - Math.sqrt(Math.max(0, 1 - (dx / (gg.bw / 2)) ** 2)) * gg.bh / 2; return path(`M${x - 18},${top + 12} L${x},${top - 30} L${x + 18},${top + 12} Z`, 'spike', 4); }).join(''),
    front: gg => [-120, -40, 40, 120].map(dx => ellipse(gg.cx + dx, gg.by - 20, 28, 18, 'shell', 4)).join('') + circle(gg.tipX + 10, gg.tipY - 5, 40, 'club') + circle(gg.tipX - 2, gg.tipY - 15, 10, 'spike', 4)}) + ground()});

export const spinosaurus = () => ({label: 'Spinosaurus', scene: sky() + rock(720, 885, 80, 40) +
  biped({cx: 440, s: .95, head: 'spino', behind: gg => path(`M${gg.cx - 150},${gg.byy - 20} Q${gg.cx - 90},${gg.byy - 250} ${gg.cx + 20},${gg.byy - 260} Q${gg.cx + 100},${gg.byy - 240} ${gg.cx + 100},${gg.byy - 120} Z`, 'sail') + line(`M${gg.cx - 90},${gg.byy - 40} L${gg.cx - 80},${gg.byy - 190} M${gg.cx - 30},${gg.byy - 60} L${gg.cx - 20},${gg.byy - 245} M${gg.cx + 30},${gg.byy - 90} L${gg.cx + 40},${gg.byy - 250}`, THIN)}) + ground() + grassRow(885, [620, 720])});

export const parasaurolophus = () => ({label: 'Parasaurolophus', scene: sky('cloud') + fern(745, 885, 110, -1) +
  quad({cx: 430, bw: 320, bh: 180, legH: 120, neckDx: 80, neckDy: 170, neckW: 64, headR: 40, tail: 160, spots: true,
    behind: gg => tube(`M${gg.hx + 20},${gg.hy - 20} Q${gg.hx - 40},${gg.hy - 80} ${gg.hx - 110},${gg.hy - 75}`, 40, 'crest')}) + ground() + grassRow(885, [680, 740])});

export const velociraptor = () => ({label: 'Velociraptor', scene: sky() + fern(700, 885, 120, -1) + rock(140, 885, 90, 45) +
  biped({cx: 420, s: .8, head: 'raptor', front: gg => path(`M${gg.cx + 30},${gg.gy - 5} l20,-28 l6,28 Z`, 'claw', 4)}) + ground() + grassRow(885, [560])});

export const diplodocus = () => ({label: 'Diplodocus', scene: sun(650, 320, 40) + cloud(200, 330, 1) + rock(720, 885, 90, 45) +
  quad({cx: 400, bw: 290, bh: 170, legH: 130, lw: 58, neckDx: 150, neckDy: 220, neckW: 56, headR: 34, tail: 150, tailDrop: 60, spots: true}) + ground() + grassRow(885, [110, 500])});
