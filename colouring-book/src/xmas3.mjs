// Christmas book, pages 21–30 — original designs (generic toys, no known characters).
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, star, face, wheel, moon, THIN} from './kit.mjs';
import {rot, sideFace, snowflake, snowGround, heart} from './kit2.mjs';
import {flakes} from './xmas1.mjs';

const scene = (...parts) => parts.join('');
const black = s => s.replace('fill="#fff"', 'fill="#000"');
const noFill = s => s.replace('fill="#fff"', 'fill="none"');

const mitten = (x, y, flip = 1) => path(`M${x - 80 * flip},${y + 140} L${x - 90 * flip},${y} Q${x - 90 * flip},${y - 110} ${x},${y - 110} Q${x + 90 * flip},${y - 110} ${x + 90 * flip},${y} L${x + 80 * flip},${y + 140} Z`, 'mitten') +
  path(`M${x - 88 * flip},${y - 10} Q${x - 150 * flip},${y - 30} ${x - 140 * flip},${y + 30} Q${x - 130 * flip},${y + 60} ${x - 86 * flip},${y + 50} Z`, 'mitten', THIN) +
  rect(Math.min(x - 95 * flip, x + 95 * flip), y + 130, 190, 55, 14, 'cuff', THIN) + star(x, y - 20, 30) + heart(x, y + 70, .6);

export const mittens = () => ({label: 'Mittens', shift: 100, scale: 1.14, scene: scene(flakes([[150, 340], [720, 360], [425, 330]]),
  noFill(path('M290,470 Q425,380 560,470', 'x', 6)), mitten(290, 560), mitten(560, 560, -1))});

export const gingerbreadHouse = () => ({label: 'Gingerbread House', scene: scene(flakes([[150, 340], [720, 360]]), snowGround(),
  path('M200,880 L200,580 L650,580 L650,880 Z', 'house'),
  path('M160,600 L425,380 L690,600 Z', 'roof'), noFill(path('M180,590 Q220,620 260,590 Q300,620 340,590 Q380,620 425,590 Q470,620 510,590 Q550,620 590,590 Q630,620 670,590', 'icing', THIN)),
  rect(560, 400, 60, 110, 6, 'chimney', THIN), rect(550, 390, 80, 25, 6, 'icing', THIN),
  path('M370,880 L370,760 Q370,700 425,700 Q480,700 480,760 L480,880 Z', 'door'), dot(460, 800, 7),
  rect(240, 660, 90, 80, 8, 'window', THIN), line('M285,660 L285,740 M240,700 L330,700', 4), rect(520, 660, 90, 80, 8, 'window', THIN), line('M565,660 L565,740 M520,700 L610,700', 4),
  [[260, 800], [320, 820], [560, 800], [620, 830], [300, 540], [425, 480], [550, 540]].map(([x, y]) => circle(x, y, 16, 'sweet', 4)).join(''),
  rect(230, 845, 30, 35, 4, 'cane', 4), rect(590, 845, 30, 35, 4, 'cane', 4))});

export const angel = () => ({label: 'Angel', scene: scene(flakes(), star(150, 480, 22), star(700, 500, 18),
  path('M330,560 Q180,470 190,640 Q230,720 340,660 Z', 'wing'), path('M520,560 Q670,470 660,640 Q620,720 510,660 Z', 'wing'),
  noFill(path('M230,590 Q260,620 300,610 M620,590 Q590,620 550,610', 'x', 4)),
  path('M425,560 L560,860 Q425,890 290,860 Z', 'dress'), noFill(path('M300,840 Q425,870 550,840', 'x', THIN)), star(425, 740, 30),
  tube('M390,600 Q350,650 380,690', 40, 'dress'), tube('M460,600 Q500,650 470,690', 40, 'dress'), circle(425, 690, 22, 'skin', THIN),
  circle(425, 500, 70, 'skin'), face(425, 505, .95),
  path('M355,500 Q350,420 425,420 Q500,420 495,500 Q480,460 425,460 Q370,460 355,500 Z', 'hair', THIN),
  noFill(`<ellipse cx="425" cy="395" rx="75" ry="18" fill="#fff" stroke="#000" stroke-width="7"/>`))});

