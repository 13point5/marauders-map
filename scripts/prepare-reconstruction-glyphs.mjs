import sharp from 'sharp';
import {readFile,mkdir} from 'node:fs/promises';
await mkdir('outputs/reconstruction/templates',{recursive:true});
const kit=JSON.parse(await readFile('app/letter-kit/glyphs.json','utf8'));
for(const g of kit){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(g.width)}" height="100" viewBox="0 0 ${Math.ceil(g.width)} 100"><path d="${g.d}" fill="black" fill-rule="evenodd"/></svg>`;await sharp(Buffer.from(svg)).ensureAlpha().extractChannel('alpha').png().toFile(`outputs/reconstruction/templates/${g.id}.png`)}

// Companion script pieces used to fit the entrance's lowercase lettering.
const script=JSON.parse(await readFile('app/letter-kit/cursive-glyphs.json','utf8'));
for(const char of ['m','s']){const g=script.glyphs[char],b=g.bounds,w=b[2]-b[0],h=b[3]-b[1];await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w*2}" height="${h*2}" viewBox="${b[0]} ${b[1]} ${w} ${h}"><path d="${g.d}" fill="black" fill-rule="evenodd"/></svg>`)).ensureAlpha().extractChannel('alpha').png().toFile(`outputs/reconstruction/templates/script-${char}.png`)}
