// Christmas book, pages 11–20 — original designs.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, star, face, moon, THIN} from './kit.mjs';
import {rot, sideFace, snowflake, snowGround, heart} from './kit2.mjs';
import {flakes} from './xmas1.mjs';

const scene = (...parts) => parts.join('');
const black = s => s.replace('fill="#fff"', 'fill="#000"');
const noFill = s => s.replace('fill="#fff"', 'fill="none"');

export const bigStar = () => ({label: 'Christmas Star', scene: scene(flakes([[150, 340], [720, 360], [140, 800], [730, 820]]),
  star(425, 620, 250), star(425, 620, 120), face(425, 610, 1.3), [[200, 420], [650, 430], [230, 850], [640, 860]].map(([x, y]) => star(x, y, 28)).join(''))});

export const snowflakes = () => ({label: 'Snowflakes', scene: scene(
  ...[[425, 600, 170], [200, 420, 70], [660, 430, 80], [190, 820, 80], [660, 830, 70]].map(([x, y, r]) => {
    let arms = '';
    for (let i = 0; i < 6; i++) arms += rot(rect(x - r * 0.12, y - r, r * 0.24, r, r * 0.1, 'flake', THIN) + path(`M${x},${y - r * 0.55} L${x - r * 0.3},${y - r * 0.85} L${x - r * 0.2},${y - r * 0.95} L${x},${y - r * 0.72} L${x + r * 0.2},${y - r * 0.95} L${x + r * 0.3},${y - r * 0.85} Z`, 'flake', 4), i * 60, x, y);
    return arms + circle(x, y, r * 0.3, 'flakeMid', THIN);
  }), face(425, 595, 1))});

export const elf = () => ({label: 'Christmas Elf', scene: scene(flakes(), snowGround(),
  path('M345,885 L360,790 L410,790 L405,885 Q345,895 320,870 Q300,850 345,885 Z', 'boots'), path('M505,885 L490,790 L440,790 L445,885 Q505,895 530,870 Q550,850 505,885 Z', 'boots'),
  path('M330,790 L350,610 L500,610 L520,790 Q425,820 330,790 Z', 'tunic'), rect(340, 700, 170, 30, 6, 'belt', THIN), rect(405, 695, 40, 40, 6, 'buckle', THIN),
  path('M330,790 L360,760 L390,795 L425,760 L460,795 L490,760 L520,790', 'x', THIN).replace('fill="#fff"', 'fill="none"'),
  tube('M355,625 Q300,670 300,730', 50, 'tunic'), tube('M495,625 Q560,650 590,600', 50, 'tunic'), circle(300, 745, 24, 'skin', THIN), circle(600, 585, 24, 'skin', THIN),
  rect(590, 470, 90, 90, 8, 'present', THIN), line('M635,470 L635,560 M590,515 L680,515', 4),
  path('M345,480 L300,440 L340,520 Z', 'ear', THIN), path('M505,480 L550,440 L510,520 Z', 'ear', THIN),
  circle(425, 510, 80, 'skin'), face(425, 510, 1),
  path('M340,470 Q360,330 480,300 Q470,380 510,470 Z', 'hat'), circle(485, 295, 24, 'bobble', THIN), rect(335, 455, 180, 32, 16, 'band', THIN),
  path('M360,600 L425,640 L490,600 L470,580 L425,610 L380,580 Z', 'collar', THIN))});

export const penguin = () => ({label: 'Penguin', scene: scene(flakes(), snowGround(),
  ellipse(380, 880, 50, 18, 'foot', THIN), ellipse(470, 880, 50, 18, 'foot', THIN),
  ellipse(425, 680, 150, 200, 'body'), ellipse(425, 710, 100, 160, 'belly', THIN),
  rot(ellipse(275, 700, 35, 100, 'flipper'), 25, 275, 700), rot(ellipse(575, 700, 35, 100, 'flipper'), -25, 575, 700),
  path('M330,540 Q425,470 520,540 Q500,600 425,580 Q350,600 330,540 Z', 'face', THIN), face(425, 540, 1), path('M405,570 L445,570 L425,595 Z', 'beak', 4),
  path('M300,610 Q425,650 550,610 L550,640 Q425,680 300,640 Z', 'scarf', THIN), rect(500, 630, 40, 90, 10, 'scarf', THIN),
  path('M340,500 Q425,420 510,500 Z', 'hat', THIN), circle(425, 440, 20, 'bobble', THIN))});

export const polarBear = () => ({label: 'Polar Bear', scene: scene(flakes(), snowGround(),
  path('M160,885 L200,780 L260,885 Z', 'ice', THIN), path('M620,885 L680,760 L740,885 Z', 'ice', THIN),
  ellipse(360, 870, 55, 22, 'paw', THIN), ellipse(490, 870, 55, 22, 'paw', THIN),
  path('M300,870 Q260,650 425,630 Q590,650 550,870 Z', 'body'), ellipse(425, 770, 70, 80, 'belly', THIN),
  circle(335, 470, 38, 'ear'), circle(335, 470, 18, 'earIn', 4), circle(515, 470, 38, 'ear'), circle(515, 470, 18, 'earIn', 4),
  ellipse(425, 550, 115, 100, 'head'), ellipse(425, 600, 50, 36, 'muzzle', THIN), black(ellipse(425, 585, 18, 12, 'nose', 4)), line('M425,597 L425,612 M408,615 Q425,628 442,615', 4),
  face(425, 530, 1.05, {smile: false}), rect(320, 630, 210, 30, 14, 'scarf', THIN))});

