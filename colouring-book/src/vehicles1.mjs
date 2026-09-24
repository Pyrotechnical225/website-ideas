// Vehicles 1–10. Each returns { label, scene } — all original, generic designs (no brands or logos).
import {rect, circle, ellipse, path, line, dot, wheel, face, cloud, sun, bird, tree, hill, grass, flower, road, THIN} from './kit.mjs';

export const car = () => ({label: 'Car', scene:
  sun(690, 330) + cloud(220, 350, 1.1) + cloud(470, 420, .8) + tree(130, 885, 1) +
  path('M180,800 L180,725 Q180,700 205,700 L270,700 L338,592 Q345,582 358,582 L525,582 Q538,582 546,592 L618,700 L665,700 Q700,700 700,735 L700,800 Q700,822 678,822 L202,822 Q180,822 180,800 Z', 'body') +
  path('M292,700 L348,610 L425,610 L425,700 Z', 'window', THIN) + path('M445,610 L520,610 L578,700 L445,700 Z', 'window', THIN) +
  line('M435,705 L435,815', THIN) + rect(455, 728, 36, 10, 5, 'trim', THIN) + rect(250, 728, 36, 10, 5, 'trim', THIN) +
  circle(684, 740, 13, 'light', THIN) + rect(183, 728, 12, 30, 4, 'light2', THIN) +
  face(503, 655, .8, {cheeks: false}) +
  wheel(300, 822, 62) + wheel(580, 822, 62) + road()});

export const bus = () => ({label: 'Bus', scene:
  cloud(210, 300, 1) + cloud(640, 290, .9) + bird(430, 290) + bird(480, 315, .8) +
  rect(140, 380, 580, 440, 34, 'body') + line('M140,545 L720,545') + line('M140,700 L720,700', THIN) +
  [165, 270, 375, 480].map(x => rect(x, 410, 88, 100, 14, 'window', THIN)).join('') + rect(585, 410, 110, 100, 14, 'window', THIN) +
  [165, 270, 375].map(x => rect(x, 575, 88, 100, 14, 'window', THIN)).join('') +
  rect(595, 575, 100, 225, 12, 'door', THIN) + line('M645,585 L645,790', THIN) +
  rect(480, 575, 88, 100, 14, 'window', THIN) + face(524, 622, .8, {cheeks: false}) +
  circle(700, 760, 14, 'light', THIN) + rect(250, 725, 200, 50, 10, 'sign', THIN) + line('M275,750 L425,750', THIN) +
  wheel(270, 822, 60) + wheel(580, 822, 60) + road()});

export const fireEngine = () => ({label: 'Fire Engine', scene:
  cloud(640, 300, 1) + sun(170, 310, 40) +
  // ladder on top
  rect(150, 470, 430, 40, 8, 'ladder', THIN) + [190, 240, 290, 340, 390, 440, 490, 540].map(x => line(`M${x},470 L${x},510`, THIN)).join('') +
  rect(130, 540, 460, 270, 20, 'body') +
  path('M590,810 L590,505 Q590,485 612,485 L680,485 Q700,485 710,505 L740,600 L740,790 Q740,810 720,810 Z', 'cab') +
  path('M612,510 L675,510 L705,600 L612,600 Z', 'window', THIN) + face(652, 548, .7, {cheeks: false}) +
  rect(160, 575, 110, 90, 12, 'locker', THIN) + rect(290, 575, 110, 90, 12, 'locker', THIN) + rect(420, 575, 140, 90, 12, 'locker', THIN) +
  rect(160, 690, 400, 30, 8, 'stripe', THIN) +
  rect(625, 450, 60, 35, 10, 'siren', THIN) + line('M640,440 L630,425 M655,437 L655,420 M670,440 L680,425', 4) +
  circle(726, 745, 14, 'light', THIN) +
  path('M160,720 Q140,760 175,780', 'hose', THIN) +
  wheel(255, 815, 62) + wheel(640, 815, 62) + road()});

