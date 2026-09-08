import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import sharp from 'sharp';
import {astronomyWing} from '../app/letter-kit/astronomy-wing.ts';
const json=n=>JSON.parse(readFileSync(new URL(`../app/letter-kit/${n}.json`,import.meta.url),'utf8'));
const kit=json('glyphs'),script=json('cursive-glyphs');
const {pieces,ports}=astronomyWing(kit,script);
const mask=async(selected,box=[50,70,850,460],scale=1)=>sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}" width="${Math.round(box[2]*scale)}" height="${Math.round(box[3]*scale)}"><g fill-rule="evenodd" stroke-linecap="round">${selected.map(p=>`<path d="${p.d}" transform="${p.transform||''}" fill="${p.fill||'black'}" stroke="${p.strokeWidth?'black':'none'}" stroke-width="${p.strokeWidth||0}"/>`).join('')}</g></svg>`)).ensureAlpha().extractChannel('alpha').raw().toBuffer();
test('the original wing retains the approved letter outlines with deterministic placements',()=>{
 assert.deepEqual(astronomyWing(kit,script).pieces,pieces);assert.ok(pieces.filter(p=>p.kind==='capital').length>65);assert.ok(pieces.filter(p=>p.kind==='stair').length>15);
 for(const p of pieces.filter(p=>p.glyph))assert.equal(p.d,p.kind==='capital'?kit.find(g=>g.id===p.glyph).d:script.glyphs[p.glyph].d);
});
test('every passage end overlaps its terminal letter at small, native, and enlarged scales',async()=>{
 for(const [key,port] of Object.entries(ports))for(const scale of [.4,1,4]){
  const box=[port.x-8,port.y-8,16,16],a=await mask(pieces.filter(p=>p.kind==='capital'),box,scale),b=await mask(pieces.filter(p=>p.kind==='quill'),box,scale);
  assert.ok(a.some((v,i)=>v>128&&b[i]>128),`${key} join at ${scale}`);
 }
});
test('stair ink clears all capital and cursive ink in the new section',async()=>{
 const a=await mask(pieces.filter(p=>p.kind==='stair')),b=await mask(pieces.filter(p=>p.glyph));let overlap=0;for(let i=0;i<a.length;i++)if(a[i]>64&&b[i]>64)overlap++;
 assert.equal(overlap,0);
});
test('the cursive wall inscription clears the architectural capitals',async()=>{
 const a=await mask(pieces.filter(p=>p.kind==='script')),b=await mask(pieces.filter(p=>p.kind==='capital'));let overlap=0;for(let i=0;i<a.length;i++)if(a[i]>64&&b[i]>64)overlap++;
 assert.equal(overlap,0);
});
