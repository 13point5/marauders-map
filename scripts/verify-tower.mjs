import sharp from 'sharp';
import {writeFile,readFile} from 'node:fs/promises';
const svg=await readFile('public/study/stair-tower.svg','utf8');
if(/<(rect|circle|ellipse|line|textPath)\b/.test(svg))throw new Error('Unexpected geometric border or typeset arc');
await sharp('public/study/stair-tower.svg').ensureAlpha().png().toFile('outputs/study/vector-render.png');
const {data:vector,info}=await sharp('outputs/study/vector-render.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const source=await sharp('outputs/study/reference-ink-mask.png').removeAlpha().greyscale().raw().toBuffer();
let both=0,union=0,ref=0,drawn=0,errors=[];
for(let i=0;i<source.length;i++){
 const a=source[i]>127,b=vector[i*4+3]>127;
 ref+=a;drawn+=b;both+=a&&b;union+=a||b;
 if(a!==b)errors.push(i);
}
const report={maskIoU:both/union,referenceInkRetained:both/ref,vectorPrecision:both/drawn,pixels:source.length,addedGeometricBorders:0,scope:'Vector agreement with isolated photo ink, not an independent perceptual-quality score.'};
await writeFile('outputs/study/verification.json',JSON.stringify(report,null,2));
const difference=Buffer.alloc(source.length*3,235);
for(let i=0;i<source.length;i++){
 const a=source[i]>127,b=vector[i*4+3]>127;
 const rgb=a&&b?[45,38,30]:a?[20,150,190]:b?[200,55,45]:[235,230,220];
 difference.set(rgb,i*3);
}
await sharp(difference,{raw:{width:info.width,height:info.height,channels:3}}).png().toFile('outputs/study/contour-difference.png');
console.log(report);
if(report.maskIoU<.92)throw new Error('Vector contours diverge from the source ink');
