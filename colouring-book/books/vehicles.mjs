// Settings for the first book, used for its free sample pack (the book itself is built by src/build.mjs).
import * as v1 from '../src/vehicles1.mjs';
import * as v2 from '../src/vehicles2.mjs';
import * as v3 from '../src/vehicles3.mjs';
import {ORDER} from '../src/build-order.mjs';

export default {
  fileName: 'Things That Go', slug: 'things-that-go', title: 'Things That Go!',
  sample: {theme: 'Vehicle', pages: ['fireEngine', 'digger', 'bus', 'tractor', 'train'], teaser: ['car', 'rocket', 'helicopter', 'policeCar', 'iceCreamVan', 'monsterTruck'], search: 'Things That Go Colouring Book for Toddlers'},
  order: ORDER,
  pictures: {...v1, ...v2, ...v3},
};
