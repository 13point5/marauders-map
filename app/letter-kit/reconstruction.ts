import type {Glyph} from './layout';
export type Piece={kind:'capital'|'cursive'|'stair'|'doorway';d:string;transform?:string;glyph?:string;strokeWidth?:number;fill?:string};
type Layout={capitals:{glyph:string;band:string;x:number;y:number;angle:number;width:number;height:number}[];stairs:{a:number[];b:number[];width:number}[];doorways:string[]};
type Cursive={unitsPerEm:number;glyphs:Record<string,{d:string;advance:number}>};
// A reconstruction recipe uses the SAME reusable capital library as the new
// floor plans. Its layout was measured from the reference; its contours were not.
export function reconstructTower(kit:Glyph[],cursive:Cursive,layout:Layout):Piece[]{
 const pieces:Piece[]=layout.capitals.map(p=>{const g=kit.find(g=>g.id===p.glyph)!;return {kind:'capital',glyph:g.id,d:g.d,transform:`translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${p.width/g.width} ${p.height/100}) translate(${-g.width/2} -50)`}});
 const phrase='omnibus maraudentibus bonum audere est maraudere ';
 const radius=409,fontSize=54,scale=fontSize/cursive.unitsPerEm;
 const start=47*Math.PI/180,end=-278*Math.PI/180,total=(start-end)*radius;
 let cursor=0,i=0;
 while(cursor<total){const char=phrase[i++%phrase.length],g=cursive.glyphs[char],advance=g.advance*scale*.91;
  if(cursor+advance>total)break;
  const theta=start-(cursor+advance/2)/radius;
  // The baseline is an invisible positioning guide, never a rendered arc.
  const r=radius+3.8*Math.sin(theta*3)+2.1*Math.cos(theta*7);
  if(g.d)pieces.push({kind:'cursive',glyph:char,d:g.d,transform:`translate(${563+r*Math.cos(theta)} ${565+r*Math.sin(theta)}) rotate(${theta*180/Math.PI-90+3*Math.sin(i*1.7)}) scale(${scale} ${-scale*(1+.1*Math.sin(i*2.3))}) translate(${-g.advance/2} 0)`});
  cursor+=advance;
 }
 for(const s of layout.stairs)pieces.push({kind:'stair',d:`M${s.a[0]} ${s.a[1]}L${s.b[0]} ${s.b[1]}`,strokeWidth:s.width,fill:'none'});
 for(const d of layout.doorways)pieces.push({kind:'doorway',d,strokeWidth:6,fill:'none'});
 // Avoid last-bit trigonometry differences between server and browser engines.
 return pieces.map(p=>p.transform?{...p,transform:p.transform.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi,n=>String(Number(Number(n).toFixed(6))))}:p);
}
