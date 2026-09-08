import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {buildEntrance,quillLine} from '../app/letter-kit/entrance-variants.ts';
const kit=JSON.parse(readFileSync(new URL('../app/letter-kit/glyphs.json',import.meta.url),'utf8'));
for(const name of ['quiet','lettered','stepped'])test(`${name}: entrance capitals retain the shared glyph contours and proportions`,()=>{
 const pieces=buildEntrance(kit,name),letters=pieces.filter(p=>p.glyph),lines=pieces.filter(p=>!p.glyph);
 assert.ok(letters.length>=3&&lines.length>=4);
 for(const p of letters){assert.equal(p.d,kit.find(g=>g.id===p.glyph).d);assert.match(p.transform,/scale\([\d.]+\)/);}
 for(const p of lines){assert.ok(p.d.endsWith('Z'));assert.ok(!p.d.includes('NaN'));assert.equal(p.strokeWidth,undefined);}
});
test('the three alternatives have different layouts, using deterministic filled pen strokes',()=>{
 const variants=['quiet','lettered','stepped'].map(v=>JSON.stringify(buildEntrance(kit,v)));assert.equal(new Set(variants).size,3);
 assert.equal(quillLine([[0,0],[50,0],[50,50]]),quillLine([[0,0],[50,0],[50,50]]));
});
