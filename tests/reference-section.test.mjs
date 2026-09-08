import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import sharp from 'sharp';import {fileURLToPath} from 'node:url';
const meta=JSON.parse(readFileSync(new URL('../app/map-sections/reference-section.json',import.meta.url),'utf8'));
const svg=fileURLToPath(new URL('../public/study/reference-section.svg',import.meta.url));
void test('the central circle contains no added ink',async()=>{
 const scale=meta.sourceOrientedSize[0]/1650,x=Math.round((1090-meta.crop1650[0])*scale),y=Math.round((550-meta.crop1650[1])*scale),radius=Math.round(50*scale);
 const alpha=await sharp(svg).ensureAlpha().extract({left:x-radius,top:y-radius,width:radius*2,height:radius*2}).extractChannel('alpha').raw().toBuffer();
 assert.ok(alpha.every(v=>v===0));
});
void test('drawing and source photograph share an identical coordinate frame',async()=>{
 const drawing=await sharp(svg).metadata(),photo=await sharp(fileURLToPath(new URL('../public/study/reference-section-photo.jpg',import.meta.url))).metadata();
 assert.equal(drawing.width,meta.width);assert.equal(drawing.height,meta.height);assert.equal(photo.width,drawing.width);assert.equal(photo.height,drawing.height);
});
for(const name of ['clock-halls','stairwell']){
 void test(`${name}: photo and SVG retain matching dimensions`,async()=>{
  const metadata=JSON.parse(readFileSync(new URL(`../app/map-sections/${name}.json`,import.meta.url),'utf8'));
  const art=await sharp(fileURLToPath(new URL(`../public/study/${name}.svg`,import.meta.url))).metadata();
  const photo=await sharp(fileURLToPath(new URL(`../public/study/${name}-photo.jpg`,import.meta.url))).metadata();
  assert.deepEqual([art.width,art.height],[metadata.width,metadata.height]);
  assert.deepEqual([photo.width,photo.height],[art.width,art.height]);
 });
}
void test('the new open stair retains its empty centre',async()=>{
 const m=JSON.parse(readFileSync(new URL('../app/map-sections/stairwell.json',import.meta.url),'utf8'));
 const s=m.sourceOrientedSize[0]/1650;
 const alpha=await sharp(fileURLToPath(new URL('../public/study/stairwell.svg',import.meta.url))).ensureAlpha().extract({left:Math.round((1063-m.crop1650[0])*s),top:Math.round((1363-m.crop1650[1])*s),width:Math.round(20*s),height:Math.round(20*s)}).extractChannel('alpha').raw().toBuffer();
 assert.ok(alpha.every(v=>v===0),'a paper mark or added drawing entered the stair void');
});
