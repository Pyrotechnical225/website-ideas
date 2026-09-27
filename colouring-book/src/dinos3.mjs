// Dinosaur book, pages 21–30 — fun scenes with original dinosaurs.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, sun, bird, grass, star, face, THIN} from './kit.mjs';
import {rot, sideFace, palm, fern, rock, ground, grassRow, says, zzz, heart} from './kit2.mjs';
import {quad, biped, sky} from './dinos1.mjs';
import {small} from './dinos2.mjs';
import {moon, waves} from './kit.mjs';

const dino = (o = {}) => quad({cx: 430, bw: 320, bh: 175, neckDx: 60, neckDy: 120, headR: 42, tail: 140, spots: true, ...o});

export const footprints = () => ({label: 'Dino Footprints', scene: sky() +
  [[150, 930], [260, 900], [370, 935]].map(([x, y]) => ellipse(x, y, 34, 22, 'print', THIN) + [-24, 0, 24].map(d => ellipse(x + d, y - 30, 9, 13, 'print', 4)).join('')).join('') +
  small(dino(), .72, 120) + ground(885).replace('M70,885', 'M70,885')});

export const dinoFamily = () => ({label: 'Dino Family', scene: sky() +
  small(dino({spots: false}), .95, -70) + small(dino(), .5, 190) + heart(640, 520, 1.1) + ground() + rock(745, 885, 60, 35)});

export const birthday = () => ({label: 'Dino Birthday', scene: sky('cloud') +
  [[160, 420], [700, 460]].map(([x, y]) => ellipse(x, y, 40, 50, 'balloon') + line(`M${x},${y + 50} q-12,40 6,80`, 4)).join('') +
  small(dino(), .8, -80) + rect(560, 760, 170, 125, 14, 'cake') + rect(575, 700, 140, 60, 12, 'cake2', THIN) + line('M560,800 Q600,825 645,800 Q690,825 730,800', 5) +
  [600, 645, 690].map(x => rect(x - 8, 650, 16, 50, 4, 'candle', 4) + path(`M${x},648 q-12,-18 0,-34 q12,16 0,34 Z`, 'flame', 4)).join('') + ground()});

export const sleeping = () => ({label: 'Sleepy Dino', scene: moon(650, 360, 50) + star(180, 330) + star(330, 420, 12) + star(520, 310, 14) + star(740, 520, 12) + star(150, 540, 10) +
  path('M150,870 Q140,760 300,740 Q470,720 560,790 Q600,830 590,870 Z', 'body') + path('M160,850 Q90,850 80,810 Q120,820 170,815 Z', 'body', THIN) +
  ellipse(620, 830, 75, 55, 'body') + line('M600,818 q14,10 28,0 M600,850 q18,12 36,0', 5) + circle(575, 845, 9, 'cheek', 3.5) +
  [260, 350, 440].map(x => circle(x, 790, 15, 'spot', 4)).join('') + zzz(640, 720) + path('M90,870 L770,870 L760,905 L100,905 Z', 'blanket', THIN)});

export const swimming = () => ({label: 'Swimming Dino', scene: sun(660, 320, 42) + cloud(200, 330, 1) + bird(430, 330) +
  dino({cx: 400, legH: 60}) + `<rect x="70" y="770" width="710" height="200" fill="#fff"/>` +
  [770, 830, 890, 950].map((y, i) => line(`M${80 + (i % 2) * 30},${y} ${Array.from({length: 10}, () => 'q17,-14 34,0 q17,14 34,0').join(' ')}`, THIN)).join('') +
  circle(640, 745, 12, 'bubble', 4) + circle(670, 720, 8, 'bubble', 4) + circle(200, 740, 10, 'bubble', 4)});

export const lunchTime = () => ({label: 'Lunch Time', scene: sun(170, 330, 40) + cloud(430, 320, .8) +
  tube('M660,885 Q670,700 655,470', 44, 'trunk') + [[610, 470, 60], [700, 450, 60], [660, 390, 62], [590, 405, 48], [720, 530, 42]].map(([x, y, r]) => circle(x, y, r, 'leaves')).join('') +
  quad({cx: 370, bw: 270, bh: 170, legH: 140, lw: 58, neckDx: 75, neckDy: 227, neckW: 60, headR: 38, tail: 120, spots: true,
    front: gg => ellipse(gg.hx + 72, gg.hy + 22, 24, 10, 'leaves', 4)}) + ground() + grassRow(885, [110, 520])});

export const rainyDay = () => ({label: 'Rainy Day', scene: cloud(200, 330, 1.2) +
  [[150, 430], [260, 480], [620, 450], [720, 520], [180, 600], [700, 640], [120, 760]].map(([x, y]) => path(`M${x},${y} q-12,20 0,28 q12,-8 0,-28 Z`, 'drop', 4)).join('') +
  biped({cx: 390, s: .75, head: 'raptor', front: gg => line(`M${gg.cx + 110 * .75},${gg.gy - 300 * .75} L${gg.cx + 150},${gg.gy - 500}`, 7) + path(`M${gg.cx - 20},${gg.gy - 480} Q${gg.cx + 150},${gg.gy - 660} ${gg.cx + 320},${gg.gy - 480} Q${gg.cx + 280},${gg.gy - 505} ${gg.cx + 235},${gg.gy - 480} Q${gg.cx + 195},${gg.gy - 505} ${gg.cx + 150},${gg.gy - 480} Q${gg.cx + 105},${gg.gy - 505} ${gg.cx + 65},${gg.gy - 480} Q${gg.cx + 25},${gg.gy - 505} ${gg.cx - 20},${gg.gy - 480} Z`, 'umbrella')}) +
  ellipse(560, 890, 120, 22, 'puddle', THIN) + ground()});

export const football = () => ({label: 'Dino Football', scene: sky() + rect(620, 620, 150, 265, 0, 'goal', THIN).replace('fill="#fff"', 'fill="none"') + line('M620,660 L770,660 M620,720 L770,720 M620,780 L770,780 M620,840 L770,840 M660,620 L660,885 M700,620 L700,885 M740,620 L740,885', 3) +
  small(dino({spots: true}), .8, -110) + circle(560, 845, 40, 'ball') + path('M560,825 l17,12 l-7,20 l-20,0 l-7,-20 Z', 'patch', 4) + ground()});

export const roar = () => ({label: 'Roar!', scene: cloud(200, 330, .9) + fern(745, 885, 110, -1) +
  biped({cx: 380, s: .9, head: 'rex'}) + says('ROAR!', 590, 400, 540, 470, 60) + ground() + grassRow(885, [120])});

export const iceCream = () => ({label: 'Ice Cream Treat', scene: sky() + fern(745, 885, 110, -1) +
  biped({cx: 400, s: .85, head: 'raptor', front: gg => path(`M${gg.cx + 150},${gg.gy - 300} L${gg.cx + 210},${gg.gy - 300} L${gg.cx + 180},${gg.gy - 200} Z`, 'cone', THIN) + line(`M${gg.cx + 160},${gg.gy - 280} L${gg.cx + 200},${gg.gy - 260} M${gg.cx + 200},${gg.gy - 280} L${gg.cx + 165},${gg.gy - 245}`, 3) + circle(gg.cx + 180, gg.gy - 325, 35, 'scoop', THIN) + circle(gg.cx + 180, gg.gy - 375, 28, 'scoop2', THIN) + dot(gg.cx + 180, gg.gy - 408, 7)}) + ground() + grassRow(885, [120])});
