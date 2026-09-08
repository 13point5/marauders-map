import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const caps=JSON.parse(await readFile('app/letter-kit/glyphs.json','utf8'));
const script=JSON.parse(await readFile('app/letter-kit/cursive-glyphs.json','utf8'));
for(const kind of ['capitals','lower','upper']){
 const alphabet=kind==='lower'?'abcdefghijklmnopqrstuvwxyz':'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 const paths=[...alphabet].map((c,i)=>{
  const g=kind==='capitals'?caps.find(g=>g.id===c):script.glyphs[c];
  const b=g.bounds||[0,0,g.width,100],scale=Math.min(.85,98/(b[2]-b[0]),100/(b[3]-b[1]));
  return `<g transform="translate(${100+i%7*140} ${80+Math.floor(i/7)*150})"><path d="${g.d}" transform="translate(0 40) scale(${scale}) translate(${-(b[0]+b[2])/2} ${-(b[1]+b[3])/2})"/><text y="117" text-anchor="middle" font-family="Georgia" font-size="16">${c}</text></g>`;
 }).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="720"><rect width="100%" height="100%" fill="#ecd7af"/><g fill="#36271f" fill-rule="evenodd">${paths}</g></svg>`;
 await writeFile(`outputs/alphabet/${kind}.svg`,svg);await sharp(Buffer.from(svg)).png().toFile(`outputs/alphabet/${kind}.png`);
}
