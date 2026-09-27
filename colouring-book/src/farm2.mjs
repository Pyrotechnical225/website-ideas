// Farm book, pages 11–20: more original farm animals and garden friends.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, sun, bird, grass, flower, face, THIN} from './kit.mjs';
import {rot, sideFace, fence, ground, grassRow, says, heart} from './kit2.mjs';
import {farmSky, chubby} from './farm1.mjs';

const scene = (...parts) => parts.join('');
const black = s => s.replace('fill="#fff"', 'fill="#000"');

export const cat = () => ({label: 'Farm Cat', scene: scene(farmSky(true), fence(110, 750, 885, 90),
  path('M520,840 Q640,840 620,720 Q610,680 580,690 Q600,760 520,800 Z', 'tail'),
  path('M330,885 Q300,700 425,680 Q550,700 520,885 Z', 'body'), ellipse(425, 800, 55, 70, 'belly', THIN),
  ellipse(385, 880, 38, 20, 'paw', THIN), ellipse(465, 880, 38, 20, 'paw', THIN),
  '<g transform="translate(0,60)">', path('M335,500 L345,400 L405,455 Z', 'ear'), path('M515,500 L505,400 L445,455 Z', 'ear'),
  ellipse(425, 540, 110, 95, 'head'), face(425, 525, 1.1, {smile: false}),
  path('M415,565 L435,565 L425,578 Z', 'nose', 4), line('M425,578 Q410,598 395,588 M425,578 Q440,598 455,588', 4),
  line('M380,570 L310,560 M380,582 L310,592 M470,570 L540,560 M470,582 L540,592', 3.5), '</g>',
  says('Meow!', 660, 340, 540, 440))});

export const dog = () => ({label: 'Farm Dog', scene: scene(farmSky(true), grassRow(885, [120, 740]), line('M70,885 L780,885'),
  line('M530,800 Q600,760 590,700', 16), line('M530,800 Q600,760 590,700', 6).replace('stroke="#000"', 'stroke="#fff"'),
  path('M330,885 Q300,700 425,690 Q550,700 520,885 Z', 'body'), ellipse(425, 810, 55, 65, 'belly', THIN),
  ellipse(385, 880, 40, 20, 'paw', THIN), ellipse(465, 880, 40, 20, 'paw', THIN),
  '<g transform="translate(0,45)">', rect(355, 650, 140, 28, 12, 'collar', THIN), circle(425, 690, 16, 'tag', 4),
  rot(ellipse(320, 540, 38, 80, 'ear'), 20, 320, 540), rot(ellipse(530, 540, 38, 80, 'ear'), -20, 530, 540),
  ellipse(425, 530, 100, 95, 'head'), ellipse(425, 580, 55, 40, 'muzzle', THIN), black(ellipse(425, 562, 20, 13, 'nose', 4)),
  face(425, 510, 1.05, {smile: false}), line('M425,575 L425,592 M405,592 Q425,608 445,592', 4), path('M415,600 Q425,630 435,600 Z', 'tongue', 4),
  path('M380,460 Q400,440 420,462 Q400,480 380,470 Z', 'spot', 4), '</g>',
  says('Woof!', 660, 340, 540, 450))});

export const rabbit = () => ({label: 'Rabbit', scene: scene(sun(160, 330, 40), flower(120, 885), flower(740, 885), line('M70,885 L780,885'),
  flower(640, 885),
  circle(545, 820, 30, 'tail', THIN),
  path('M320,885 Q290,720 425,700 Q560,720 530,885 Z', 'body'), ellipse(425, 810, 60, 65, 'belly', THIN),
  ellipse(380, 880, 45, 20, 'paw', THIN), ellipse(470, 880, 45, 20, 'paw', THIN),
  '<g transform="translate(0,20)">', ellipse(375, 420, 34, 110, 'ear'), ellipse(375, 425, 16, 80, 'earIn', 4), ellipse(475, 420, 34, 110, 'ear'), ellipse(475, 425, 16, 80, 'earIn', 4),
  ellipse(425, 590, 105, 95, 'head'), face(425, 575, 1.1), black(ellipse(425, 612, 11, 8, 'nose', 4)),
  rect(410, 630, 30, 22, 4, 'teeth', 3.5), line('M425,630 L425,652', 3), '</g>')});

