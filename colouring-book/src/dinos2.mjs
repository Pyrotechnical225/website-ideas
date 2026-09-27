// Dinosaur book, pages 11–20 — original cartoon dinosaurs and scenes.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, sun, bird, grass, star, face, THIN} from './kit.mjs';
import {rot, sideFace, palm, fern, rock, volcano, ground, grassRow, says, zzz} from './kit2.mjs';
import {quad, biped, sky} from './dinos1.mjs';

// Shrinks a drawing towards the ground line so it stays standing on it.
export const small = (content, s, dx = 0, gy = 885) => g(content, `translate(${dx + 425 * (1 - s)},${gy * (1 - s)}) scale(${s})`);

export const iguanodon = () => ({label: 'Iguanodon', scene: sky('cloud') +
  quad({cx: 440, bw: 330, bh: 180, legH: 130, neckDx: 70, neckDy: 120, neckW: 70, headR: 44, tail: 150, spots: true,
    front: gg => path(`M${gg.R - 20},${gg.by + 40} l40,-18 l-14,34 Z`, 'claw', 4)}) + ground() + grassRow(885, [700, 750])});

export const dimetrodon = () => ({label: 'Dimetrodon', scene: sky() + rock(720, 885, 90, 45) +
  quad({cx: 430, bw: 380, bh: 140, legH: 70, lw: 56, neckDx: 40, neckDy: 10, neckW: 70, headR: 46, tail: 150, tailDrop: 20,
    behind: gg => path(`M${gg.cx - 170},${gg.by - 20} Q${gg.cx - 120},${gg.by - 260} ${gg.cx},${gg.by - 270} Q${gg.cx + 120},${gg.by - 260} ${gg.cx + 170},${gg.by - 20} Z`, 'sail') + line([-100, -50, 0, 50, 100].map(dx => `M${gg.cx + dx},${gg.by - 40} L${gg.cx + dx * 1.2},${gg.by - 250 + Math.abs(dx) * 0.4}`).join(' '), THIN)}) + ground() + grassRow(885, [110])});

export const pachycephalosaurus = () => ({label: 'Pachycephalosaurus', scene: sky('cloud') + fern(745, 885, 110, -1) + biped({cx: 420, s: .85, head: 'dome'}) + ground() + grassRow(885, [120])});

export const allosaurus = () => ({label: 'Allosaurus', scene: sky() + rock(720, 885, 90, 45) +
  biped({cx: 430, s: .9, head: 'rex', front: gg => path(`M${gg.hx - 10},${gg.hy - 55} l18,-34 l18,30 Z M${gg.hx + 40},${gg.hy - 52} l16,-28 l16,26 Z`, 'horn', 4)}) + ground() + grassRow(885, [110])});

export const plesiosaurus = () => ({label: 'Plesiosaurus', scene: sun(170, 330, 42) + cloud(420, 320, .9) + bird(700, 330) +
  ellipse(250, 700, 60, 22, 'flipper', THIN) + ellipse(500, 705, 60, 22, 'flipper', THIN) +
  path('M230,660 Q150,640 110,700 Q170,690 240,700 Z', 'body') +
  tube('M470,630 Q560,560 590,450', 64, 'body') + ellipse(400, 650, 170, 75, 'body') + [340, 400, 460].map(x => circle(x, 625, 14, 'spot', 4)).join('') +
  ellipse(610, 435, 55, 38, 'body') + sideFace(615, 425, .8) + dot(655, 432, 4) +
  rot(ellipse(300, 735, 65, 22, 'flipper', THIN), 20, 300, 735) + rot(ellipse(470, 735, 65, 22, 'flipper', THIN), -15, 470, 735) +
  [700, 770, 840, 910].map((y, i) => line(`M${80 + (i % 2) * 30},${y} ${Array.from({length: 10}, (_, k) => `q16,-14 32,0 q16,14 32,0`).join(' ')}`, THIN)).join('')});

