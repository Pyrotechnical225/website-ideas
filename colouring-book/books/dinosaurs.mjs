import * as d1 from '../src/dinos1.mjs';
import * as d2 from '../src/dinos2.mjs';
import * as d3 from '../src/dinos3.mjs';
import {cloud, sun} from '../src/kit.mjs';
import {withPalette} from '../src/kit.mjs';

const base = {eye: '#fff', cheek: '#ffb3c1', sun: '#ffd23f', cloud: '#fff', leaves: '#5cc16b', trunk: '#a0673c', coconut: '#8a5a2b', rock: '#b8b8b8', belly: '#fff3bf', spot: '#2f9e44', legFar: '#51cf66', body: '#69db7c', tooth: '#fff', lava: '#ff922b', volcano: '#8d6e63', egg: '#fff9db', nest: '#c49a6c'};
export default {
  slug: 'dino-friends', title: 'Dino Friends!', coverSubtitle: 'Dinosaur Colouring Book for Toddlers',
  titlePicture: 'triceratops',
  order: ['tRex', 'triceratops', 'stegosaurus', 'longNeck', 'pterodactyl', 'hatching', 'ankylosaurus', 'spinosaurus', 'dinoFamily', 'parasaurolophus',
    'velociraptor', 'volcanoPage', 'diplodocus', 'birthday', 'plesiosaurus', 'iguanodon', 'nest', 'dimetrodon', 'rainyDay', 'pachycephalosaurus',
    'allosaurus', 'footprints', 'archaeopteryx', 'lunchTime', 'fossil', 'football', 'swimming', 'iceCream', 'roar', 'sleeping'],
  pictures: {...d1, ...d2, ...d3},
  cover: {
    sky: '#7cc8f8', ground: '#7bd389', titleColour: '#ffd23f', badgeColour: '#2f9e44', spineColour: '#2f9e44', textColour: '#0b2a3c',
    decor: ({backX, fx}) => withPalette(base, () => cloud(fx + 120, 120, 1) + cloud(fx + 720, 110, .9) + cloud(backX + 700, 140, .9) + sun(backX + 120, 130, 45)),
    tiles: [
      {key: 'tRex', bg: '#fff8e1', palette: {...base, body: '#ff922b', legFar: '#fd7e14', belly: '#ffe8cc'}},
      {key: 'triceratops', bg: '#e7f5ff', palette: {...base, body: '#74c0fc', legFar: '#4dabf7', frill: '#ffa8a8', horn: '#fff3bf', spike: '#ffd43b', spot: '#1c7ed6'}},
      {key: 'stegosaurus', bg: '#f3f0ff', palette: {...base, body: '#b197fc', legFar: '#9775fa', plate: '#ff8787', spike: '#ffd43b'}},
      {key: 'longNeck', bg: '#ebfbee', palette: {...base}},
    ],
    backHeading: 'Stomp, Colour, Roar!',
    backLines: ['T-Rex, Triceratops, Stegosaurus and friends!', '30 happy dinosaurs with thick, easy lines —', 'made for little hands and first crayons.'],
    thumbs: ['stegosaurus', 'hatching', 'birthday'],
    bullets: ['One picture per page, blank on the back', 'Each picture named to learn new words', 'Large 8.5 × 11 in pages', '“Well done!” certificate at the end'],
  },
  listing: {
    subtitle: 'Dinosaur Colouring Book for Toddlers: 30 Big & Simple Dinosaurs to Colour — T-Rex, Triceratops, Stegosaurus and More (Ages 2–5)',
    seriesNumber: 'Book 2',
    categories: ['Children’s Books → Activities, Crafts & Games → Colouring', 'Children’s Books → Animals → Dinosaurs'],
    keywords: ['dinosaur colouring book for toddlers', 'dinosaur colouring book ages 2-4', 't rex colouring book for kids', 'big simple dinosaur colouring pages', 'first colouring book dinosaurs', 'preschool dinosaur activity book', 'dinosaur gift for toddlers'],
    description: `Stomp, stomp, ROAR! Meet 30 friendly dinosaurs who can't wait to be coloured in.

Every page has big, simple shapes and thick lines, perfect for little hands holding their very first crayons.

Inside you'll find:
• T-Rex, Triceratops, Stegosaurus, Brachiosaurus and Pterodactyl
• Spinosaurus, Ankylosaurus, Velociraptor and more amazing dinosaurs
• Fun dino moments: a hatching egg, a birthday party, a rainy day, dino football and a sleepy dino at bedtime

Made for toddlers:
• One picture per page with a blank back, so pens don't bleed through
• Every picture is named in big outline letters, so children learn new words as they colour
• Large 8.5 × 11 inch pages
• A "This book belongs to" page, a colour-test page and a "Well done!" certificate at the end

A roar-some gift for birthdays, Christmas and rainy days, for children aged 2 to 5.`,
  },
};
