import {buildEntrance,joinEntranceReturn,type EntranceVariant} from './entrance-variants.ts';
import type {Glyph} from './layout';
import {clearStair,letterBox,type KeepOut} from './clearance.ts';
export type Piece={kind:'capital'|'cursive'|'stair'|'doorway';d:string;transform?:string;glyph?:string;strokeWidth?:number;fill?:string;bounds?:KeepOut;joinId?:string};
type Layout={capitals:{glyph:string;band:string;joinId?:string;x:number;y:number;angle:number;width:number;height:number}[];stairs:{a:number[];b:number[];width:number;joinId?:string}[];entrance:{letters:{family:string;glyph:string;x:number;y:number;angle:number;width:number;height:number}[];connectors:string[]}};
type Cursive={unitsPerEm:number;baseline:number;glyphs:Record<string,{d:string;advance:number;bounds:number[]}>};
// Layout is measured from the reference. Letter contours come from reusable kits.
export function reconstructTower(kit:Glyph[],cursive:Cursive,layout:Layout,variant:EntranceVariant='quiet'):Piece[]{
 const padding=6; // includes 2.2px half-tread width plus a visible air gap
 const pieces:Piece[]=layout.capitals.map(p=>{const g=kit.find(g=>g.id===p.glyph)!;return {kind:'capital',glyph:g.id,d:g.d,bounds:letterBox(p.x,p.y,p.width,p.height,p.angle*Math.PI/180,padding),transform:`translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${p.width/g.width} ${p.height/100}) translate(${-g.width/2} -50)`}});
 const phrase='omnibus maraudentibus bonum audere est maraudere ';
 const radius=396,fontSize=60,scale=fontSize/cursive.unitsPerEm;
 const start=47*Math.PI/180,end=-278*Math.PI/180,total=(start-end)*radius;
 let cursor=0,i=0;
 while(cursor<total){const char=phrase[i++%phrase.length],g=cursive.glyphs[char],advance=g.advance*scale;
  if(cursor+advance>total)break;
  const theta=start-(cursor+advance/2)/radius;
  const r=radius+2.8*Math.sin(theta*3)+1.8*Math.cos(theta*7);
  const angle=theta-Math.PI/2+1.5*Math.sin(i*1.7)*Math.PI/180;
  const x=563+r*Math.cos(theta),y=565+r*Math.sin(theta);
  const sy=scale*(1+.04*Math.sin(i*2.3));
  if(g.d){
   const [l,t,right,bottom]=g.bounds,dx=((l+right)/2-g.advance/2)*scale,dy=((t+bottom)/2-cursive.baseline)*sy;
   pieces.push({kind:'cursive',glyph:char,d:g.d,bounds:letterBox(x+dx*Math.cos(angle)-dy*Math.sin(angle),y+dx*Math.sin(angle)+dy*Math.cos(angle),(right-l)*scale,(bottom-t)*sy,angle,padding),transform:`translate(${x} ${y}) rotate(${angle*180/Math.PI}) scale(${scale} ${sy}) translate(${-g.advance/2} ${-cursive.baseline})`});
  }
  cursor+=advance;
 }
 const exit=layout.capitals.find(p=>p.joinId==='east-exit');
 const exitGlyph=exit&&kit.find(g=>g.id===exit.glyph);
 pieces.push(...buildEntrance(kit,variant,exit&&exitGlyph?{x:exit.x,y:exit.y,angle:exit.angle,sx:exit.width/exitGlyph.width,sy:exit.height/100,cx:exitGlyph.width/2,cy:50}:undefined));
 const boxes=pieces.flatMap(p=>p.bounds?[p.bounds]:[]);
 for(const s of layout.stairs){
  const segment=clearStair({x:s.a[0],y:s.a[1]},{x:s.b[0],y:s.b[1]},boxes);
  if(segment&&s.joinId==='inner-return'){
   const entrance=pieces.find(p=>p.joinId==='inner-return'&&p.kind==='doorway');
   if(entrance)entrance.d=joinEntranceReturn(variant,segment,s.width);
  }
  if(segment)pieces.push({kind:'stair',joinId:s.joinId,d:`M${segment.a.x} ${segment.a.y}L${segment.b.x} ${segment.b.y}`,strokeWidth:s.width,fill:'none'});
 }
 const round=(s:string)=>s.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi,n=>String(Number(Number(n).toFixed(6))));
 return pieces.map(p=>({...p,d:p.kind==='stair'?round(p.d):p.d,...(p.transform?{transform:round(p.transform)}:{})}));
}