export const turkey = () => ({label: 'Turkey', scale: .92, scene: scene(farmSky(true), grassRow(885, [120, 740]), line('M70,885 L780,885'),
  ...[-70, -45, -20, 0, 20, 45, 70].map(a => rot(ellipse(425, 520, 55, 150, 'feather'), a, 425, 690)),
  line('M390,800 L380,880 M460,800 L470,880', 8), line('M360,880 L400,880 M450,880 L490,880', 6),
  ellipse(425, 710, 125, 115, 'body'), ellipse(425, 740, 70, 60, 'belly', THIN),
  circle(425, 570, 62, 'head'), path('M415,590 L435,590 L425,612 Z', 'beak', 4), path('M435,595 Q455,640 435,655 Q420,630 430,600 Z', 'wattle', 4),
  face(425, 560, .8, {smile: false, cheeks: false}), says('Gobble!', 650, 340, 520, 450))});

export const goose = () => ({label: 'Goose', scene: scene(farmSky(false), grassRow(885, [120, 250, 700]), line('M70,885 L780,885'),
  line('M430,790 L420,875 M490,790 L500,875', 8), path('M395,880 L445,880 L420,862 Z M475,880 L525,880 L500,862 Z', 'foot', 4),
  path('M290,700 Q290,620 400,630 L500,630 Q560,560 560,480 Q560,420 610,420 Q660,420 660,470 L640,620 Q640,790 470,800 L360,800 Q290,790 290,700 Z', 'body'),
  path('M290,690 L240,650 L290,730 Z', 'tail', THIN), path('M360,680 Q430,650 500,700 Q460,750 380,740 Z', 'wing', THIN),
  path('M650,450 Q710,450 715,470 Q700,490 650,485 Z', 'bill', THIN), sideFace(620, 455, .8, 1, {smile: false}),
  says('Honk!', 240, 340, 330, 520))});

export const mouse = () => ({label: 'Mouse', scene: scene(farmSky(true), line('M70,885 L780,885'),
  path('M560,885 L720,885 L720,780 Z', 'cheese'), path('M560,885 L720,780 L720,760 L540,860 Z', 'cheeseTop', THIN), circle(660, 850, 14, 'hole', 4), circle(700, 815, 10, 'hole', 4),
  path('M300,860 Q200,860 180,800 Q170,760 200,750', 'x', THIN).replace('fill="#fff"', 'fill="none"'),
  ellipse(400, 800, 120, 85, 'body'), ellipse(410, 820, 60, 45, 'belly', THIN),
  circle(330, 560, 70, 'ear'), circle(330, 560, 42, 'earIn', 4), circle(470, 560, 70, 'ear'), circle(470, 560, 42, 'earIn', 4),
  ellipse(400, 640, 100, 85, 'head'), face(400, 630, 1.05), black(circle(400, 672, 12, 'nose', 4)),
  line('M360,670 L290,660 M360,682 L290,695 M440,670 L510,660 M440,682 L510,695', 3.5),
  says('Squeak!', 620, 350, 480, 540, 50))});

export const owl = () => ({label: 'Owl', scene: scene(`<g>${circle(640, 350, 50, 'moon', THIN)}</g>`, ...[[180, 340], [320, 420], [720, 470]].map(([x, y]) => path(`M${x},${y - 14} L${x + 4},${y - 4} L${x + 14},${y} L${x + 4},${y + 4} L${x},${y + 14} L${x - 4},${y + 4} L${x - 14},${y} L${x - 4},${y - 4} Z`, 'star', 4)),
  tube('M100,820 Q425,780 760,830', 40, 'branch'), ellipse(700, 790, 40, 18, 'leaves', THIN), ellipse(150, 790, 40, 18, 'leaves', THIN),
  path('M310,500 L320,420 L370,470 Z', 'tuft', THIN), path('M540,500 L530,420 L480,470 Z', 'tuft', THIN),
  ellipse(425, 640, 140, 170, 'body'), ellipse(425, 700, 85, 100, 'belly', THIN), line('M395,660 q15,12 30,0 M425,700 q15,12 30,0 M395,740 q15,12 30,0', 4),
  path('M290,600 Q250,700 300,760 Q330,700 320,620 Z', 'wing', THIN), path('M560,600 Q600,700 550,760 Q520,700 530,620 Z', 'wing', THIN),
  circle(375, 540, 50, 'eyeRing'), circle(475, 540, 50, 'eyeRing'), circle(375, 540, 22, 'eye', 4), dot(378, 543, 11), circle(475, 540, 22, 'eye', 4), dot(478, 543, 11),
  path('M410,575 L440,575 L425,605 Z', 'beak', 4), line('M390,800 l-8,20 M400,800 l0,22 M450,800 l0,22 M460,800 l8,20', 5),
  says('Hoot!', 200, 480, 300, 540, 52))});

