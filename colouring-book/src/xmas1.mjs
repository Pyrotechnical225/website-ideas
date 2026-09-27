// Christmas book, pages 1–10 — all original designs (no named or trademarked characters).
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, star, face, moon, THIN} from './kit.mjs';
import {rot, sideFace, snowflake, snowGround, heart} from './kit2.mjs';

const scene = (...parts) => parts.join('');
export const flakes = (pts = [[150, 330], [300, 420], [560, 350], [720, 440], [140, 560], [730, 620]]) => pts.map(([x, y], i) => snowflake(x, y, 16 + (i % 3) * 5)).join('');
const black = s => s.replace('fill="#fff"', 'fill="#000"');

export const fatherChristmas = () => ({label: 'Father Christmas', scene: scene(flakes(), snowGround(),
  rect(340, 780, 60, 100, 14, 'boots'), rect(450, 780, 60, 100, 14, 'boots'),
  path('M300,800 Q290,600 425,590 Q560,600 550,800 Z', 'suit'), rect(290, 700, 270, 40, 8, 'belt', THIN), rect(400, 695, 50, 50, 6, 'buckle', THIN), line('M425,745 L425,800', THIN),
  path('M300,800 L550,800 L550,825 Q425,840 300,825 Z', 'fur', THIN),
  tube('M322,630 Q275,690 272,760', 60, 'suit'), tube('M528,630 Q575,690 578,760', 60, 'suit'), circle(272, 775, 30, 'mitten', THIN), circle(578, 775, 30, 'mitten', THIN),
  path('M340,560 Q330,690 425,700 Q520,690 510,560 Z', 'beard'), path('M370,600 Q425,630 480,600 Q455,640 425,625 Q395,640 370,600 Z', 'moustache', THIN),
  circle(425, 520, 80, 'skin'), face(425, 510, 1, {smile: false}), circle(425, 545, 12, 'nose', 4),
  path('M345,480 Q360,360 470,350 Q540,360 560,470 Z', 'hat'), circle(565, 470, 28, 'bobble', THIN),
  rect(335, 470, 180, 40, 20, 'fur', THIN))});

export const reindeer = () => ({label: 'Reindeer', scene: scene(flakes([[150, 330], [700, 350], [140, 560], [730, 620]]), snowGround(),
  [365, 485].map(x => rect(x - 22, 760, 44, 125, 16, 'body') + rect(x - 22, 855, 44, 30, 8, 'hoof', 4)).join(''),
  ellipse(425, 720, 120, 95, 'body'), ellipse(425, 745, 65, 55, 'belly', THIN),
  path('M360,440 Q330,360 300,350 M335,395 Q300,400 285,380 M345,420 Q320,440 300,430', 'x', 12).replace('fill="#fff"', 'fill="none"'),
  path('M490,440 Q520,360 550,350 M515,395 Q550,400 565,380 M505,420 Q530,440 550,430', 'x', 12).replace('fill="#fff"', 'fill="none"'),
  rot(ellipse(335, 500, 40, 17, 'ear'), -20, 335, 500), rot(ellipse(515, 500, 40, 17, 'ear'), 20, 515, 500),
  ellipse(425, 540, 90, 95, 'head'), face(425, 520, 1, {smile: false}), circle(425, 590, 22, 'nose', THIN), line('M405,615 Q425,628 445,615', 5),
  rect(345, 630, 160, 26, 12, 'collar', THIN), circle(425, 668, 20, 'bell', THIN), line('M415,675 L435,675', 3))});

