import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {clearStair,letterBox,inside} from '../app/letter-kit/clearance.ts';
import {reconstructTower} from '../app/letter-kit/reconstruction.ts';
const json=n=>JSON.parse(readFileSync(new URL(`../app/letter-kit/${n}.json`,import.meta.url),'utf8'));
const kit=json('glyphs'),font=json('cursive-glyphs'),layout=json('reference-layout');
test('complete unique capital and cursive alphabets with bounded vector ink',()=>{
 for(const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')assert.ok(kit.find(g=>g.id===c)?.d.length>20,c);
 for(const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'){
  const g=font.glyphs[c];assert.ok(g?.d.length>20,c);assert.ok(g.advance>0);
  assert.ok(g.bounds[2]>g.bounds[0]&&g.bounds[3]>g.bounds[1]);
 }
 assert.equal(new Set(Object.values(font.glyphs).filter(g=>g.d).map(g=>g.d)).size,52);
});
test('clipping works for endpoint contact, internal crossings, rotations and fully blocked stairs',()=>{
 const a={x:0,y:0},b={x:100,y:0};
 const endpoint=clearStair(a,b,[letterBox(100,0,20,20,0,3)]);assert.ok(endpoint.b.x<87);
 const middle=clearStair(a,b,[letterBox(30,0,20,20,Math.PI/4,3)]);assert.ok(middle.a.x>40);
 assert.equal(clearStair(a,b,[letterBox(50,0,200,40,0,3)]),null);
 assert.deepEqual(clearStair(a,b,[]),{a:{x:.05,y:0},b:{x:99.95,y:0}});
});
test('all rendered tower treads stay outside all padded letter bounds',()=>{
 const p=reconstructTower(kit,font,layout),boxes=p.filter(p=>p.bounds).map(p=>p.bounds),stairs=p.filter(p=>p.kind==='stair');
 assert.equal(stairs.length,62);
 for(const stair of stairs){
  const [x1,y1,x2,y2]=stair.d.match(/-?\d*\.?\d+/g).map(Number);
  for(let t=0;t<=1;t+=.005){const at={x:x1+(x2-x1)*t,y:y1+(y2-y1)*t};assert.ok(boxes.every(box=>!inside(at,box)),stair.d)}
 }
});
