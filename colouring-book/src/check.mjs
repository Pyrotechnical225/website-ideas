// Verifies the PDFs against KDP paperback requirements.
import fs from 'node:fs';
import {PDFDocument, PDFName} from 'pdf-lib';
const specs=JSON.parse(fs.readFileSync('out/specs.json','utf8'));
let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log(c?'PASS':'FAIL',m);};
const near=(a,b)=>Math.abs(a-b)<0.6;   // points
const fontsEmbedded=bytes=>{const s=Buffer.from(bytes).toString('latin1');return{fonts:(s.match(/\/Type\s*\/Font\b/g)||[]).length,files:(s.match(/\/FontFile[23]?\b/g)||[]).length};};

const iBytes=fs.readFileSync('out/interior.pdf');const interior=await PDFDocument.load(iBytes);
const n=interior.getPageCount();
ok(n===specs.pages,`interior has ${n} pages`);
ok(n>=24&&n%2===0,'page count is even and at least 24 (KDP paperback minimum)');
ok(interior.getPages().every(p=>near(p.getWidth(),612)&&near(p.getHeight(),792)),'every page is exactly 8.5 × 11 in (no bleed)');
const fi=fontsEmbedded(iBytes);ok(fi.fonts===0,'interior uses no fonts — all text is drawn outlines, so nothing can be missing');
ok(!Buffer.from(iBytes).toString('latin1').includes('/Encrypt'),'interior is not password-protected');
ok(iBytes.length<650*1024*1024,`interior size ${(iBytes.length/1024/1024).toFixed(1)} MB (KDP limit 650 MB)`);

const cBytes=fs.readFileSync('out/cover.pdf');const cover=await PDFDocument.load(cBytes);
const [cw,ch]=specs.coverInches;const p=cover.getPage(0);
ok(cover.getPageCount()===1,'cover is a single page');
ok(near(p.getWidth(),cw*72)&&near(p.getHeight(),ch*72),`cover is ${(p.getWidth()/72).toFixed(4)} × ${(p.getHeight()/72).toFixed(4)} in (expected ${cw} × ${ch})`);
ok(Math.abs(specs.spineInches-n*0.002252)<0.0001,`spine ${specs.spineInches} in = ${n} pages × 0.002252 in (white paper)`);
const fc=fontsEmbedded(cBytes);ok(fc.fonts===0,'cover uses no fonts — all text is drawn outlines');
console.log(bad?`${bad} FAILED`:'ALL KDP FILE CHECKS PASSED');process.exit(bad?1:0);
