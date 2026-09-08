import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
import {reconstructTower} from '../app/letter-kit/reconstruction.ts';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const kit=await json('app/letter-kit/glyphs.json'),font=await json('app/letter-kit/cursive-glyphs.json'),layout=await json('app/letter-kit/reference-layout.json');
const pieces=reconstructTower(kit,font,layout);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1010" height="1025" viewBox="60 65 1010 1025"><g fill="#36271f" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">${pieces.map(p=>`<path data-kind="${p.kind}" d="${p.d}" ${p.transform?`transform="${p.transform}"`:''} ${p.strokeWidth?`stroke="#36271f" stroke-width="${p.strokeWidth}"`:''} ${p.fill?`fill="${p.fill}"`:''}/>`).join('')}</g></svg>`;
await writeFile('outputs/reconstruction/rebuilt.svg',svg);await sharp(Buffer.from(svg)).png().toFile('outputs/reconstruction/rebuilt.png');
console.log(Object.fromEntries(['capital','cursive','stair','doorway'].map(kind=>[kind,pieces.filter(p=>p.kind===kind).length])));
