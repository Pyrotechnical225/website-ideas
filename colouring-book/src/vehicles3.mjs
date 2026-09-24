// Vehicles 21–30 — original, generic designs (no brands, logos or known characters).
import {rect, circle, ellipse, path, line, dot, wheel, face, cloud, sun, bird, tree, hill, grass, flower, road, star, tube, THIN} from './kit.mjs';
import {outlineText} from './page.mjs';

export const motorbike = () => ({label: 'Motorbike', scene:
  sun(660, 330, 42) + cloud(210, 340, 1) + bird(430, 330) +
  wheel(230, 795, 90) + wheel(615, 795, 90) +
  tube('M230,795 L330,720', 24, 'fork') + tube('M615,795 L565,640 L580,575', 24, 'fork') +
  line('M540,575 L585,565 L625,585', 12) +
  line('M140,760 Q150,680 240,685', 12) +
  rect(330, 725, 130, 55, 14, 'engine', THIN) +
  path('M200,705 Q210,652 285,642 L490,630 Q565,630 585,682 L560,725 L300,735 Q220,735 200,705 Z', 'body') +
  path('M270,642 Q282,600 332,600 L430,600 Q455,606 448,637 Z', 'seat', THIN) +
  circle(610, 650, 27, 'light', THIN) + face(480, 675, .7, {cheeks: false}) +
  road(885)});

export const scooter = () => ({label: 'Scooter', scene:
  cloud(200, 330, 1) + sun(660, 330, 40) + bird(430, 330) + flower(110, 885) + flower(745, 885) +
  path('M230,780 Q220,640 330,620 L380,620 L380,700 L560,700 L600,560 L640,560 L620,780 Z', 'body') +
  path('M270,610 Q280,570 330,570 L420,570 Q445,575 435,610 Z', 'seat', THIN) +
  rect(595, 470, 22, 100, 8, 'stem', THIN) + line('M560,470 L650,470', 12) + circle(640, 530, 22, 'light', THIN) +
  rect(250, 520, 110, 55, 10, 'box', THIN) + face(305, 690, .75) +
  wheel(290, 800, 62) + wheel(610, 800, 62) + road(885)});

export const iceCreamVan = () => ({label: 'Ice Cream Van', scene:
  sun(170, 320, 40) + cloud(640, 320, .9) +
  // giant cone on the roof
  path('M345,470 L400,470 L372,535 Z', 'cone', THIN) + circle(372, 452, 34, 'scoop', THIN) + circle(372, 410, 26, 'scoop2', THIN) + dot(372, 380, 7) +
  path('M140,810 L140,560 Q140,535 165,535 L560,535 L560,810 Z', 'body') +
  path('M560,810 L560,590 Q560,570 580,570 L660,570 Q684,570 694,592 L735,680 L735,790 Q735,810 715,810 Z', 'cab') +
  path('M582,595 L655,595 L694,680 L582,680 Z', 'window', THIN) + face(630, 632, .7, {cheeks: false}) +
  rect(190, 575, 270, 120, 12, 'hatch', THIN) + path('M180,575 L470,575 L450,550 L200,550 Z', 'awning', THIN) + line('M240,552 L235,575 M295,552 L292,575 M350,552 L350,575 M405,552 L408,575', 4) +
  circle(260, 640, 20, 'scoop', 4) + path('M248,652 L272,652 L260,685 Z', 'cone', 4) +
  rect(160, 720, 380, 34, 8, 'stripe', THIN) + circle(722, 760, 13, 'light', THIN) +
  wheel(250, 815, 60) + wheel(640, 815, 60) + road()});

export const taxi = () => ({label: 'Taxi', scene:
  cloud(200, 340, 1) + bird(620, 330) + bird(665, 350, .8) +
  rect(385, 520, 110, 45, 12, 'sign', THIN) + line('M410,542 L470,542', 4) +
  path('M170,800 L170,700 Q170,680 190,680 L250,680 L285,590 Q290,570 312,570 L570,570 Q592,570 597,590 L632,680 L680,680 Q702,680 702,705 L702,800 Q702,822 680,822 L192,822 Q170,822 170,800 Z', 'body') +
  path('M265,680 L300,595 L425,595 L425,680 Z', 'window', THIN) + path('M445,595 L575,595 L610,680 L445,680 Z', 'window', THIN) +
  line('M435,685 L435,815', THIN) + rect(455, 712, 34, 10, 5, 'trim', THIN) + rect(260, 712, 34, 10, 5, 'trim', THIN) +
  circle(688, 725, 13, 'light', THIN) + face(525, 632, .75, {cheeks: false}) + rect(190, 760, 490, 22, 6, 'stripe', THIN) +
  wheel(290, 822, 60) + wheel(585, 822, 60) + road()});