export const archaeopteryx = () => ({label: 'Archaeopteryx', shift: 150, scale: 1.15, scene: cloud(250, 420, .8) +
  tube('M130,720 Q400,690 720,730', 36, 'branch') + ellipse(630, 690, 40, 20, 'leaves', THIN) + ellipse(680, 702, 36, 18, 'leaves', THIN) + ellipse(190, 690, 40, 20, 'leaves', THIN) +
  path('M340,640 Q250,650 200,560 Q260,580 300,560 Q280,600 350,610 Z', 'tail') + line('M235,575 L320,620 M260,600 L330,625', 4) +
  ellipse(400, 600, 90, 70, 'body') + path('M380,570 Q330,520 300,600 Q350,590 390,620 Z', 'wing', THIN) + line('M330,575 L370,600 M320,592 L365,610', 4) +
  ellipse(470, 520, 55, 45, 'body') + path('M510,515 L570,530 L510,545 Z', 'beak', THIN) + sideFace(475, 510, .8) +
  line('M380,665 L375,705 M420,665 L425,705', 9) + line('M365,708 l-12,8 M375,708 l0,12 M415,708 l0,12 M425,708 l12,8', 4)});

export const hatching = () => ({label: 'Hatching Egg', scene: sky() + fern(110, 885, 120, 1) + fern(745, 885, 110, -1) +
  path('M270,720 Q260,540 425,500 Q590,540 580,720 Q570,885 425,885 Q280,885 270,720 Z', 'egg') +
  line('M290,650 L340,620 L370,660 L410,610 L450,655 L490,615 L520,650 L565,625') +
  ellipse(425, 520, 95, 80, 'body') + face(425, 505, 1.2) +
  path('M300,470 l-30,-30 l40,10 Z M550,470 l30,-30 l-40,10 Z', 'shell', 4) + [340, 520].map(x => circle(x, 780, 18, 'spot', 4)).join('') + circle(430, 820, 14, 'spot', 4) + ground()});

export const nest = () => ({label: 'Dino Nest', scene: sky('cloud') + fern(745, 885, 110, -1) +
  [[300, 720], [400, 705], [500, 720], [350, 770], [450, 765]].map(([x, y]) => ellipse(x, y, 52, 68, 'egg') + circle(x - 15, y - 15, 10, 'spot', 4) + circle(x + 15, y + 20, 8, 'spot', 4)).join('') +
  path('M180,780 Q425,960 670,780 Q640,860 425,880 Q210,860 180,780 Z', 'nest') + line('M220,810 Q425,900 630,810 M250,845 Q425,905 600,845', 4) + ground() + grassRow(885, [110])});

export const volcanoPage = () => ({label: 'Volcano', scene: sun(160, 330, 38) + bird(640, 330) +
  volcano(560, 885, 360, 330) + small(quad({cx: 430, bw: 330, bh: 180, neckDx: 60, neckDy: 120, headR: 42, tail: 150, spots: true}), .62, -170) + ground() + grassRow(885, [110])});

export const fossil = () => ({label: 'Dino Fossil', scene: sun(660, 320, 40) + cloud(200, 330, 1) +
  path('M90,700 L760,700 L760,960 L90,960 Z', 'dirt', THIN) + [150, 300, 620, 700].map((x, i) => circle(x, 760 + (i % 2) * 150, 12, 'pebble', 4)).join('') +
  circle(560, 800, 45, 'bone') + circle(560, 800, 15, 'eye', 4) + path('M600,815 L660,830 L600,845 Z', 'bone', THIN) +
  line('M515,810 L220,820', 20) + line('M515,810 L220,820', 8).replace('stroke="#000"', 'stroke="#fff"') +
  [260, 320, 380, 440].map(x => line(`M${x},818 Q${x - 10},770 ${x + 10},745 M${x},818 Q${x - 10},870 ${x + 10},890`, THIN)).join('') +
  path('M210,820 Q150,830 120,880', 'x', THIN).replace('fill="#fff"', 'fill="none"') +
  rect(250, 520, 26, 150, 8, 'handle', THIN) + path('M232,670 L295,670 L285,730 Q263,750 242,730 Z', 'spade', THIN) +
  rect(620, 540, 22, 100, 8, 'handle', THIN) + path('M605,640 L660,640 L665,690 L600,690 Z', 'brush', THIN) + line('M610,690 l0,20 M625,690 l0,20 M640,690 l0,20 M655,690 l0,20', 4)});
