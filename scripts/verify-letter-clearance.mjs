import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {reconstructTower} from '../app/letter-kit/reconstruction.ts';
const json=async n=>JSON.parse(await readFile(`app/letter-kit/${n}.json`,'utf8'));
const kit=await json('glyphs'),font=await json('cursive-glyphs'),layout=await json('reference-layout');
const pieces=reconstructTower(kit,font,layout);
const svg=selected=>`<svg xmlns="http://www.w3.org/2000/svg" width="1010" height="1025" viewBox="60 65 1010 1025"><g fill="black" fill-rule="evenodd" stroke-linecap="round">${selected.map(p=>`<path d="${p.d}" ${p.transform?`transform="${p.transform}"`:''} ${p.strokeWidth?`stroke="black" stroke-width="${p.strokeWidth}" fill="none"`:''}/>`).join('')}</g></svg>`;
const alpha=async selected=>sharp(Buffer.from(svg(selected))).ensureAlpha().extractChannel('alpha').raw().toBuffer();
const letters=await alpha(pieces.filter(p=>p.kind==='capital'||p.kind==='cursive'||p.glyph));
const stairs=await alpha(pieces.filter(p=>p.kind==='stair'));
let overlap=0,withinThreePixels=0;
for(let y=3;y<1022;y++)for(let x=3;x<1007;x++)if(stairs[y*1010+x]>16){
 if(letters[y*1010+x]>16)overlap++;
 let near=false;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(dx*dx+dy*dy<=9&&letters[(y+dy)*1010+x+dx]>16)near=true;
 if(near)withinThreePixels++;
}
const report={capitals:kit.filter(g=>g.id.length===1).length,cursive:Object.keys(font.glyphs).filter(c=>c!==' ').length,treads:pieces.filter(p=>p.kind==='stair').length,overlappingInkPixels:overlap,treadPixelsWithin3pxOfLetters:withinThreePixels};
await writeFile('outputs/alphabet/clearance-report.json',JSON.stringify(report,null,2));console.log(report);
assert.equal(overlap,0);assert.equal(withinThreePixels,0,'Every tread needs at least three pixels of visible letter clearance');
