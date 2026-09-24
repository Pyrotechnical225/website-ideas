// Page templates. Page = 8.5 × 11 in, viewBox 850 × 1100 (1 unit = 0.01 in).
// Artwork stays at least 0.6 in from every edge — inside KDP's no-bleed margins.
import {readFileSync} from 'node:fs';
import opentype from 'opentype.js';
// All text is converted to drawn outlines, so the PDFs contain no fonts at all
// (nothing for KDP to flag as missing or unembedded). Font: Fredoka, SIL Open Font Licence.
const load=f=>{const b=readFileSync(new URL('../fonts/'+f,import.meta.url));return opentype.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));};
const FONTS={600:load('fredoka-latin-600-normal.woff'),700:load('fredoka-latin-700-normal.woff')};
export const FONT_CSS='';
const decode=t=>t.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
// Each letter's outline is read once (in font units) and cached; placing and scaling
// is done here, so no font-library state is reused between calls.
const glyphCache=new Map();
function glyphData(weight,ch){
  const key=weight+ch;if(glyphCache.has(key))return glyphCache.get(key);
  const font=FONTS[weight],gl=font.charToGlyph(ch);
  if(gl.index===0&&ch!==' ')throw new Error(`Character "${ch}" is missing from the font`);
  const upm=font.unitsPerEm,cmds=gl.getPath(0,0,upm).commands.map(c=>({...c}));
  const data={advance:gl.advanceWidth/upm,cmds:cmds.map(c=>{const o={type:c.type};for(const k of ['x','y','x1','y1','x2','y2'])if(k in c)o[k]=c[k]/upm;return o;})};
  if(!Number.isFinite(data.advance)||JSON.stringify(data).includes('null'))throw new Error(`Unreadable letter "${ch}"`);
  glyphCache.set(key,data);return data;
}
const n2=v=>(Math.round(v*100)/100).toString();
export function textShape(text,x,y,size,{weight=600,anchor='middle'}={}){
  const wt=weight>=700?700:600,clean=decode(String(text));
  const glyphs=[...clean].map(ch=>glyphData(wt,ch));
  const w=glyphs.reduce((n,gl)=>n+gl.advance*size,0);
  let pen=anchor==='middle'?x-w/2:anchor==='end'?x-w:x,d='';
  for(const gl of glyphs){
    for(const c of gl.cmds){
      const X=v=>n2(pen+v*size),Y=v=>n2(y+v*size);
      if(c.type==='M'||c.type==='L')d+=`${c.type}${X(c.x)} ${Y(c.y)}`;
      else if(c.type==='Q')d+=`Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}`;
      else if(c.type==='C')d+=`C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}`;
      else if(c.type==='Z')d+='Z';
    }
    pen+=gl.advance*size;
  }
  if(/NaN|undefined|Infinity/.test(d)||!Number.isFinite(w))throw new Error(`Broken outline for "${clean}"`);
  return d;
}
// Outline letters children can colour in.
export const outlineText=(text,x,y,size,{weight=700,sw=6,fillc='#fff',anchor='middle'}={})=>`<path d="${textShape(text,x,y,size,{weight,anchor})}" fill="${fillc}" stroke="#000" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke"/>`;
export const solidText=(text,x,y,size,{weight=600,anchor='middle',color='#000'}={})=>`<path d="${textShape(text,x,y,size,{weight,anchor})}" fill="${color}"/>`;
export const svgPage=inner=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="8.5in" height="11in">${inner}</svg>`;
export function colouringPage(v){
  const size=v.label.length>11?84:100;
  return svgPage(outlineText(v.label,425,195,size,{sw:7})+`<g transform="translate(0,${v.shift??55})${v.scale?` translate(425,600) scale(${v.scale}) translate(-425,-600)`:''}">${v.scene}</g>`);
}
