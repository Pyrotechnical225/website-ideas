import * as x1 from '../src/xmas1.mjs';
import * as x2 from '../src/xmas2.mjs';
import * as x3 from '../src/xmas3.mjs';
import {star, moon, withPalette} from '../src/kit.mjs';
import {snowflake} from '../src/kit2.mjs';

const base = {eye: '#fff', cheek: '#ffb3c1', snow: '#fff', star: '#ffd23f', skin: '#ffd8a8', nose: '#ff8787'};
export default {
  fileName: 'My First Christmas', slug: 'my-first-christmas', title: 'My First Christmas', coverSubtitle: 'Colouring Book for Toddlers',
  titlePicture: 'christmasTree',
  order: ['fatherChristmas', 'christmasTree', 'snowman', 'reindeer', 'presents', 'stocking', 'gingerbreadMan', 'elf', 'penguin', 'candyCane',
    'bauble', 'sleigh', 'polarBear', 'wreath', 'bigStar', 'robin', 'gingerbreadHouse', 'bells', 'teddyBear', 'hotCocoa',
    'mittens', 'toyTrain', 'angel', 'candles', 'snowGlobe', 'toySoldier', 'holly', 'pudding', 'cracker', 'snowflakes'],
  pictures: {...x1, ...x2, ...x3},
  cover: {
    sky: '#1c3f7a', ground: '#f8f9fa', groundDrop: 95, titleColour: '#ffd23f', badgeColour: '#e03131', spineColour: '#e03131', textColour: '#ffffff',
    decor: ({backX, fx}) => withPalette(base, () => [[fx + 90, 100], [fx + 790, 70], [fx + 50, 420], [backX + 80, 120], [backX + 780, 200]].map(([x, y], i) => i % 2 ? star(x, y, 26) : snowflake(x, y, 30).replace(/stroke="#000"/g, 'stroke="#fff"')).join('') + moon(backX + 700, 110, 40)),
    tiles: [
      {key: 'fatherChristmas', bg: '#e7f5ff', palette: {...base, suit: '#e03131', fur: '#fff', beard: '#fff', moustache: '#fff', hat: '#e03131', bobble: '#fff', belt: '#343a40', buckle: '#ffd23f', boots: '#343a40', mitten: '#343a40'}},
      {key: 'christmasTree', bg: '#fff9db', palette: {...base, tree: '#40c057', trunk: '#8d5a2b', pot: '#e03131', bauble: '#ff6b6b', present: '#4dabf7', present2: '#f783ac'}},
      {key: 'snowman', bg: '#e3fafc', palette: {...base, carrot: '#ff922b', scarf: '#e03131', hat: '#343a40', band: '#e03131'}},
      {key: 'reindeer', bg: '#fff4e6', palette: {...base, body: '#b07a4f', head: '#b07a4f', ear: '#b07a4f', belly: '#f1dcc4', nose: '#5c3d2e', collar: '#2f9e44', bell: '#ffd23f', hoof: '#495057'}},
    ],
    backHeading: 'Merry Colouring!',
    backLines: ['Father Christmas, snowmen, reindeer, presents', 'and more — 30 festive pictures with thick, easy lines,', 'made for little hands and first crayons.'],
    thumbs: ['gingerbreadMan', 'penguin', 'presents'],
    bullets: ['One picture per page, blank on the back', 'Each picture named to learn new words', 'Large 8.5 × 11 in pages', '“Well done!” certificate at the end'],
  },
  listing: {
    subtitle: 'Christmas Colouring Book for Toddlers: 30 Big & Simple Festive Pictures — Father Christmas, Snowmen, Reindeer and More (Ages 2–5)',
    seriesNumber: 'Book 4',
    categories: ['Children’s Books → Activities, Crafts & Games → Colouring', 'Children’s Books → Holidays & Celebrations → Christmas'],
    keywords: ['christmas colouring book for toddlers', 'christmas activity book ages 2-4', 'stocking filler for toddlers', 'first christmas colouring book', 'big simple christmas colouring pages', 'snowman reindeer colouring book', 'christmas gift for 2 year old'],
    description: `Get ready for Christmas with 30 festive pictures made just for little hands!

Every page has big, simple shapes and thick lines, perfect for toddlers holding their first crayons.

Inside you'll find:
• Father Christmas, a reindeer, a snowman, an elf and an angel
• A Christmas tree, presents, stockings, baubles, bells and a wreath
• A gingerbread man and gingerbread house, candy canes, hot cocoa and Christmas pudding
• Winter friends: a penguin, a polar bear and a robin, plus a toy train, teddy bear and snow globe

Made for toddlers:
• One picture per page with a blank back, so pens don't bleed through
• Every picture is named in big outline letters, so children learn new words as they colour
• Large 8.5 × 11 inch pages
• A "This book belongs to" page, a colour-test page and a "Well done!" certificate at the end

The perfect stocking filler for children aged 2 to 5.`,
    extraNote: 'Publish by late October so the paperback is live and selling in time for the Christmas rush (approval usually takes up to 72 hours).',
  },
};