export const robin = () => ({label: 'Robin', scene: scene(flakes([[150, 340], [720, 360], [140, 600]]),
  tube('M90,760 Q425,720 770,780', 40, 'branch'), line('M620,760 L690,690', 16), ellipse(700, 680, 34, 16, 'leaf', 4), circle(680, 700, 12, 'berry', 4), circle(700, 710, 12, 'berry', 4),
  path('M260,680 Q180,690 150,620 Q210,640 270,630 Z', 'tail'),
  line('M390,745 L385,775 M450,745 L455,775', 8),
  ellipse(420, 640, 150, 120, 'body'), path('M430,570 Q540,600 530,700 Q470,740 420,700 Q390,640 430,570 Z', 'breast', THIN),
  path('M330,620 Q380,590 430,640 Q390,700 330,680 Z', 'wing', THIN),
  path('M545,560 L600,575 L545,590 Z', 'beak', THIN), sideFace(510, 560, .95), path('M330,540 Q360,515 400,530 Q390,560 350,560 Z', 'snow', 4))});

export const toyTrain = () => ({label: 'Toy Train', scene: scene(flakes([[150, 340], [720, 360], [425, 330]]), line('M70,860 L780,860'),
  rect(90, 640, 180, 150, 16, 'carriage'), rect(115, 560, 130, 80, 8, 'present', THIN), line('M180,560 L180,640 M115,600 L245,600', 4), wheel(135, 810, 32), wheel(225, 810, 32),
  line('M270,760 L300,760', 9),
  rect(300, 620, 150, 170, 16, 'carriage2'), [[330, 600], [370, 590], [410, 600]].map(([x, y]) => circle(x, y, 22, 'ball', THIN)).join(''), wheel(335, 810, 32), wheel(415, 810, 32),
  line('M450,760 L480,760', 9),
  rect(480, 560, 110, 230, 12, 'cab'), rect(500, 590, 70, 60, 8, 'window', THIN), rect(470, 540, 130, 26, 10, 'roof', THIN),
  rect(590, 650, 150, 140, 40, 'boiler'), rect(680, 580, 34, 72, 8, 'chimney', THIN), circle(700, 540, 20, 'smoke', 4), circle(725, 505, 16, 'smoke', 4),
  face(665, 715, .8), wheel(530, 810, 40), wheel(640, 810, 40), wheel(720, 815, 30))});

export const teddyBear = () => ({label: 'Teddy Bear', scene: scene(flakes(), line('M70,885 L780,885'),
  circle(300, 830, 60, 'paw'), circle(300, 830, 30, 'pad', 4), circle(550, 830, 60, 'paw'), circle(550, 830, 30, 'pad', 4),
  ellipse(425, 720, 150, 140, 'body'), ellipse(425, 740, 90, 90, 'belly', THIN),
  circle(285, 660, 50, 'paw'), circle(565, 660, 50, 'paw'),
  circle(320, 440, 50, 'ear'), circle(320, 440, 26, 'earIn', 4), circle(530, 440, 50, 'ear'), circle(530, 440, 26, 'earIn', 4),
  circle(425, 520, 115, 'head'), ellipse(425, 570, 55, 40, 'muzzle', THIN), black(ellipse(425, 552, 18, 12, 'nose', 4)), line('M425,564 L425,580 M408,585 Q425,598 442,585', 4),
  face(425, 500, 1.05, {smile: false}),
  path('M425,625 L370,600 L370,655 Z', 'bow', 4), path('M425,625 L480,600 L480,655 Z', 'bow', 4), circle(425, 627, 12, 'bow', 4))});

export const toySoldier = () => ({label: 'Toy Soldier', scene: scene(flakes(), line('M70,885 L780,885'),
  rect(290, 855, 270, 30, 8, 'stand', THIN),
  rect(370, 700, 50, 155, 10, 'trousers'), rect(430, 700, 50, 155, 10, 'trousers'), line('M395,700 L395,850 M455,700 L455,850', 4),
  rect(350, 530, 150, 180, 16, 'jacket'), line('M350,610 L500,610', THIN), [560, 600, 650].map(y => circle(425, y, 8, 'button', 4)).join(''),
  rect(305, 540, 45, 150, 18, 'jacket'), rect(500, 540, 45, 150, 18, 'jacket'), circle(327, 700, 22, 'skin', THIN), circle(523, 700, 22, 'skin', THIN),
  rect(540, 520, 14, 190, 6, 'stick', THIN), rect(330, 520, 190, 24, 10, 'epaulette', THIN),
  circle(425, 460, 62, 'skin'), face(425, 465, .9), circle(390, 490, 12, 'cheek', 3.5),
  rect(365, 300, 120, 130, 30, 'hat'), rect(355, 410, 140, 26, 8, 'brim', THIN), circle(425, 300, 16, 'plume', 4), line('M365,440 Q425,480 485,440', 4))});

