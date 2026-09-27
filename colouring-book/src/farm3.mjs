// Farm book, pages 21–30: farm places and things (original designs).
import {rect, circle, ellipse, path, line, dot, g, tube, cloud, sun, bird, grass, flower, face, wheel, moon, star, THIN} from './kit.mjs';
import {rot, sideFace, fence, ground, grassRow, heart} from './kit2.mjs';
import {farmSky, chubby} from './farm1.mjs';

const scene = (...parts) => parts.join('');

const barnShape = (x, gy, s = 1) => scene(
  path(`M${x - 190 * s},${gy} L${x - 190 * s},${gy - 250 * s} L${x},${gy - 400 * s} L${x + 190 * s},${gy - 250 * s} L${x + 190 * s},${gy} Z`, 'barn'),
  path(`M${x - 215 * s},${gy - 240 * s} L${x},${gy - 425 * s} L${x + 215 * s},${gy - 240 * s} L${x + 195 * s},${gy - 225 * s} L${x},${gy - 385 * s} L${x - 195 * s},${gy - 225 * s} Z`, 'roof', THIN),
  rect(x - 55 * s, gy - 330 * s, 110 * s, 80 * s, 6, 'loft', THIN), line(`M${x},${gy - 330 * s} L${x},${gy - 250 * s}`, THIN),
  rect(x - 95 * s, gy - 200 * s, 190 * s, 200 * s, 4, 'door', THIN), line(`M${x - 95 * s},${gy - 200 * s} L${x + 95 * s},${gy} M${x + 95 * s},${gy - 200 * s} L${x - 95 * s},${gy} M${x},${gy - 200 * s} L${x},${gy}`, THIN),
  rect(x - 165 * s, gy - 210 * s, 50 * s, 50 * s, 4, 'window', THIN), rect(x + 115 * s, gy - 210 * s, 50 * s, 50 * s, 4, 'window', THIN));

export const barn = () => ({label: 'Big Red Barn', scene: scene(farmSky(true), barnShape(425, 885), fence(90, 210, 885, 80), fence(650, 760, 885, 80), line('M70,885 L780,885'))});

export const farmTractor = () => ({label: 'Farm Tractor', scene: scene(farmSky(true), path('M60,885 Q250,800 470,885 Z', 'hill', THIN),
  rect(90, 700, 230, 110, 12, 'trailer'), [[140, 670], [205, 660], [270, 670]].map(([x, y]) => rect(x - 35, y - 40, 70, 60, 10, 'hay', THIN) + line(`M${x - 25},${y - 25} L${x + 25},${y - 25} M${x - 25},${y - 5} L${x + 25},${y - 5}`, 3)).join(''),
  wheel(205, 835, 45), line('M320,780 L370,780', 10),
  path('M390,780 L390,610 Q390,590 410,590 L540,590 L540,780 Z', 'cab'), rect(410, 610, 110, 90, 10, 'window', THIN), rect(380, 572, 180, 24, 10, 'roof', THIN),
  path('M540,780 L540,670 L700,670 Q730,670 730,700 L730,780 Z', 'bonnet'), line('M590,685 L590,765 M630,685 L630,765 M670,685 L670,765', THIN),
  rect(655, 610, 24, 62, 8, 'exhaust', THIN), face(465, 650, .75, {cheeks: false}),
  wheel(450, 800, 95), wheel(680, 832, 50), line('M70,885 L780,885'))});

export const farmer = () => ({label: 'Farmer', scene: scene(sun(160, 330, 40), barnShape(690, 885, .4), line('M70,885 L780,885'),
  rect(355, 760, 50, 125, 14, 'boots') , rect(445, 760, 50, 125, 14, 'boots'),
  path('M335,780 L335,600 Q335,560 380,560 L470,560 Q515,560 515,600 L515,780 Z', 'overalls'), rect(370, 620, 110, 70, 10, 'pocket', THIN),
  line('M375,560 L375,620 M475,560 L475,620', THIN), dot(375, 625, 7), dot(475, 625, 7),
  rect(290, 575, 45, 130, 20, 'shirt'), rect(515, 575, 45, 130, 20, 'shirt'), circle(312, 715, 22, 'skin', THIN), circle(538, 715, 22, 'skin', THIN),
  path('M530,720 L620,740 L600,790 L520,770 Z', 'basket', THIN), circle(560, 735, 16, 'apple', 4), circle(590, 745, 16, 'apple', 4),
  circle(425, 480, 78, 'skin'), face(425, 485, 1),
  ellipse(425, 420, 130, 22, 'hat'), path('M355,420 Q355,340 425,340 Q495,340 495,420 Z', 'hat'), rect(360, 395, 130, 20, 4, 'band', THIN))});