export const sleigh = () => ({label: 'Sleigh', scene: scene(moon(650, 350, 46), star(170, 340, 18), star(320, 420, 12), star(740, 480, 12), snowGround(),
  path('M130,850 L700,850 Q760,850 760,800', 'x', 10).replace('fill="#fff"', 'fill="none"'), line('M230,790 L230,850 M560,790 L560,850', 8),
  path('M150,600 Q150,560 190,560 L260,560 Q300,560 300,620 L300,700 L620,700 Q640,620 700,600 Q720,640 700,720 Q680,800 600,800 L200,800 Q150,800 150,740 Z', 'sleigh'),
  path('M190,600 L260,600 L260,740 L190,740 Z', 'seat', THIN),
  rect(330, 560, 110, 140, 8, 'present', THIN), line('M385,560 L385,700 M330,630 L440,630', 4), rect(450, 610, 90, 90, 8, 'present2', THIN), line('M495,610 L495,700', 4), path('M380,560 Q350,520 360,510 Q385,530 385,560 Q400,520 420,515 Q420,540 390,560 Z', 'bow', 4),
  star(620, 760, 20))});

export const wreath = () => ({label: 'Wreath', scene: scene(flakes([[150, 340], [720, 360], [140, 820], [730, 830]]),
  circle(425, 620, 230, 'wreath'), circle(425, 620, 120, 'x', THIN),
  ...Array.from({length: 14}, (_, i) => { const a = i / 14 * Math.PI * 2, x = 425 + Math.cos(a) * 175, y = 620 + Math.sin(a) * 175; return rot(ellipse(x, y, 45, 20, 'leaf', 4), a * 180 / Math.PI + 60, x, y); }),
  [[300, 520], [560, 540], [340, 760], [520, 770], [425, 420]].map(([x, y]) => circle(x - 12, y, 13, 'berry', 4) + circle(x + 12, y + 4, 13, 'berry', 4)).join(''),
  path('M425,830 Q340,760 330,820 Q350,860 425,830 Q510,760 520,820 Q500,860 425,830 Z', 'bow', THIN), path('M410,835 L370,920 L400,910 L420,840 M440,835 L480,920 L450,910 L430,840', 'ribbon', 4), circle(425, 832, 20, 'bow', THIN))});

export const candles = () => ({label: 'Candles', scene: scene(flakes([[150, 340], [720, 360]]), line('M70,885 L780,885'),
  ...[[260, 620, 90], [425, 520, 110], [590, 660, 80]].map(([x, top, w]) => rect(x - w / 2, top, w, 885 - top - 30, 10, 'candle') + path(`M${x - w / 2},${top + 20} Q${x - w / 2 + 15},${top + 70} ${x - w / 2 + 25},${top + 20}`, 'drip', 4) + line(`M${x},${top} L${x},${top - 25}`, 5) + path(`M${x},${top - 25} Q${x - 30},${top - 60} ${x},${top - 110} Q${x + 30},${top - 60} ${x},${top - 25} Z`, 'flame', THIN) + path(`M${x},${top - 35} Q${x - 12},${top - 55} ${x},${top - 80} Q${x + 12},${top - 55} ${x},${top - 35} Z`, 'flame2', 4)),
  rect(150, 855, 550, 30, 12, 'plate', THIN), [[330, 840], [500, 845]].map(([x, y]) => circle(x, y, 14, 'berry', 4)).join(''), ellipse(180, 840, 40, 16, 'leaf', 4), ellipse(670, 840, 40, 16, 'leaf', 4))});

export const pudding = () => ({label: 'Christmas Pudding', scene: scene(flakes([[150, 340], [720, 360], [160, 600], [720, 620]]), line('M70,885 L780,885'),
  ellipse(425, 840, 260, 45, 'plate'), path('M210,800 Q200,540 425,520 Q650,540 640,800 Q425,850 210,800 Z', 'pudding'),
  path('M230,610 Q280,560 330,620 Q370,570 425,630 Q480,570 520,620 Q570,560 620,610 Q610,530 425,520 Q240,530 230,610 Z', 'custard', THIN),
  [[280, 700], [560, 690], [300, 770], [550, 770], [360, 800], [490, 800]].map(([x, y]) => black(circle(x, y, 7, 'raisin', 3))).join(''),
  ellipse(385, 505, 42, 18, 'leaf', 4), ellipse(465, 505, 42, 18, 'leaf', 4), circle(412, 500, 14, 'berry', 4), circle(438, 494, 14, 'berry', 4), face(425, 700, 1.1))});

export const hotCocoa = () => ({label: 'Hot Cocoa', scene: scene(flakes([[150, 340], [720, 360], [160, 780], [720, 800]]), line('M70,885 L780,885'),
  path('M360,520 Q330,470 360,440 Q390,410 360,380 M440,520 Q410,470 440,440 Q470,410 440,380 M520,520 Q490,470 520,440 Q550,410 520,380', 'x', 5).replace('fill="#fff"', 'fill="none"'),
  ellipse(425, 870, 240, 26, 'saucer', THIN),
  path('M600,610 Q700,620 690,700 Q680,770 590,760', 'x', 28).replace('fill="#fff"', 'fill="none"'), path('M600,610 Q700,620 690,700 Q680,770 590,760', 'x', 14).replace('fill="#fff"', 'fill="none"').replace('stroke="#000"', 'stroke="#fff"'),
  path('M250,560 L600,560 L580,820 Q575,855 540,855 L310,855 Q275,855 270,820 Z', 'mug'), ellipse(425, 560, 175, 34, 'cocoa'),
  circle(370, 550, 26, 'marshmallow', 4), circle(440, 545, 24, 'marshmallow2', 4), circle(495, 556, 22, 'marshmallow', 4),
  face(425, 690, 1.2), heart(330, 780, .6), heart(520, 780, .6))});
