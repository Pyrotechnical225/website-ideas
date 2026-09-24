// Vehicles 11–20 — original, generic designs.
import {rect, circle, ellipse, path, line, dot, wheel, face, cloud, sun, bird, tree, hill, grass, flower, road, waves, star, tube, fish, seaweed, bubble, moon, THIN} from './kit.mjs';

export const crane = () => ({label: 'Crane', scene:
  cloud(640, 330, 1) + sun(440, 330, 36) +
  // boom with lattice
  path('M345,640 L170,330 L210,310 L395,625 Z', 'boom') +
  line('M195,345 L230,420 L255,395 L290,475 L310,450 L345,530 L362,505 L380,590', THIN) +
  circle(190, 322, 12, 'hub', 4) + line('M190,334 L190,470', THIN) +
  path('M190,470 q0,24 -18,24 q-14,0 -14,-14', 'hook', THIN) +
  rect(125, 505, 110, 85, 8, 'crate') + line('M125,505 L235,590 M235,505 L125,590', THIN) +
  rect(290, 600, 190, 105, 16, 'house') + rect(400, 620, 60, 50, 8, 'window', THIN) +
  path('M560,705 L560,560 Q560,540 580,540 L660,540 Q684,540 694,562 L730,650 L730,705 Z', 'cab') +
  path('M582,565 L655,565 L692,650 L582,650 Z', 'window', THIN) + face(630, 605, .72, {cheeks: false}) +
  rect(140, 700, 600, 65, 14, 'chassis') + circle(716, 725, 12, 'light', THIN) +
  wheel(225, 800, 56) + wheel(385, 800, 56) + wheel(640, 800, 56) + road(885)});

export const train = () => ({label: 'Steam Train', shift: 40, scene:
  cloud(600, 300, .75) + cloud(690, 380, .6) + circle(640, 450, 22, 'smoke', THIN) + circle(665, 410, 30, 'smoke', THIN) + sun(170, 320, 40) +
  hill(60, 400, 850, 60) +
  // carriage
  rect(100, 600, 250, 170, 20, 'carriage') + rect(125, 630, 85, 70, 12, 'window', THIN) + rect(240, 630, 85, 70, 12, 'window', THIN) +
  line('M350,760 L375,760', 9) + wheel(160, 800, 36) + wheel(290, 800, 36) +
  // engine
  path('M615,610 L605,505 L670,505 L660,610 Z', 'chimney') + rect(595, 490, 85, 22, 8, 'chimney', THIN) +
  rect(430, 600, 260, 135, 45, 'boiler') + rect(500, 570, 55, 40, 16, 'dome', THIN) + line('M480,605 L480,730 M540,605 L540,730', THIN) +
  rect(380, 510, 120, 225, 12, 'cab') + rect(400, 540, 80, 75, 10, 'window', THIN) + rect(360, 490, 160, 28, 10, 'roof', THIN) +
  face(615, 665, .8) +
  rect(370, 735, 390, 36, 10, 'base', THIN) + path('M760,735 L780,800 L745,800 Z', 'cowcatcher', THIN) +
  wheel(445, 800, 44) + wheel(545, 800, 44) + wheel(660, 800, 38) + line('M445,800 L545,800', 8) +
  line('M70,850 L780,850') + [110, 190, 270, 350, 430, 510, 590, 670, 750].map(x => rect(x - 25, 852, 50, 18, 4, 'sleeper', 4)).join('')});

export const aeroplane = () => ({label: 'Aeroplane', scene:
  sun(660, 330, 44) + cloud(200, 330, 1) + cloud(640, 830, 1.1) + cloud(200, 800, .8) + bird(430, 320) + bird(475, 345, .8) +
  path('M380,555 L420,470 L475,470 L465,555 Z', 'wing') +
  path('M205,560 L150,425 L230,425 L305,560 Z', 'tail') +
  path('M150,610 Q160,545 260,545 L600,545 Q700,550 725,610 Q700,668 600,672 L260,672 Q160,672 150,610 Z', 'body') +
  [300, 360, 420, 480, 540].map(x => circle(x, 590, 18, 'window', THIN)).join('') +
  path('M630,565 Q690,572 712,600 L630,600 Z', 'window', THIN) + face(645, 630, .6, {cheeks: false, smile: false}) + line('M680,640 Q695,648 705,636', 4) +
  line('M170,640 L690,640', THIN) +
  path('M360,620 L300,775 L385,775 L480,620 Z', 'wing') +
  rect(722, 596, 18, 28, 6, 'nose', 4) + ellipse(748, 610, 12, 72, 'prop', THIN)});

