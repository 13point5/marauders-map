import test from 'node:test';
import assert from 'node:assert/strict';
import metrics from '../app/estate/letter-metrics.json' with {type:'json'};
import {arc,path,length,rounded,fittedLetters,places} from '../app/estate/geometry.ts';

void test('wall lettering reserves both end bearings across short and long runs',()=>{
 for(const italic of [false,true])for(const span of [18,40,100,600]){
  const text=fittedLetters(span,10,italic,2),m=italic?metrics.italic:metrics.regular;
  const used=text.split('').reduce((n,c)=>n+(m[c]??.5)*10,0);
  assert.ok(used<=span-8+.0001);
 }
});
void test('rounded quill returns retain endpoints without touching the sharp corner',()=>{
 const points=rounded([[0,0],[100,0],[100,100]],6);
 assert.deepEqual(points[0],[0,0]);assert.deepEqual(points.at(-1),[100,100]);
 assert.ok(!points.some(([x,y])=>x===100&&y===0));
 assert.ok(length(points)<200);
});
void test('arc serialization is bounded and precise enough for identical client/server paths',()=>{
 const ring=arc(1050,220,145,100,350);
 assert.ok(ring.every(([x,y])=>Math.abs(Math.hypot(x-1050,y-220)-145)<1e-9));
 assert.ok(!/\.\d{3}/.test(path(ring)));
});
void test('the estate has exactly one identity for each destination',()=>{
 assert.equal(places.length,8);assert.equal(new Set(places.map(p=>p.id)).size,8);
 assert.equal(places.filter(p=>p.id==='hall').length,1);
 assert.equal(places.filter(p=>p.id==='library').length,1);
});
