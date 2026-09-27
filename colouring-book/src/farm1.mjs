// Farm book, pages 1–10: original cute farm animals, each saying its sound.
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, sun, bird, grass, flower, face, THIN} from './kit.mjs';
import {rot, sideFace, fence, ground, grassRow, says, heart} from './kit2.mjs';

export const farmSky = (sunLeft = false) => sunLeft ? sun(160, 330, 40) + cloud(390, 330, .75) : cloud(460, 330, .75) + sun(690, 330, 40);
const scene = (...parts) => parts.join('');

// Front-view chubby body + legs, used by several animals. (x = centre, gy = ground)
export const chubby = (x, gy, {bw = 120, bh = 105, part = 'body', hoof = true} = {}) =>
  [x - 60, x + 60].map(lx => rect(lx - 26, gy - 95, 52, 95, 18, part) + (hoof ? path(`M${lx - 26},${gy - 30} L${lx + 26},${gy - 30} L${lx + 26},${gy - 10} Q${lx + 26},${gy} ${lx + 12},${gy} L${lx - 12},${gy} Q${lx - 26},${gy} ${lx - 26},${gy - 10} Z`, 'hoof', THIN) : '')).join('') +
  ellipse(x, gy - 170, bw, bh, part) + ellipse(x, gy - 150, bw * 0.55, bh * 0.55, 'belly', THIN);

export const cow = () => ({label: 'Cow', scene: scene(sun(160, 330, 40), fence(110, 750, 885, 100),
  path('M540,720 Q600,700 620,760', 'x', THIN).replace('fill="#fff"', 'fill="none"'), circle(624, 770, 12, 'tail', 4),
  chubby(425, 885, {bw: 130}), path('M350,680 Q380,640 420,690 Q400,730 360,720 Z', 'spot', THIN), path('M460,760 Q500,730 520,770 Q500,800 470,790 Z', 'spot', THIN),
  rot(ellipse(300, 470, 50, 22, 'ear'), -20, 300, 470), rot(ellipse(550, 470, 50, 22, 'ear'), 20, 550, 470),
  path('M335,420 Q310,370 335,350 Q345,385 365,410 Z', 'horn', THIN), path('M515,420 Q540,370 515,350 Q505,385 485,410 Z', 'horn', THIN),
  ellipse(425, 500, 115, 100, 'head'), path('M360,440 Q380,420 410,440 Q395,470 365,465 Z', 'spot', THIN),
  ellipse(425, 560, 80, 48, 'muzzle'), ellipse(400, 555, 9, 13, 'x', 4).replace('fill="#fff"', 'fill="#000"'), ellipse(450, 555, 9, 13, 'x', 4).replace('fill="#fff"', 'fill="#000"'),
  face(425, 490, 1.1, {smile: false}), line('M405,585 Q425,598 445,585', 5),
  says('Moo!', 660, 330, 560, 420))});

export const pig = () => ({label: 'Pig', scene: scene(farmSky(true), path('M60,890 Q250,860 425,885 Q600,905 790,875 L790,905 L60,905 Z', 'mud', THIN),
  line('M555,760 q35,-10 30,20 q-5,20 -22,5 q-10,-15 12,-25', 5),
  chubby(425, 885, {bw: 135, bh: 110}),
  path('M320,420 L300,340 L380,390 Z', 'ear'), path('M530,420 L550,340 L470,390 Z', 'ear'),
  circle(425, 500, 110, 'head'), ellipse(425, 540, 50, 34, 'snout'), ellipse(410, 540, 7, 11, 'x', 4).replace('fill="#fff"', 'fill="#000"'), ellipse(440, 540, 7, 11, 'x', 4).replace('fill="#fff"', 'fill="#000"'),
  face(425, 480, 1.1, {smile: false}), line('M400,585 Q425,600 450,585', 5),
  says('Oink!', 660, 340, 560, 420))});

