import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPlan,overlaps,glyphCorners} from '../app/letter-kit/layout.ts';
const glyphs=JSON.parse(readFileSync(new URL('../app/letter-kit/glyphs.json',import.meta.url),'utf8'));
for(const plan of ['observatory','gallery'])for(const seed of [13,14,15,16])test(`${plan}, seed ${seed}: separated letters and clear stair treads`,()=>{
 const {placed,stairs}=buildPlan(plan,glyphs,seed);
 assert.ok(placed.length>100);assert.ok(stairs.length>3);
 for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++)assert.equal(overlaps(placed[i].corners,placed[j].corners),false,`letters ${i} and ${j} overlap`);
 for(const {a,b} of stairs){const box=glyphCorners((a.x+b.x)/2,(a.y+b.y)/2,Math.hypot(b.x-a.x,b.y-a.y),1,Math.atan2(b.y-a.y,b.x-a.x),.4);assert.ok(placed.every(p=>!overlaps(box,p.corners)))}
});
test('new geometry and lettering vary independently',()=>{
 const a=buildPlan('observatory',glyphs,13),b=buildPlan('observatory',glyphs,14),c=buildPlan('gallery',glyphs,13);
 assert.deepEqual(a,buildPlan('observatory',glyphs,13));
 assert.notDeepEqual(a.placed.map(p=>p.glyph.id),b.placed.map(p=>p.glyph.id));
 assert.notDeepEqual(a.placed.map(p=>[p.x,p.y]),c.placed.map(p=>[p.x,p.y]));
});