export const helicopter = () => ({label: 'Helicopter', scene:
  sun(170, 330, 40) + cloud(650, 330, .9) + cloud(630, 800, 1) + bird(360, 320) +
  path('M320,575 L150,550 L150,592 L330,615 Z', 'tail') + circle(145, 570, 40, 'rotor2', THIN) + line('M145,535 L145,605 M110,570 L180,570', THIN) +
  rect(440, 450, 40, 40, 6, 'mast', THIN) +
  path('M300,580 Q300,480 425,480 L520,480 Q625,490 650,590 Q650,675 545,675 L385,675 Q300,665 300,580 Z', 'body') +
  path('M525,505 Q605,515 625,590 L525,590 Z', 'window', THIN) + face(430, 580, .9) +
  line('M380,675 L370,740 M560,675 L570,740', THIN) + line('M300,740 L630,740 Q660,740 668,715', 10) +
  ellipse(460, 440, 250, 18, 'blade', THIN) + circle(460, 440, 16, 'hub', THIN)});

export const rocket = () => ({label: 'Rocket', shift: 20, scene:
  star(150, 330) + star(700, 300, 20) + star(240, 520, 12) + star(650, 560, 14) + star(170, 760, 18) + star(700, 780, 12) + moon(690, 420, 45) +
  circle(160, 620, 45, 'planet', THIN) + ellipse(160, 620, 80, 16, 'ring', THIN) + path('M115,620 A45,45 0 0 1 205,620', 'planet', THIN) +
  path('M330,650 L245,770 L245,845 L330,790 Z', 'fin') + path('M520,650 L605,770 L605,845 L520,790 Z', 'fin') +
  path('M425,270 Q525,380 525,530 L525,790 L325,790 L325,530 Q325,380 425,270 Z', 'body') +
  line('M335,620 L515,620', THIN) + line('M362,370 L488,370', THIN) +
  circle(425, 500, 62, 'window') + face(425, 492, .95) +
  rect(400, 790, 50, 90, 10, 'fin', THIN) +
  path('M372,790 L478,790 L462,835 L388,835 Z', 'nozzle') +
  path('M392,838 Q400,900 425,960 Q450,900 458,838 Z', 'flame', THIN) + path('M410,845 Q415,885 425,915 Q435,885 440,845 Z', 'flame2', 4)});

export const sailingBoat = () => ({label: 'Sailing Boat', scene:
  sun(660, 330, 44) + cloud(200, 330, 1) + bird(560, 450) + bird(610, 470, .8) +
  rect(412, 330, 18, 400, 6, 'mast', THIN) + path('M430,330 L430,300 L490,316 Z', 'flag', THIN) +
  path('M442,350 L442,700 L660,700 Q610,520 442,350 Z', 'sail') +
  path('M400,395 L400,700 L220,700 Q290,560 400,395 Z', 'sail2') +
  path('M160,715 L690,715 L625,810 L225,810 Z', 'hull') +
  circle(300, 760, 16, 'window', THIN) + circle(380, 760, 16, 'window', THIN) + face(540, 752, .7, {cheeks: false}) +
  waves(820, 70, 780, 14) + waves(875, 100, 760, 12) + waves(930, 70, 780, 12)});

export const tugboat = () => ({label: 'Tugboat', scene:
  cloud(200, 330, 1) + sun(660, 320, 40) + circle(600, 420, 22, 'smoke', THIN) + circle(625, 380, 30, 'smoke', THIN) +
  rect(555, 440, 70, 140, 10, 'funnel') + rect(555, 480, 70, 28, 0, 'stripe', THIN) +
  rect(355, 470, 150, 100, 12, 'wheelhouse') + rect(380, 490, 100, 55, 10, 'window', THIN) + face(430, 515, .6, {cheeks: false}) +
  rect(290, 570, 290, 130, 14, 'cabin') + [320, 410, 500].map(x => circle(x + 20, 630, 20, 'window', THIN)).join('') +
  path('M140,700 L735,700 Q715,805 625,812 L230,812 Q155,795 140,700 Z', 'hull') +
  line('M160,735 L715,735', THIN) + [240, 360, 480, 600].map(x => circle(x, 770, 22, 'tyre', THIN)).join('') +
  waves(830, 70, 780, 14) + waves(885, 100, 760, 12) + waves(940, 70, 780, 12)});