export const frog = () => ({label: 'Frog', scene: scene(sun(160, 330, 40), ellipse(425, 860, 330, 70, 'pond', THIN),
  line('M110,850 L110,720 M140,860 L140,740 M720,850 L720,700', 5), ellipse(110, 710, 10, 26, 'reed', 4), ellipse(720, 690, 10, 26, 'reed', 4),
  path('M200,850 Q425,760 650,850 Q425,900 200,850 Z', 'lilypad', THIN), line('M425,830 L470,860', 4),
  ellipse(330, 800, 70, 34, 'leg'), ellipse(520, 800, 70, 34, 'leg'),
  ellipse(425, 740, 130, 95, 'body'), ellipse(425, 770, 75, 55, 'belly', THIN),
  circle(355, 610, 50, 'eyeBump'), circle(495, 610, 50, 'eyeBump'), circle(355, 610, 24, 'eye', 4), dot(358, 614, 12), circle(495, 610, 24, 'eye', 4), dot(498, 614, 12),
  path('M325,655 Q425,610 525,655 Q540,700 425,705 Q310,700 325,655 Z', 'head', THIN), line('M365,675 Q425,705 485,675', 5),
  circle(345, 690, 10, 'cheek', 3.5), circle(505, 690, 10, 'cheek', 3.5), says('Ribbit!', 640, 360, 520, 560))});

export const bee = () => ({label: 'Bumblebee', scene: scene(sun(160, 330, 40), line('M70,885 L780,885'),
  ...[[160, 885, 150], [300, 885, 110], [560, 885, 130], [690, 885, 160]].map(([x, y, h]) => { let p = ''; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; p += circle(x + Math.cos(a) * 26, y - h + Math.sin(a) * 26, 22, 'petal', 4); } return line(`M${x},${y} L${x},${y - h + 20}`, 5) + ellipse(x + 20, y - h / 2, 22, 10, 'leaves', 4) + p + circle(x, y - h, 18, 'flowerMid', 4); }),
  line('M200,430 Q260,500 320,460 Q380,420 400,520', 3).replace('stroke-width="3"', 'stroke-width="3" stroke-dasharray="10 12"'),
  rot(ellipse(440, 480, 50, 80, 'wing', THIN), -30, 440, 480), rot(ellipse(510, 480, 50, 80, 'wing', THIN), 30, 510, 480),
  ellipse(470, 580, 110, 80, 'body'),
  line('M430,510 Q420,580 430,650 M500,505 Q490,580 500,655', 22), path('M575,560 L610,580 L575,600 Z', 'sting', 4),
  circle(385, 560, 55, 'head'), face(385, 555, .8), line('M370,508 Q360,470 340,465 M395,506 Q400,470 420,462', 4), dot(340, 465, 7), dot(420, 462, 7),
  says('Buzz!', 640, 360, 540, 480))});

export const lamb = () => ({label: 'Lamb', scene: scene(sun(160, 330, 40), grassRow(885, [120, 700]), flower(760, 885), line('M70,885 L780,885'),
  [370, 480].map(lx => rect(lx - 16, 800, 32, 85, 12, 'leg') + rect(lx - 16, 860, 32, 25, 8, 'hoof', 4)).join(''),
  [[315, 740], [350, 680], [425, 665], [500, 680], [535, 740], [500, 795], [425, 810], [350, 795]].map(([x, y]) => circle(x, y, 45, 'wool')).join(''), ellipse(425, 740, 110, 75, 'wool'),
  rot(ellipse(345, 575, 40, 16, 'ear'), -25, 345, 575), rot(ellipse(505, 575, 40, 16, 'ear'), 25, 505, 575),
  ellipse(425, 595, 70, 80, 'face'), [[395, 520], [425, 508], [455, 520]].map(([x, y]) => circle(x, y, 25, 'wool', THIN)).join(''),
  face(425, 595, .9, {smile: false}), black(ellipse(425, 640, 10, 7, 'nose', 4)), line('M412,652 Q425,662 438,652', 4),
  path('M425,672 L385,650 L385,695 Z', 'bow', 4), path('M425,672 L465,650 L465,695 Z', 'bow', 4), circle(425, 672, 10, 'bow', 4), heart(640, 480, 1.1), heart(700, 420, .7))});
