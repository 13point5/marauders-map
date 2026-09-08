import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reconstructTower} from '../app/letter-kit/reconstruction.ts';
const json=name=>JSON.parse(readFileSync(new URL(`../app/letter-kit/${name}.json`,import.meta.url),'utf8'));
const kit=json('glyphs'),font=json('cursive-glyphs'),layout=json('reference-layout');
test('reconstructed capital contours come exclusively from the reusable kit',()=>{
 const pieces=reconstructTower(kit,font,layout),capitals=pieces.filter(p=>p.kind==='capital');
 assert.equal(capitals.length,71);
 assert.ok(new Set(capitals.map(p=>p.glyph)).size<=14);
 for(const p of capitals)assert.equal(p.d,kit.find(g=>g.id===p.glyph).d);
 assert.equal(pieces.filter(p=>p.kind==='stair').length,62);
 assert.ok(pieces.every(p=>!p.transform||!p.transform.includes('NaN')));
});
test('replacing a reusable glyph updates every occurrence without changing placement',()=>{
 const before=reconstructTower(kit,font,layout);
 const changed=kit.map(g=>g.id==='A'?{...g,d:'M0 0L10 0L5 10Z'}:g);
 const after=reconstructTower(changed,font,layout);
 assert.ok(before.filter(p=>p.kind==='capital'&&p.glyph==='A').length>1);
 for(let i=0;i<before.length;i++){
  assert.equal(before[i].transform,after[i].transform);
  if(before[i].kind==='capital'&&before[i].glyph==='A')assert.notEqual(before[i].d,after[i].d);
  else assert.deepEqual(before[i],after[i]);
 }
});