export const snowman = () => ({label: 'Snowman', scene: scene(flakes(), snowGround(),
  circle(425, 760, 130, 'snow'), circle(425, 560, 95, 'snow'), [700, 760, 820].map(y => black(circle(425, y - 60, 12, 'button', 4))).join(''),
  line('M340,560 L240,480 M270,505 L245,470 M510,560 L610,480 M580,505 L605,470', 8),
  path('M340,610 Q425,650 510,610 L510,640 Q425,680 340,640 Z', 'scarf', THIN), rect(470, 630, 40, 110, 10, 'scarf', THIN), line('M475,735 l0,15 M490,735 l0,15 M505,735 l0,15', 4),
  circle(425, 400, 80, 'snow'), face(425, 385, 1, {smile: false}), path('M425,405 L500,415 L425,425 Z', 'carrot', THIN), [385, 405, 425, 445, 465].map((x, i) => dot(x, 440 + Math.abs(i - 2) * -4 + 4, 5)).join(''),
  rect(360, 290, 130, 50, 8, 'hat'), rect(330, 330, 190, 20, 8, 'hat', THIN), rect(360, 310, 130, 14, 0, 'band', 4))});

export const christmasTree = () => ({label: 'Christmas Tree', scene: scene(flakes([[150, 360], [720, 380], [140, 600], [730, 640]]), line('M70,885 L780,885'),
  rect(395, 800, 60, 60, 6, 'trunk'), path('M340,885 L360,840 L490,840 L510,885 Z', 'pot'),
  path('M425,420 L570,600 L520,600 L640,760 L560,760 L680,830 L170,830 L290,760 L210,760 L330,600 L280,600 Z', 'tree'),
  line('M300,620 Q425,670 550,620 M250,760 Q425,820 600,760', 5),
  [[360, 560], [480, 590], [330, 700], [520, 710], [425, 650], [250, 800], [600, 800], [420, 780]].map(([x, y]) => circle(x, y, 20, 'bauble', THIN)).join(''),
  star(425, 400, 55), rect(560, 830, 100, 55, 6, 'present', THIN), line('M610,830 L610,885 M560,855 L660,855', 4), rect(200, 820, 80, 65, 6, 'present2', THIN), line('M240,820 L240,885', 4))});

export const presents = () => ({label: 'Presents', scene: scene(flakes([[150, 340], [720, 360], [300, 430], [560, 420]]), line('M70,885 L780,885'),
  ...[[180, 700, 200, 185], [400, 640, 170, 245], [590, 740, 170, 145], [300, 800, 120, 85]].map(([x, y, w, h]) => rect(x, y, w, h, 8, 'box') + rect(x + w / 2 - 14, y, 28, h, 0, 'ribbon', 4) + rect(x - 8, y - 30, w + 16, 34, 6, 'lid', THIN) + path(`M${x + w / 2},${y - 30} Q${x + w / 2 - 60},${y - 90} ${x + w / 2 - 50},${y - 40} Z M${x + w / 2},${y - 30} Q${x + w / 2 + 60},${y - 90} ${x + w / 2 + 50},${y - 40} Z`, 'bow', 4)),
  [[250, 760], [480, 720], [640, 800]].map(([x, y]) => star(x, y, 14)).join(''))});

export const stocking = () => ({label: 'Stocking', scene: scene(flakes([[150, 340], [720, 360], [140, 700], [730, 720]]),
  rect(120, 420, 610, 40, 10, 'mantel'),
  line('M425,460 L425,500', 5),
  path('M330,540 L520,540 L520,760 Q520,860 430,870 L300,870 Q230,860 240,800 Q250,760 330,750 Z', 'sock'),
  rect(310, 500, 230, 70, 20, 'cuff'), path('M240,800 Q250,760 300,760 L300,870 Q240,860 240,800 Z', 'heel', THIN),
  rect(360, 440, 50, 70, 6, 'candy', THIN), path('M470,450 Q470,420 495,420 Q520,420 520,450 L520,500 L505,500 L505,450 Q505,435 495,435 Q485,435 485,450 Z', 'cane', 4), star(425, 650, 34), heart(470, 760, .9))});