export const snowGlobe = () => ({label: 'Snow Globe', scene: scene(line('M70,885 L780,885'),
  path('M230,885 L270,760 L580,760 L620,885 Z', 'base'), rect(300, 800, 250, 45, 10, 'plaque', THIN), heart(425, 822, .5),
  circle(425, 560, 230, 'glass'),
  path('M300,700 Q425,660 550,700 L560,750 L290,750 Z', 'snow', THIN),
  path('M380,700 L380,600 L425,560 L470,600 L470,700 Z', 'house', THIN), path('M370,605 L425,545 L480,605', 'x', THIN).replace('fill="#fff"', 'fill="none"'), rect(410, 650, 30, 50, 4, 'door', 4),
  path('M500,700 L540,620 L580,700 Z', 'tree', THIN), path('M270,700 L300,640 L330,700 Z', 'tree', THIN),
  [[330, 420], [420, 380], [520, 430], [300, 530], [560, 540], [470, 480], [360, 480]].map(([x, y], i) => snowflake(x, y, 14 + (i % 2) * 5)).join(''),
  ellipse(320, 430, 20, 50, 'shine', 4))});

export const holly = () => ({label: 'Holly', shift: 80, scale: 1.12, scene: scene(flakes([[150, 340], [720, 360], [150, 820], [720, 830]]),
  ...[[300, 600, -30], [550, 600, 30], [425, 730, 90]].map(([x, y, a]) => rot(path(`M${x - 150},${y} Q${x - 120},${y - 50} ${x - 90},${y - 30} Q${x - 75},${y - 75} ${x - 40},${y - 55} Q${x - 10},${y - 95} ${x + 20},${y - 60} Q${x + 60},${y - 90} ${x + 80},${y - 45} Q${x + 125},${y - 60} ${x + 140},${y} Q${x + 125},${y + 60} ${x + 80},${y + 45} Q${x + 60},${y + 90} ${x + 20},${y + 60} Q${x - 10},${y + 95} ${x - 40},${y + 55} Q${x - 75},${y + 75} ${x - 90},${y + 30} Q${x - 120},${y + 50} ${x - 150},${y} Z`, 'leaf') + line(`M${x - 140},${y} L${x + 130},${y}`, 4), a, x, y)),
  circle(390, 590, 40, 'berry'), circle(465, 585, 40, 'berry'), circle(428, 530, 40, 'berry'), [[378, 575], [453, 570], [416, 515]].map(([x, y]) => ellipse(x, y, 8, 12, 'shine', 3)).join(''), face(428, 600, .7))});

export const cracker = () => ({label: 'Christmas Cracker', scene: scene(flakes([[150, 340], [720, 360], [160, 820], [720, 830]]),
  path('M110,540 L250,580 L250,700 L110,740 Q90,640 110,540 Z', 'end'), path('M740,540 L600,580 L600,700 L740,740 Q760,640 740,540 Z', 'end'),
  rect(250, 560, 350, 160, 20, 'tube'), noFill(path('M250,580 Q270,640 250,700 M600,580 Q580,640 600,700', 'x', 5)),
  [[330, 610], [425, 640], [520, 610]].map(([x, y]) => star(x, y, 28)).join(''), rect(250, 680, 350, 26, 0, 'band', 4),
  path('M425,560 Q370,490 360,520 Q380,560 425,560 Q480,490 490,520 Q470,560 425,560 Z', 'bow', THIN),
  path('M290,420 L320,470 L350,420 L380,470 L410,420 L410,500 L290,500 Z', 'crown', THIN), star(560, 450, 34), line('M130,550 L100,510 M130,730 L100,770 M720,550 L750,510 M720,730 L750,770', 4))});