export const sheep = () => ({label: 'Sheep', scene: scene(farmSky(true), flower(110, 885), flower(760, 885),
  [365, 485].map(lx => rect(lx - 18, 790, 36, 95, 14, 'leg') + rect(lx - 18, 860, 36, 25, 8, 'hoof', 4)).join(''),
  [[300, 700], [340, 630], [425, 610], [510, 630], [550, 700], [510, 770], [425, 790], [340, 770]].map(([x, y]) => circle(x, y, 55, 'wool')).join(''), ellipse(425, 700, 130, 90, 'wool'),
  rot(ellipse(330, 490, 45, 18, 'ear'), -25, 330, 490), rot(ellipse(520, 490, 45, 18, 'ear'), 25, 520, 490),
  ellipse(425, 510, 80, 95, 'face'), [[385, 420], [425, 405], [465, 420]].map(([x, y]) => circle(x, y, 30, 'wool', THIN)).join(''),
  face(425, 510, 1, {smile: false}), ellipse(425, 565, 12, 8, 'x', 4).replace('fill="#fff"', 'fill="#000"'), line('M410,580 Q425,592 440,580', 5),
  says('Baa!', 660, 330, 540, 420))});

export const hen = () => ({label: 'Hen', scene: scene(farmSky(true), grassRow(885, [120, 250, 620, 740]), line('M70,885 L780,885'),
  path('M250,640 Q210,560 250,520 Q270,580 300,600 Z', 'tail'), path('M270,660 Q220,600 230,560 Q270,610 310,620 Z', 'tail'),
  line('M390,800 L380,885 M470,800 L480,885', 8), line('M360,885 L380,885 L400,885 M460,885 L480,885 L500,885', 6),
  path('M270,680 Q260,560 400,540 Q470,470 530,500 Q590,540 560,610 Q600,760 430,810 Q300,810 270,680 Z', 'body'),
  path('M330,650 Q380,620 450,660 Q420,740 350,720 Z', 'wing', THIN), line('M360,680 Q390,690 420,680', 4),
  path('M490,470 Q495,430 520,445 Q530,415 550,440 Q575,430 570,475 Z', 'comb', THIN),
  path('M580,520 L630,535 L580,550 Z', 'beak', THIN), path('M570,555 Q585,590 565,600 Q550,585 560,555 Z', 'wattle', 4),
  sideFace(540, 515, .9), says('Cluck!', 660, 340, 600, 440))});

export const chick = () => ({label: 'Chick', scene: scene(farmSky(true), grassRow(885, [120, 250, 600, 730]),
  path('M250,885 Q240,780 300,760 L340,790 L380,750 L420,790 L460,750 L500,790 L540,750 L580,790 Q620,780 610,885 Z', 'shell'),
  circle(425, 690, 150, 'body'), path('M290,700 Q250,660 270,630 Q300,680 320,690 Z', 'wing', THIN), path('M560,700 Q600,660 580,630 Q550,680 530,690 Z', 'wing', THIN),
  path('M410,530 Q400,490 425,500 Q440,470 450,510 Q470,500 455,535 Z', 'tuft', THIN),
  path('M400,660 L450,660 L425,695 Z', 'beak', THIN), face(425, 620, 1.1, {smile: false}),
  says('Cheep!', 650, 360, 560, 480))});

export const rooster = () => ({label: 'Rooster', scene: scene(sun(160, 330, 40) + cloud(390, 330, .75),
  rect(120, 700, 200, 185, 0, 'barn', THIN), path('M100,710 L220,610 L340,710 Z', 'roof', THIN), line('M160,760 L280,885 M280,760 L160,885', 5),
  [[330, 560, -30], [320, 600, -10], [320, 640, 15]].map(([x, y, a]) => rot(path(`M${x},${y} Q${x - 120},${y - 60} ${x - 110},${y - 150} Q${x - 50},${y - 90} ${x + 20},${y}`, 'tail', THIN), a, x, y)).join(''),
  line('M430,780 L420,860 M500,780 L510,860', 8), line('M400,860 L440,860 M490,860 L530,860', 6),
  path('M320,660 Q310,560 440,540 Q500,470 560,500 Q620,540 590,610 Q630,740 460,790 Q340,790 320,660 Z', 'body'),
  path('M370,640 Q420,610 490,650 Q460,730 390,710 Z', 'wing', THIN),
  path('M510,480 Q505,420 540,440 Q545,400 570,430 Q600,410 598,470 Z', 'comb', THIN),
  path('M605,520 L660,535 L605,552 Z', 'beak', THIN), path('M595,555 Q612,600 590,610 Q575,590 585,555 Z', 'wattle', 4),
  sideFace(565, 515, .9), line('M70,885 L780,885'),
  says('Doodle-doo!', 590, 320, 590, 420, 44))});

