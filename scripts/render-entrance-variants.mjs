import {readFile,mkdir,writeFile} from 'node:fs/promises';import sharp from 'sharp';
import {reconstructTower} from '../app/letter-kit/reconstruction.ts';
const json=async n=>JSON.parse(await readFile(`app/letter-kit/${n}.json`,'utf8'));
const kit=await json('glyphs'),font=await json('cursive-glyphs'),layout=await json('reference-layout');
await mkdir('outputs/entrance-variants',{recursive:true});
for(const variant of ['quiet','lettered','stepped']){
 const p=reconstructTower(kit,font,layout,variant);
 const paths=p.map(p=>`<path d="${p.d}" ${p.transform?`transform="${p.transform}"`:''} ${p.strokeWidth?`stroke="#36271f" stroke-width="${p.strokeWidth}"`:''} fill="${p.fill||'#36271f'}"/>`).join('');
 for(const detail of [true,false]){const box=detail?'550 780 510 340':'60 65 1010 1045',svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${detail?1020:1010}" height="${detail?680:1045}" viewBox="${box}"><rect x="0" y="0" width="1500" height="1500" fill="#ecd7af"/><g fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;await sharp(Buffer.from(svg)).png().toFile(`outputs/entrance-variants/${variant}${detail?'-detail':''}.png`)}
}