export const policeCar = () => ({label: 'Police Car', scene:
  cloud(200, 330, 1) + cloud(650, 350, .8) + tree(730, 885, .9) +
  rect(410, 540, 70, 36, 12, 'siren', THIN) + line('M430,528 L420,510 M445,525 L445,505 M460,528 L470,510', 4) +
  path('M160,800 L160,715 Q160,690 185,690 L260,690 L325,590 Q332,578 346,578 L545,578 Q558,578 566,590 L632,690 L672,690 Q700,690 700,720 L700,800 Q700,822 678,822 L182,822 Q160,822 160,800 Z', 'body') +
  path('M280,690 L338,600 L432,600 L432,690 Z', 'window', THIN) + path('M452,600 L540,600 L596,690 L452,690 Z', 'window', THIN) +
  rect(168, 725, 525, 40, 6, 'stripe', THIN) + [230, 330, 430, 530, 630].map(x => rect(x, 725, 50, 40, 0, 'check', THIN)).join('') +
  line('M442,695 L442,815', THIN) + circle(686, 742, 12, 'light', THIN) +
  face(520, 645, .75, {cheeks: false}) +
  wheel(285, 822, 60) + wheel(575, 822, 60) + road()});

export const ambulance = () => ({label: 'Ambulance', scene:
  cloud(220, 300, .9) + sun(660, 300, 40) + bird(420, 320) +
  rect(130, 470, 440, 345, 24, 'body') +
  path('M570,815 L570,540 Q570,520 590,520 L660,520 Q684,520 694,542 L735,640 L735,795 Q735,815 715,815 Z', 'cab') +
  path('M592,545 L655,545 L695,640 L592,640 Z', 'window', THIN) + face(637, 585, .7, {cheeks: false}) +
  rect(260, 420, 90, 50, 14, 'siren', THIN) + line('M275,410 L265,392 M305,405 L305,385 M335,410 L345,392', 4) +
  path('M350,700 C250,640 250,555 305,548 C330,545 345,560 350,578 C355,560 370,545 395,548 C450,555 450,640 350,700 Z', 'heart', THIN) +
  rect(150, 735, 400, 30, 8, 'stripe', THIN) + rect(460, 520, 80, 190, 10, 'door', THIN) +
  circle(722, 750, 13, 'light', THIN) +
  wheel(255, 815, 60) + wheel(640, 815, 60) + road()});

export const tractor = () => ({label: 'Tractor', scene:
  sun(170, 320, 42) + cloud(560, 300, 1) + hill(60, 420, 885, 110) + hill(380, 800, 885, 80) +
  path('M300,760 L300,600 Q300,580 320,580 L470,580 L470,760 Z', 'cab') + rect(320, 600, 130, 110, 12, 'window', THIN) +
  rect(290, 560, 200, 26, 10, 'roof', THIN) +
  path('M470,760 L470,650 L660,650 Q690,650 690,680 L690,760 Z', 'bonnet') + line('M520,665 L520,745 M560,665 L560,745 M600,665 L600,745', THIN) +
  rect(610, 590, 26, 62, 8, 'exhaust', THIN) + circle(632, 565, 12, 'puff', 4) + circle(655, 540, 16, 'puff', 4) +
  face(385, 645, .8, {cheeks: false}) +
  wheel(365, 800, 110) + wheel(630, 832, 55) +
  [150, 720, 780].map(x => grass(x, 885)).join('') + flower(110, 885)});

export const digger = () => ({label: 'Digger', scene:
  cloud(640, 290, 1) + bird(200, 300) + bird(250, 325, .8) +
  // arm and bucket
  path('M470,600 L560,420 L600,440 L520,620 Z', 'arm') + path('M560,420 L700,520 L680,545 L585,478 Z', 'arm') +
  path('M690,515 L745,600 Q750,640 710,650 L655,650 Q660,600 690,515 Z', 'bucket') + line('M665,650 L665,672 M690,650 L690,672 M715,648 L718,668', THIN) +
  circle(560, 425, 11, 'hub', 4) + circle(695, 525, 11, 'hub', 4) +
  // body + cab
  rect(180, 610, 380, 120, 18, 'body') + path('M220,610 L220,470 Q220,450 240,450 L380,450 Q400,450 405,470 L430,610 Z', 'cab') +
  path('M245,475 L375,475 L395,590 L245,590 Z', 'window', THIN) + face(320, 525, .85, {cheeks: false}) +
  rect(470, 575, 24, 40, 6, 'exhaust', THIN) +
  // tracks
  rect(160, 735, 420, 110, 55, 'track') + [215, 300, 385, 470, 525].map(x => circle(x, 790, x === 215 || x === 525 ? 38 : 26, 'hub', THIN)).join('') +
  path('M60,885 L780,885', 'ground') + path('M620,885 Q690,820 770,885 Z', 'dirt', THIN) + [100, 150].map(x => grass(x, 885)).join('')});