export const duck = () => ({label: 'Duck', scene: scene(farmSky(false), ellipse(425, 820, 330, 70, 'pond', THIN),
  path('M260,740 Q250,640 380,640 L470,640 Q500,560 560,560 Q620,560 620,610 Q620,660 560,680 Q600,760 470,790 L330,790 Q260,780 260,740 Z', 'body'),
  path('M250,700 L200,660 L250,740 Z', 'tail', THIN), path('M330,690 Q390,660 450,700 Q420,750 350,740 Z', 'wing', THIN),
  path('M612,600 Q680,590 690,615 Q670,640 612,630 Z', 'bill', THIN), sideFace(575, 595, .9, 1, {smile: false}),
  line('M120,820 q20,-10 40,0 M680,850 q20,-10 40,0', 4), says('Quack!', 240, 340, 330, 480))});

export const horse = () => ({label: 'Horse', scene: scene(farmSky(false), fence(110, 750, 885, 100),
  [330, 400, 470, 540].map((x, i) => rect(x - 24, 700, 48, 185, 16, i % 2 ? 'legFar' : 'body') + rect(x - 24, 855, 48, 30, 8, 'hoof', 4)).join(''),
  path('M280,640 Q230,660 210,760 Q240,700 290,690 Z', 'tail'),
  ellipse(430, 680, 175, 90, 'body'),
  tube('M540,640 Q570,560 590,500', 90, 'body'), path('M555,470 Q540,420 575,410 Q620,405 640,450 L690,530 Q700,580 650,585 Q610,585 590,540 Z', 'body'),
  path('M560,430 L565,385 L590,420 Z', 'ear', THIN), path('M530,470 Q490,520 520,600 Q560,560 560,500 Z', 'mane', THIN),
  sideFace(600, 470, .85), ellipse(665, 560, 9, 6, 'x', 4).replace('fill="#fff"', 'fill="#000"'),
  says('Neigh!', 240, 340, 330, 480))});

export const goat = () => ({label: 'Goat', scene: scene(farmSky(true), path('M60,885 Q180,760 330,885 Z', 'hill', THIN),
  chubby(425, 885, {bw: 120, bh: 100}),
  path('M360,420 Q330,340 290,330 Q320,380 340,430 Z', 'horn', THIN), path('M490,420 Q520,340 560,330 Q530,380 510,430 Z', 'horn', THIN),
  rot(ellipse(310, 480, 48, 18, 'ear'), 25, 310, 480), rot(ellipse(540, 480, 48, 18, 'ear'), -25, 540, 480),
  path('M340,450 Q340,400 425,400 Q510,400 510,450 L500,560 Q480,610 425,612 Q370,610 350,560 Z', 'head'),
  path('M400,605 Q425,690 450,605 Z', 'beard', THIN), face(425, 490, 1.05, {smile: false}), line('M405,570 Q425,582 445,570', 5), dot(415, 545, 5), dot(435, 545, 5),
  says('Maa!', 690, 340, 580, 430))});

export const donkey = () => ({label: 'Donkey', scene: scene(sun(160, 330, 40), grassRow(885, [110, 740]),
  chubby(425, 885, {bw: 125, bh: 100}),
  path('M345,420 Q300,300 330,250 Q370,330 385,410 Z', 'ear'), path('M505,420 Q550,300 520,250 Q480,330 465,410 Z', 'ear'),
  path('M355,440 Q355,400 425,400 Q495,400 495,440 L505,560 Q495,620 425,620 Q355,620 345,560 Z', 'head'),
  ellipse(425, 580, 70, 42, 'muzzle'), dot(405, 575, 6), dot(445, 575, 6), path('M395,400 Q425,360 455,400 Z', 'mane', THIN),
  face(425, 480, 1.05, {smile: false}), line('M405,600 Q425,610 445,600', 5),
  says('Hee-haw!', 640, 330, 530, 420, 50))});
