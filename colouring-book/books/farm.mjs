import * as f1 from '../src/farm1.mjs';
import * as f2 from '../src/farm2.mjs';
import * as f3 from '../src/farm3.mjs';
import {cloud, sun, withPalette} from '../src/kit.mjs';

const base = {eye: '#fff', cheek: '#ffb3c1', sun: '#ffd23f', cloud: '#fff', bubble: '#fff', leaves: '#5cc16b', trunk: '#a0673c', hoof: '#495057', belly: '#fff', grass: '#8ce99a', fence: '#e9c46a', hill: '#8ce99a'};
export default {
  fileName: 'Moo Oink Baa', slug: 'moo-oink-baa', title: 'Moo! Oink! Baa!', coverSubtitle: 'Farm Animals Colouring Book for Toddlers',
  titlePicture: 'barn',
  order: ['cow', 'pig', 'sheep', 'hen', 'barn', 'chick', 'duck', 'horse', 'farmTractor', 'goat',
    'donkey', 'rooster', 'cat', 'dog', 'farmer', 'rabbit', 'turkey', 'goose', 'appleTree', 'mouse',
    'owl', 'frog', 'vegetablePatch', 'bee', 'lamb', 'scarecrow', 'duckPond', 'hayBales', 'eggBasket', 'goodnight'],
  pictures: {...f1, ...f2, ...f3},
  cover: {
    sky: '#8fd3ff', ground: '#8ce99a', titleColour: '#ffd23f', badgeColour: '#e8590c', spineColour: '#e8590c', textColour: '#0b2a3c',
    decor: ({backX, fx}) => withPalette(base, () => cloud(fx + 120, 120, 1) + cloud(fx + 720, 110, .9) + cloud(backX + 700, 140, .9) + sun(backX + 120, 130, 45)),
    tiles: [
      {key: 'cow', bg: '#fff8e1', palette: {...base, body: '#fff', head: '#fff', spot: '#343a40', ear: '#fff', horn: '#fff3bf', muzzle: '#ffc9c9', tail: '#343a40'}},
      {key: 'pig', bg: '#fff0f6', palette: {...base, body: '#ffc9e3', head: '#ffc9e3', ear: '#faa2c1', snout: '#faa2c1', belly: '#ffdeeb', mud: '#b08968', hoof: '#e64980'}},
      {key: 'sheep', bg: '#e7f5ff', palette: {...base, wool: '#fff', face: '#495057', ear: '#495057', leg: '#495057', petal: '#ff8fb1', flowerMid: '#ffd23f'}},
      {key: 'hen', bg: '#ebfbee', palette: {...base, body: '#ffec99', tail: '#ffa94d', wing: '#ffd43b', comb: '#fa5252', beak: '#ff922b', wattle: '#fa5252'}},
    ],
    backHeading: 'Hello, Farm Friends!',
    backLines: ['Cows, pigs, sheep, hens, ducks and more —', 'each one says its sound: “Moo!”, “Oink!”, “Baa!”', 'Big, simple pictures for first crayons.'],
    thumbs: ['duck', 'barn', 'rabbit'],
    bullets: ['One picture per page, blank on the back', 'Learn animal names and sounds', 'Large 8.5 × 11 in pages', '“Well done!” certificate at the end'],
  },
  listing: {
    subtitle: 'Farm Animals Colouring Book for Toddlers: 30 Big & Simple Pictures with Animal Sounds — Cows, Pigs, Sheep, Tractors and More (Ages 2–5)',
    seriesNumber: 'Book 3',
    categories: ['Children’s Books → Activities, Crafts & Games → Colouring', 'Children’s Books → Animals → Farm Animals'],
    keywords: ['farm animals colouring book for toddlers', 'toddler colouring book age 2', 'animal sounds book for toddlers', 'big simple colouring pages farm', 'cow pig sheep colouring book', 'first colouring book preschool', 'farm gift for toddlers'],
    description: `Moo! Oink! Baa! Welcome to the farm, where 30 friendly animals are waiting to be coloured in.

Every animal says its sound in a big speech bubble, so little ones can learn names and noises while they colour.

Inside you'll find:
• Cows, pigs, sheep, lambs, horses, goats and donkeys
• Hens, chicks, a rooster, ducks, geese and a turkey
• Farm friends like a cat, dog, rabbit, mouse, owl, frog and bumblebee
• The big red barn, a tractor, a farmer, a scarecrow, an apple tree and a duck pond

Made for toddlers:
• One picture per page with a blank back, so pens don't bleed through
• Big, simple shapes with thick lines, perfect for first crayons
• Large 8.5 × 11 inch pages
• A "This book belongs to" page, a colour-test page and a "Well done!" certificate at the end

A lovely gift for animal-loving children aged 2 to 5.`,
  },
};