export const dumpTruck = () => ({label: 'Dump Truck', scene:
  sun(660, 300, 40) + cloud(230, 310, .9) +
  path('M120,720 L120,560 L150,520 L520,520 L520,720 Z', 'tipper') + line('M170,560 L480,560 M170,610 L480,610 M170,660 L480,660', THIN) +
  circle(215, 505, 30, 'rock', THIN) + circle(275, 495, 36, 'rock', THIN) + circle(340, 505, 28, 'rock', THIN) + circle(400, 500, 32, 'rock', THIN) +
  path('M530,760 L530,560 Q530,540 550,540 L650,540 Q672,540 682,560 L720,650 L720,760 Z', 'cab') +
  path('M552,565 L645,565 L682,650 L552,650 Z', 'window', THIN) + face(612, 603, .75, {cheeks: false}) +
  rect(110, 720, 620, 50, 14, 'chassis') + circle(708, 700, 12, 'light', THIN) +
  wheel(230, 800, 70) + wheel(420, 800, 70) + wheel(630, 800, 70) + road(885)});

export const cementMixer = () => ({label: 'Cement Mixer', scene:
  cloud(200, 300, 1) + cloud(640, 330, .8) + bird(430, 300) +
  // drum
  path('M150,560 Q140,470 250,440 L470,420 Q540,440 540,560 Q540,680 470,700 L250,680 Q140,650 150,560 Z', 'drum') +
  line('M230,450 Q280,560 230,675 M310,440 Q360,560 310,690 M390,428 Q440,560 390,698', THIN) + path('M120,540 L160,520 L165,600 L120,600 Z', 'chute', THIN) +
  path('M560,760 L560,540 Q560,520 580,520 L660,520 Q684,520 694,542 L730,640 L730,760 Z', 'cab') +
  path('M582,545 L655,545 L692,640 L582,640 Z', 'window', THIN) + face(630, 585, .72, {cheeks: false}) +
  rect(130, 710, 600, 55, 14, 'chassis') + rect(250, 680, 30, 35, 4, 'stand', THIN) + rect(430, 690, 30, 25, 4, 'stand', THIN) +
  circle(716, 690, 12, 'light', THIN) +
  wheel(230, 800, 64) + wheel(380, 800, 64) + wheel(640, 800, 64) + road(885)});

export const bulldozer = () => ({label: 'Bulldozer', scene:
  sun(170, 310, 40) + cloud(600, 320, 1) +
  path('M630,520 Q690,560 700,690 L735,720 L735,760 L620,760 Q640,640 630,520 Z', 'blade') + line('M650,560 Q672,640 668,740', THIN) +
  rect(560, 640, 80, 26, 8, 'arm', THIN) +
  rect(170, 600, 420, 140, 18, 'body') + path('M250,600 L250,460 Q250,440 270,440 L410,440 Q430,440 432,460 L445,600 Z', 'cab') +
  rect(272, 465, 145, 110, 12, 'window', THIN) + face(345, 515, .85, {cheeks: false}) + rect(500, 545, 24, 58, 6, 'exhaust', THIN) +
  line('M200,640 L540,640', THIN) + rect(460, 620, 90, 40, 10, 'grille', THIN) +
  rect(150, 740, 460, 110, 55, 'track') + [205, 290, 375, 460, 555].map(x => circle(x, 795, x === 205 || x === 555 ? 40 : 26, 'hub', THIN)).join('') +
  path('M60,885 L780,885', 'ground') + [90, 130].map(x => grass(x, 885)).join('') + path('M680,885 Q730,845 780,885 Z', 'dirt', THIN)});
