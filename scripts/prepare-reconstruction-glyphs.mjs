import sharp from 'sharp';
import {readFile,mkdir} from 'node:fs/promises';
await mkdir('outputs/reconstruction/templates',{recursive:true});
const kit=JSON.parse(await readFile('app/letter-kit/glyphs.json','utf8'));
for(const g of kit){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(g.width)}" height="100" viewBox="0 0 ${Math.ceil(g.width)} 100"><path d="${g.d}" fill="black" fill-rule="evenodd"/></svg>`;await sharp(Buffer.from(svg)).ensureAlpha().extractChannel('alpha').png().toFile(`outputs/reconstruction/templates/${g.id}.png`)}
