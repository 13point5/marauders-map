import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import sharp from 'sharp';import {fileURLToPath} from 'node:url';
const meta=JSON.parse(readFileSync(new URL('../app/letter-kit/reference-section.json',import.meta.url),'utf8'));
const svg=fileURLToPath(new URL('../public/study/reference-section.svg',import.meta.url));
test('the central circle contains no added ink',async()=>{
 const scale=meta.sourceOrientedSize[0]/1650,x=Math.round((1090-meta.crop1650[0])*scale),y=Math.round((550-meta.crop1650[1])*scale),radius=Math.round(50*scale);
 const alpha=await sharp(svg).ensureAlpha().extract({left:x-radius,top:y-radius,width:radius*2,height:radius*2}).extractChannel('alpha').raw().toBuffer();
 assert.ok(alpha.every(v=>v===0));
});
test('drawing and source photograph share an identical coordinate frame',async()=>{
 const drawing=await sharp(svg).metadata(),photo=await sharp(fileURLToPath(new URL('../public/study/reference-section-photo.jpg',import.meta.url))).metadata();
 assert.equal(drawing.width,meta.width);assert.equal(drawing.height,meta.height);assert.equal(photo.width,drawing.width);assert.equal(photo.height,drawing.height);
});