export const submarine = () => ({label: 'Submarine', scene:
  bubble(640, 330, 14) + bubble(670, 290, 9) + bubble(610, 280, 7) + fish(190, 360, .9) + fish(650, 860, .8, true) + fish(170, 820, .7) +
  path('M365,565 L385,470 L505,470 L525,565 Z', 'tower') + line('M470,470 L470,410 L515,410', 9) +
  rect(155, 560, 530, 200, 100, 'body') + rect(125, 630, 40, 60, 8, 'body', THIN) + ellipse(112, 660, 14, 55, 'prop', THIN) +
  [275, 385, 495].map(x => circle(x, 660, 36, 'window') + circle(x, 660, 22, 'window2', 4)).join('') +
  face(610, 640, .75) + line('M170,705 L670,705', THIN) +
  bubble(720, 560, 12) + bubble(745, 525, 8) +
  line('M70,960 Q250,930 425,955 Q600,980 780,950', THIN) + seaweed(110, 955, 140) + seaweed(145, 955, 100) + seaweed(740, 950, 130) + seaweed(705, 952, 90)});

export const hotAirBalloon = () => ({label: 'Hot Air Balloon', shift: 40, scene:
  cloud(170, 330, .9) + cloud(680, 420, .8) + bird(640, 320) + bird(690, 340, .8) + sun(170, 520, 36) +
  path('M425,265 C565,265 615,365 605,455 C595,545 505,605 475,655 L375,655 C345,605 255,545 245,455 C235,365 285,265 425,265 Z', 'balloon') +
  line('M425,268 Q360,450 395,652 M425,268 Q490,450 455,652', THIN) + line('M252,420 Q425,470 598,420', THIN) +
  face(425, 525, .9, {cheeks: false}) +
  line('M378,655 L385,735 M472,655 L465,735', THIN) + rect(365, 735, 120, 85, 10, 'basket') + line('M365,765 L485,765 M365,795 L485,795 M405,735 L405,820 M445,735 L445,820', 4) +
  hill(60, 450, 960, 70) + hill(380, 790, 960, 55) + tree(160, 960, .55) + tree(690, 960, .5)});

export const bicycle = () => ({label: 'Bicycle', scene:
  sun(660, 330, 42) + cloud(210, 330, 1) + bird(420, 340) + flower(100, 885) + flower(750, 885) +
  circle(250, 765, 115, 'tyre') + circle(250, 765, 88, 'rim', THIN) + circle(610, 765, 115, 'tyre') + circle(610, 765, 88, 'rim', THIN) +
  [0, 1, 2, 3].map(i => { const a = i * Math.PI / 4; return line(`M${250 + Math.cos(a) * 88},${765 + Math.sin(a) * 88} L${250 - Math.cos(a) * 88},${765 - Math.sin(a) * 88} M${610 + Math.cos(a) * 88},${765 + Math.sin(a) * 88} L${610 - Math.cos(a) * 88},${765 - Math.sin(a) * 88}`, 3); }).join('') +
  circle(250, 765, 14, 'hub', 4) + circle(610, 765, 14, 'hub', 4) +
  tube('M250,765 L410,765 L360,585 Z') + tube('M360,585 L570,585 L410,765') + tube('M570,585 L610,765') + tube('M570,585 L555,530') +
  path('M315,560 Q350,540 395,555 Q400,572 380,575 L325,575 Q305,572 315,560 Z', 'saddle', THIN) + line('M360,575 L360,592', 9) +
  line('M520,520 Q555,520 580,535 L610,520', 12) + circle(410, 765, 26, 'hub', THIN) + line('M410,765 L445,810', 9) + rect(430, 805, 40, 14, 5, 'pedal', 4) +
  path('M600,500 L680,500 L665,560 L612,560 Z', 'basket', THIN) + flower(630, 505) + flower(655, 505) +
  line('M70,885 L780,885') + [150, 330, 500, 700].map(x => grass(x, 885)).join('')});