export const scarecrow = () => ({label: 'Scarecrow', scene: scene(sun(690, 330, 40), line('M70,885 L780,885'),
  rect(410, 520, 30, 365, 6, 'pole', THIN), rect(210, 560, 430, 26, 6, 'pole', THIN),
  path('M320,580 L530,580 L560,780 L290,780 Z', 'coat'), rect(350, 600, 60, 50, 6, 'patch', THIN), line('M425,580 L425,780', THIN), dot(425, 640, 6), dot(425, 700, 6),
  line('M210,560 L175,545 M210,573 L170,575 M210,586 L175,605 M640,560 L675,545 M640,573 L680,575 M640,586 L675,605', 4),
  path('M300,780 L290,820 M330,780 L325,815 M520,780 L530,818 M550,780 L560,815', 'x', 4).replace('fill="#fff"', 'fill="none"'),
  circle(425, 470, 72, 'head'), face(425, 475, 1),
  ellipse(425, 410, 120, 20, 'hat'), path('M365,410 L385,320 L465,320 L485,410 Z', 'hat'), rect(372, 385, 106, 20, 4, 'band', THIN),
  path('M580,410 Q610,380 640,410 L650,405 Q640,430 610,430 Q585,428 580,410 Z', 'crow', THIN), dot(628, 405, 4), path('M650,405 L672,410 L650,416 Z', 'beak', 3),
  grassRow(885, [120, 250, 620, 730]))});

export const vegetablePatch = () => ({label: 'Vegetable Patch', scene: scene(farmSky(true), path('M70,760 L780,760 L780,885 L70,885 Z', 'soil', THIN), line('M70,820 L780,820', 4),
  ...[140, 260, 380].map(x => path(`M${x - 25},${760} L${x + 25},${760} L${x},${880} Z`, 'carrot', THIN) + line(`M${x - 12},790 L${x + 8},792 M${x - 8},820 L${x + 6},822`, 3) + path(`M${x},760 Q${x - 30},700 ${x - 20},680 Q${x},720 ${x},760 Q${x + 5},700 ${x + 30},690 Q${x + 20},730 ${x},760 Z`, 'leaves', 4)),
  circle(520, 730, 60, 'cabbage'), path('M470,720 Q520,660 570,720 M480,750 Q520,700 560,750', 'x', 4).replace('fill="#fff"', 'fill="none"'),
  ellipse(680, 760, 80, 60, 'pumpkin'), line('M650,705 Q640,760 650,815 M710,705 Q720,760 710,815 M680,700 L680,820', 4), rect(670, 680, 20, 30, 6, 'stem', 4),
  rect(250, 520, 26, 240, 6, 'stick', THIN), rect(210, 470, 110, 60, 8, 'sign', THIN))});

export const appleTree = () => ({label: 'Apple Tree', scene: scene(sun(160, 330, 40), line('M70,885 L780,885'),
  tube('M425,885 Q430,720 425,620', 70, 'trunk'), line('M425,700 L360,620 M430,680 L500,610', 18),
  [[300, 520, 95], [425, 450, 110], [550, 520, 95], [360, 600, 80], [490, 600, 80]].map(([x, y, r]) => circle(x, y, r, 'leaves')).join(''),
  [[300, 500], [390, 430], [470, 470], [555, 530], [350, 610], [500, 600], [420, 560]].map(([x, y]) => circle(x, y, 22, 'apple', THIN) + line(`M${x},${y - 22} l4,-12`, 4)).join(''),
  path('M560,885 L580,800 L720,800 L740,885 Z', 'basket'), line('M580,830 L730,830 M575,860 L735,860', 4), path('M590,800 Q650,730 710,800', 'x', THIN).replace('fill="#fff"', 'fill="none"'),
  circle(620, 790, 20, 'apple', 4), circle(665, 785, 20, 'apple', 4), circle(200, 865, 20, 'apple', 4), grassRow(885, [120, 300]))});