export const camperVan = () => ({label: 'Camper Van', scene:
  sun(660, 320, 42) + cloud(210, 320, 1) + tree(110, 885, .8) + hill(420, 790, 885, 45) +
  path('M160,800 L160,560 Q160,500 230,500 L600,500 Q660,500 690,560 L720,660 L720,800 Q720,822 698,822 L182,822 Q160,822 160,800 Z', 'body') +
  line('M160,640 L720,640') + rect(250, 480, 280, 25, 10, 'rack', THIN) + rect(270, 450, 90, 30, 8, 'bag', THIN) + rect(380, 440, 110, 40, 8, 'bag2', THIN) +
  rect(195, 530, 110, 85, 14, 'window', THIN) + rect(330, 530, 110, 85, 14, 'window', THIN) + path('M560,530 L620,530 Q655,535 680,610 L560,610 Z', 'window', THIN) +
  rect(460, 520, 80, 280, 10, 'door', THIN) + circle(520, 700, 8, 'trim', 4) + face(610, 570, .65, {cheeks: false}) +
  circle(705, 720, 14, 'light', THIN) + path('M190,700 Q260,660 330,700 Q400,740 440,700', 'swoosh', THIN) +
  wheel(280, 822, 62) + wheel(620, 822, 62) + road()});

export const binLorry = () => ({label: 'Bin Lorry', scene:
  cloud(220, 320, 1) + sun(660, 330, 40) + bird(440, 330) +
  path('M120,760 L120,560 Q120,520 160,520 L530,520 L530,760 Z', 'body') + line('M150,560 L500,560 M150,720 L500,720', THIN) +
  path('M120,560 L90,600 L90,740 L120,760 Z', 'back', THIN) +
  path('M540,760 L540,560 Q540,540 560,540 L650,540 Q674,540 684,562 L725,650 L725,760 Z', 'cab') +
  path('M562,565 L645,565 L684,650 L562,650 Z', 'window', THIN) + face(612, 603, .72, {cheeks: false}) +
  rect(95, 760, 640, 42, 12, 'chassis') + circle(712, 740, 12, 'light', THIN) +
  rect(210, 600, 110, 100, 10, 'panel', THIN) + line('M235,620 L235,680 M265,620 L265,680 M295,620 L295,680', 4) +
  path('M380,620 L390,600 L480,600 L470,620 Z', 'lid', THIN) + rect(385, 620, 90, 80, 8, 'bin', THIN) + circle(430, 660, 12, 'recycle', 4) +
  wheel(220, 815, 58) + wheel(380, 815, 58) + wheel(630, 815, 58) + road(885)});

export const towTruck = () => ({label: 'Tow Truck', scale: .93, scene:
  cloud(640, 320, 1) + sun(170, 330, 40) +
  // towed little car
  path('M70,860 L70,800 Q70,785 85,785 L110,785 L140,740 L220,740 L250,785 L270,785 L270,860 Z', 'car2', THIN) + path('M120,785 L148,752 L210,752 L235,785 Z', 'window', THIN) + wheel(115, 860, 26) + wheel(235, 860, 26) +
  path('M270,780 L390,570 L420,585 L310,790 Z', 'boom') + line('M395,575 L300,760', 4) + line('M300,790 L275,800', 8) +
  rect(290, 700, 280, 90, 12, 'bed') +
  path('M570,800 L570,560 Q570,540 590,540 L665,540 Q690,540 700,562 L740,660 L740,780 Q740,800 720,800 Z', 'cab') +
  path('M592,565 L660,565 L700,660 L592,660 Z', 'window', THIN) + face(640, 605, .7, {cheeks: false}) +
  rect(610, 510, 60, 30, 10, 'siren', THIN) + line('M625,500 L617,485 M640,497 L640,480 M655,500 L663,485', 4) +
  circle(727, 745, 12, 'light', THIN) + rect(280, 790, 460, 30, 8, 'chassis', THIN) +
  wheel(390, 830, 55) + wheel(650, 830, 55) + line('M70,885 L780,885')});

