import sharp from 'sharp';import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const meta=JSON.parse(await readFile('app/map-sections/reference-section.json','utf8'));
const svg=await readFile('public/study/reference-section.svg');
const render=await sharp(svg).ensureAlpha().extractChannel('alpha').raw().toBuffer();
const source=await sharp('outputs/reference-section/source-ink-mask.png').extractChannel(0).raw().toBuffer();
const regions={whole:[0,0,meta.width,meta.height],tower:[5,20,1040,1150],entrance:[470,800,640,610],bend:[450,1310,675,760]};const report={};
for(const [name,[x,y,w,h]] of Object.entries(regions)){
 let shared=0,union=0;for(let j=y;j<Math.min(meta.height,y+h);j++)for(let i=x;i<Math.min(meta.width,x+w);i++){const k=j*meta.width+i,a=render[k]>128,b=source[k]>128;shared+=Number(a&&b);union+=Number(a||b)}
 report[name]={inkIntersectionOverUnion:shared/union};assert.ok(shared/union>.98,`${name}: vector differs from the cleaned source ink`);
}
await sharp(render,{raw:{width:meta.width,height:meta.height,channels:1}}).png().toFile('outputs/reference-section/rendered-ink-mask.png');
await writeFile('outputs/reference-section/fidelity.json',JSON.stringify(report,null,2));console.log(report);