export const hayBales = () => ({label: 'Hay Bales', scene: scene(farmSky(true), path('M60,885 Q300,780 560,885 Z', 'hill', THIN), barnShape(660, 885, .42),
  ...[[230, 800, 85], [420, 800, 85], [325, 670, 80]].map(([x, y, r]) => circle(x, y, r, 'hay') + circle(x, y, r * 0.62, 'hay2', 4) + circle(x, y, r * 0.28, 'hay2', 4) + line(`M${x - r},${y} L${x - r * 0.62},${y} M${x + r * 0.62},${y} L${x + r},${y}`, 3)),
  line('M70,885 L780,885'), grassRow(885, [120, 560]))});

export const duckPond = () => ({label: 'Duck Pond', scene: scene(farmSky(true), ellipse(425, 800, 340, 110, 'pond', THIN),
  line('M110,800 L110,660 M140,810 L140,690 M730,800 L730,650 M705,810 L705,690', 5), ellipse(110, 650, 10, 28, 'reed', 4), ellipse(730, 640, 10, 28, 'reed', 4),
  ...[[300, 790, 1], [480, 820, .7], [590, 770, .6]].map(([x, y, s]) => g(path('M-110,20 Q-120,-50 -30,-50 L10,-50 Q30,-110 80,-110 Q125,-110 125,-70 Q125,-35 85,-20 Q110,30 20,40 L-60,40 Q-110,40 -110,20 Z', 'duck') + path('M118,-80 Q165,-85 170,-68 Q155,-52 118,-58 Z', 'bill', THIN) + sideFace(88, -80, .7, 1, {smile: false}) + path('M-60,0 Q-10,-25 30,5 Q0,30 -50,25 Z', 'wing', 4), `translate(${x},${y}) scale(${s})`)),
  line('M200,850 q20,-10 40,0 M560,880 q20,-10 40,0', 4))});

export const eggBasket = () => ({label: 'Basket of Eggs', scene: scene(farmSky(true), line('M70,885 L780,885'),
  path('M300,640 Q425,440 550,640', 'x', 14).replace('fill="#fff"', 'fill="none"'),
  ...[[340, 650], [410, 630], [480, 645], [375, 700], [455, 700]].map(([x, y]) => ellipse(x, y, 42, 55, 'egg')),
  path('M230,680 L620,680 L580,880 L270,880 Z', 'basket'), line('M245,730 L605,730 M255,780 L595,780 M265,830 L585,830', 4), line('M330,680 L320,880 M425,680 L425,880 M520,680 L530,880', 4),
  path('M650,800 Q640,720 700,700 Q720,660 745,680 Q760,700 745,720 Q770,800 700,820 Z', 'hen', THIN), path('M740,670 Q742,650 755,660 Q765,645 770,665 Z', 'comb', 4), sideFace(735, 695, .5), path('M760,690 L780,696 L760,702 Z', 'beak', 3), heart(640, 520, 1), heart(700, 460, .7))});

export const goodnight = () => ({label: 'Goodnight Farm', scene: scene(moon(650, 360, 48), ...[[160, 340], [300, 420], [460, 330], [740, 480], [200, 500]].map(([x, y]) => star(x, y, 16)),
  barnShape(330, 885, .75), fence(560, 760, 885, 80), line('M70,885 L780,885'),
  circle(620, 740, 40, 'wool', THIN), circle(660, 720, 40, 'wool', THIN), circle(700, 740, 40, 'wool', THIN), ellipse(660, 760, 70, 45, 'wool'), ellipse(605, 700, 30, 36, 'face', THIN), line('M590,700 q7,6 14,0 M610,700 q7,6 14,0', 4),
  line('M650,805 l0,30 M680,805 l0,30', 8), line('M85,885 L780,885'))});