export const monsterTruck = () => ({label: 'Monster Truck', scene:
  sun(170, 320, 40) + cloud(640, 320, .9) + bird(420, 340) +
  path('M180,610 L180,540 Q180,520 200,520 L290,520 L335,450 Q342,440 355,440 L520,440 Q533,440 541,450 L590,520 L650,520 Q675,520 675,545 L675,610 Q675,630 655,630 L200,630 Q180,630 180,610 Z', 'body') +
  path('M305,520 L350,462 L420,462 L420,520 Z', 'window', THIN) + path('M440,462 L515,462 L560,520 L440,520 Z', 'window', THIN) +
  face(500, 490, .6, {cheeks: false}) + star(260, 575, 26) + circle(662, 555, 12, 'light', THIN) +
  rect(250, 630, 360, 40, 10, 'frame', THIN) + line('M300,670 L290,700 M560,670 L570,700', 10) +
  circle(265, 785, 120, 'tyre') + circle(265, 785, 60, 'hub', THIN) + circle(265, 785, 18, 'hub', THIN) +
  circle(595, 785, 120, 'tyre') + circle(595, 785, 60, 'hub', THIN) + circle(595, 785, 18, 'hub', THIN) +
  [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return line(`M${265 + Math.cos(a) * 95},${785 + Math.sin(a) * 95} L${265 + Math.cos(a) * 118},${785 + Math.sin(a) * 118} M${595 + Math.cos(a) * 95},${785 + Math.sin(a) * 95} L${595 + Math.cos(a) * 118},${785 + Math.sin(a) * 118}`, THIN); }).join('') +
  line('M70,905 L780,905') + path('M680,905 Q730,860 780,905 Z', 'dirt', THIN)});

export const raceCar = () => ({label: 'Race Car', scene:
  cloud(200, 340, 1) + sun(660, 330, 42) +
  line('M80,640 L130,640 M60,690 L140,690 M90,740 L140,740', THIN) +
  path('M150,760 L150,700 Q150,680 175,675 L330,660 L380,600 Q390,590 405,590 L470,590 Q485,590 490,605 L505,660 L690,700 Q730,710 730,740 L730,760 Q730,780 710,780 L170,780 Q150,780 150,760 Z', 'body') +
  path('M150,680 L150,590 L230,590 L230,670 Z', 'wing', THIN) + rect(135, 575, 110, 25, 6, 'wing', THIN) +
  path('M392,660 L405,610 L470,610 L482,660 Z', 'window', THIN) + circle(437, 600, 26, 'helmet', THIN) +
  circle(300, 715, 32, 'number') + outlineText('7', 300, 733, 48, {sw: 4}) +
  face(600, 718, .6, {cheeks: false}) +
  wheel(250, 790, 58) + wheel(620, 790, 58) + road(875)});

export const roadRoller = () => ({label: 'Road Roller', scene:
  cloud(640, 320, 1) + sun(170, 330, 40) + bird(420, 330) +
  rect(160, 610, 90, 45, 10, 'frame', THIN) + circle(210, 760, 105, 'drum') + circle(210, 760, 40, 'hub', THIN) +
  path('M270,760 L270,590 Q270,570 290,570 L600,570 Q620,570 620,590 L620,760 Z', 'body') +
  path('M330,570 L330,440 Q330,420 350,420 L500,420 Q520,420 520,440 L520,570 Z', 'cab') + rect(310, 405, 230, 25, 10, 'roof', THIN) +
  rect(355, 445, 140, 100, 12, 'window', THIN) + face(425, 490, .85, {cheeks: false}) +
  rect(560, 505, 24, 70, 6, 'exhaust', THIN) + line('M300,640 L590,640', THIN) +
  wheel(560, 800, 70) + path('M60,885 L780,885', 'ground') + [700, 750].map(x => grass(x, 885)).join('')});