export const gingerbreadMan = () => ({label: 'Gingerbread Man', scene: scene(flakes(), line('M70,885 L780,885'),
  path('M425,380 Q505,380 505,460 Q505,500 480,520 L600,540 Q640,560 610,600 L510,600 L540,820 Q545,870 500,870 L460,870 L425,720 L390,870 L350,870 Q305,870 310,820 L340,600 L240,600 Q210,560 250,540 L370,520 Q345,500 345,460 Q345,380 425,380 Z', 'cookie'),
  face(425, 450, 1), line('M260,560 q15,-12 30,0 q15,12 30,0 M530,560 q15,-12 30,0 q15,12 30,0 M330,835 q15,-12 30,0 M490,835 q15,-12 30,0', 5),
  circle(425, 580, 14, 'button', 4), circle(425, 630, 14, 'button2', 4), circle(425, 680, 14, 'button', 4), path('M390,520 L425,540 L460,520 L460,555 L425,540 L390,555 Z', 'bow', 4))});

export const candyCane = () => ({label: 'Candy Cane', scene: scene(flakes([[150, 340], [720, 360], [140, 620], [730, 700]]), line('M70,885 L780,885'),
  path('M360,880 L360,450 Q360,320 470,320 Q580,320 580,450 L580,500 L500,500 L500,450 Q500,400 470,400 Q440,400 440,450 L440,880 Z', 'cane'),
  line('M360,860 L440,820 M360,780 L440,740 M360,700 L440,660 M360,620 L440,580 M360,540 L440,500 M362,470 L440,445 M385,380 L445,410 M440,330 L470,400 M520,330 L495,405 M565,380 L505,430 M580,470 L500,470', 6),
  heart(640, 600, 1.1), heart(220, 700, .9))});

export const bauble = () => ({label: 'Bauble', scene: scene(flakes([[150, 340], [720, 360], [140, 700], [730, 720]]),
  line('M425,260 L425,390', 5), path('M395,400 L455,400 L450,440 L400,440 Z', 'cap', THIN), circle(425, 385, 16, 'x', 5).replace('fill="#fff"', 'fill="none"'),
  circle(425, 630, 200, 'bauble'), path('M235,580 Q425,520 615,580 L620,640 Q425,580 230,640 Z', 'band', THIN), path('M240,720 Q425,670 610,720', 'x', THIN).replace('fill="#fff"', 'fill="none"'),
  [[330, 690], [425, 700], [520, 690]].map(([x, y]) => star(x, y + 50, 26)).join(''), [[330, 480], [425, 460], [520, 480]].map(([x, y]) => circle(x, y, 20, 'dot', THIN)).join(''),
  ellipse(340, 520, 22, 40, 'shine', 4))});

export const bells = () => ({label: 'Christmas Bells', scene: scene(flakes([[150, 340], [720, 360], [140, 760], [730, 780]]),
  path('M425,420 Q380,330 330,380 Q360,420 425,420 Q490,330 520,380 Q490,420 425,420 Z', 'bow', THIN), circle(425, 420, 20, 'bow', THIN),
  line('M425,420 L320,520 M425,420 L530,520', 6),
  ...[[310, 640, -12], [540, 640, 12]].map(([x, y, a]) => rot(path(`M${x - 25},${y - 110} Q${x - 25},${y - 140} ${x},${y - 140} Q${x + 25},${y - 140} ${x + 25},${y - 110} Q${x + 100},${y - 90} ${x + 110},${y + 60} L${x - 110},${y + 60} Q${x - 100},${y - 90} ${x - 25},${y - 110} Z`, 'bell') + rect(x - 120, y + 50, 240, 30, 12, 'rim', THIN) + circle(x, y + 95, 26, 'clapper', THIN) + path(`M${x - 60},${y - 30} Q${x},${y - 55} ${x + 60},${y - 30}`, 'x', 4).replace('fill="#fff"', 'fill="none"'), a, x, y)),
  line('M200,830 L230,800 M650,830 L620,800 M425,830 L425,790', 5))});
