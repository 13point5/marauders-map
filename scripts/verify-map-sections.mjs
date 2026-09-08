// Compare rasterized vectors with cleaned source masks. This is tracing
// fidelity, not a claim that the raw photograph is stain-free or undistorted.
import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
for(const name of ['clock-halls','stairwell']){
 const meta=JSON.parse(await readFile(`app/map-sections/${name}.json`,'utf8'));
 const render=await sharp(`public/study/${name}.svg`).ensureAlpha().extractChannel('alpha').raw().toBuffer();
 const source=await sharp(`outputs/${name}/source-ink-mask.png`).extractChannel(0).raw().toBuffer();
 let shared=0,union=0;for(let k=0;k<render.length;k++){const a=render[k]>128,b=source[k]>128;shared+=Number(a&&b);union+=Number(a||b)}
 const iou=shared/union;assert.ok(iou>.98,`${name}: cleaned source fidelity below 98%`);
 await sharp(render,{raw:{width:meta.width,height:meta.height,channels:1}}).png().toFile(`outputs/${name}/rendered-ink-mask.png`);
 await writeFile(`outputs/${name}/fidelity.json`,JSON.stringify({inkIntersectionOverUnion:iou},null,2));console.log(name,iou);
}
