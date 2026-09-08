import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import sharp from 'sharp';
import {strokePorts} from '../app/letter-kit/stroke-ports.ts';
import {joinedQuillLine,placeStrokePort} from '../app/letter-kit/pen-lines.ts';
import {reconstructTower} from '../app/letter-kit/reconstruction.ts';
const json=n=>JSON.parse(readFileSync(new URL(`../app/letter-kit/${n}.json`,import.meta.url),'utf8'));
const kit=json('glyphs'),script=json('cursive-glyphs'),layout=json('reference-layout');
const raster=async(d,box,scale=3)=>{const [x,y,w,h]=box;const {data,info}=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}" width="${Math.round(w*scale)}" height="${Math.round(h*scale)}"><path fill-rule="evenodd" d="${d}"/></svg>`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});return {data,info};};
for(const family of ['capitals','script'])test(`${family}: every stroke root overlaps actual letter ink`,async()=>{
 const ports=strokePorts[family];assert.ok(Object.keys(ports).length>25);
 for(const [char,p] of Object.entries(ports)){
  const g=family==='capitals'?kit.find(g=>g.id===char):script.glyphs[char];
  assert.ok(Math.abs(Math.hypot(p.dx,p.dy)-1)<.00001,char);
  const d=joinedQuillLine(p,[[p.x+p.dx*32,p.y+p.dy*32],[p.x+p.dx*32-p.dy*26,p.y+p.dy*32+p.dx*26]],1.65);
  const box=[p.x-6,p.y-6,12,12],letter=await raster(g.d,box),line=await raster(d,box);
  let overlap=0;for(let i=3;i<letter.data.length;i+=4)if(letter.data[i]>128&&line.data[i]>128)overlap++;
  assert.ok(overlap>=8,`${char}: insufficient shared ink (${overlap})`);
 }
});
test('A entrance remains joined at phone, native, and zoomed drawing scales',async()=>{
 const a=layout.capitals.find(p=>p.joinId==='east-exit'),g=kit.find(g=>g.id===a.glyph);
 const pieces=reconstructTower(kit,script,layout),letter=pieces.find(p=>p.glyph==='A'&&p.transform.startsWith(`translate(${a.x} ${a.y})`));
 const line=pieces.filter(p=>p.kind==='doorway'&&!p.glyph)[2];
 const port=placeStrokePort(strokePorts.capitals.A,{x:a.x,y:a.y,angle:a.angle,sx:a.width/g.width,sy:a.height/100,cx:g.width/2,cy:50});
 for(const scale of [.6,1,4]){
  const svg=d=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${port.x-12} ${port.y-12} 24 24" width="${Math.round(24*scale)}" height="${Math.round(24*scale)}">${d}</svg>`;
  const draw=async p=>(await sharp(Buffer.from(svg(`<path fill-rule="evenodd" d="${p.d}" transform="${p.transform||''}"/>`))).ensureAlpha().raw().toBuffer());
  const l=await draw(letter),r=await draw(line);let overlap=0;for(let i=3;i<l.length;i+=4)if(l[i]>128&&r[i]>128)overlap++;
  assert.ok(overlap>0,`A join lost at scale ${scale}`);
 }
});
test('stroke direction and thickness transform with an anisotropically scaled letter',()=>{
 const port={x:10,y:20,dx:1,dy:0,width:8};const p=placeStrokePort(port,{x:100,y:200,angle:90,sx:2,sy:3,cx:0,cy:0});
 assert.ok(Math.abs(p.x-40)<1e-9&&Math.abs(p.y-220)<1e-9);assert.ok(Math.abs(p.dx)<1e-9&&Math.abs(p.dy-1)<1e-9);assert.equal(p.width,24);
});
