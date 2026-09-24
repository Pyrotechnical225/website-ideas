// Renders chosen pages to PNG for checking. Usage: node src/preview.mjs <module> [name...]
import {chromium} from 'playwright';
import {FONT_CSS,colouringPage} from './page.mjs';
const mod=await import('./'+process.argv[2]+'.mjs');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:850,height:1100}});
const names=Object.keys(mod);
const html=`<style>${FONT_CSS}body{margin:0;display:flex;flex-wrap:wrap;width:${425*5}px;background:#999}svg{width:425px;height:550px;background:#fff;outline:1px solid #999}</style>`+names.map(n=>colouringPage(mod[n]())).join('');
await p.setViewportSize({width:425*5,height:550*Math.ceil(names.length/5)});
await p.setContent(html);await p.waitForTimeout(400);
await p.screenshot({path:`preview/${process.argv[2]}.png`,fullPage:true});
await b.close();console.log('preview/'+process.argv[2]+'.png',names.length,'pages');
