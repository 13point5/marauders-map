import type {Glyph} from './layout';
import {smooth,overlaps} from './layout.ts';
import {letterBox,clearStair,type KeepOut} from './clearance.ts';
import {quillLine,placeStrokePort,type StrokePort,type LetterPose} from './pen-lines.ts';
import {strokePorts} from './stroke-ports.ts';
export type WingPiece={kind:'capital'|'script'|'quill'|'stair';glyph?:string;d:string;transform?:string;bounds?:KeepOut;strokeWidth?:number;fill?:string};
type Script={glyphs:Record<string,{d:string;advance:number;bounds:number[]}>};
const degrees=Math.PI/180;
// One authored floor plan. The outlines are the approved letter kit; only the
// placement and pen routes change. Terminal As have deliberate orientations.
export function astronomyWing(kit:Glyph[],script:Script){
 const pieces:WingPiece[]=[],ports:Record<string,StrokePort>={};
 const capital=(id:string,x:number,y:number,angle:number,height:number,portName?:string)=>{
  const g=kit.find(g=>g.id===id)!,scale=height/100;
  const pose:LetterPose={x,y,angle,sx:scale,sy:scale,cx:g.width/2,cy:50};
  const bounds=letterBox(x,y,g.width*scale,height,angle*degrees,2.2);
  pieces.push({kind:'capital',glyph:id,d:g.d,bounds,transform:`translate(${x} ${y}) rotate(${angle}) scale(${scale}) translate(${-g.width/2} -50)`});
  if(portName)ports[portName]=placeStrokePort(strokePorts.capitals.A,pose);
 };
 const alphabet='ASTRONOMIVMBELVEDEREQVISITOR';
 function rim(radius:number,size:number,start:number,end:number,ends=false){
  if(ends){
   const arc=316*degrees*radius,endWidth=kit.find(g=>g.id==='A')!.width/100*size;
   const entries:{id:string;height:number;width:number}[]=[];let used=endWidth+4,index=1;
   while(true){const id=alphabet[index++%alphabet.length],height=size*(1+.035*Math.sin(index*2.4)),width=kit.find(g=>g.id===id)!.width/100*height;if(used+width+4>arc)break;entries.push({id,height,width});used+=width+4}
   const gap=4+(arc-used)/(entries.length+1);let cursor=endWidth/2;
   const place=(id:string,height:number,a:number,name?:string)=>{const r=radius+3.3*Math.sin(a*3*degrees)+2*Math.cos(a*5*degrees);capital(id,290+r*Math.cos(a*degrees),300+r*Math.sin(a*degrees),a-90,height,name)};
   place('A',size,22,'tower-lower');
   for(const g of entries){cursor+=gap+g.width/2;place(g.id,g.height,22+cursor/radius/degrees);cursor+=g.width/2}
   place('A',size,338,'tower-upper');return;
  }

  let theta=start,index=0;
  while(theta<end){
   const id=alphabet[index%alphabet.length],g=kit.find(g=>g.id===id)!,height=size*(1+.045*Math.sin(index*2.4));
   const span=(g.width/100*height+4.3)/radius/degrees;
   if(theta+span>end)break;
   const angle=theta+span/2,r=radius+3.3*Math.sin(angle*3*degrees)+2*Math.cos(angle*5*degrees);
   capital(id,290+r*Math.cos(angle*degrees),300+r*Math.sin(angle*degrees),angle-90,height);
   theta+=span;index++;
  }

 }
 rim(180,25,31,329,true);rim(87,19,38,322);
 const phrase='curiositas est initium sapientiae ';
 let theta=34,index=0;
 while(theta<326){const char=phrase[index++%phrase.length],g=script.glyphs[char],scale=.34,span=(g.advance*scale+.6)/147/degrees;if(theta+span>326)break;
  const a=theta+span/2,r=147+2*Math.sin(a*3*degrees),angle=a+90,x=290+r*Math.cos(a*degrees),y=300+r*Math.sin(a*degrees);
  if(g.d){const b=g.bounds,dx=((b[0]+b[2])/2-g.advance/2)*scale,dy=((b[1]+b[3])/2-80)*scale;
   pieces.push({kind:'script',glyph:char,d:g.d,transform:`translate(${x} ${y}) rotate(${angle}) scale(${scale}) translate(${-g.advance/2} -80)`,bounds:letterBox(x+dx*Math.cos(angle*degrees)-dy*Math.sin(angle*degrees),y+dx*Math.sin(angle*degrees)+dy*Math.cos(angle*degrees),(b[2]-b[0])*scale,(b[3]-b[1])*scale,angle*degrees,3)});
  }theta+=span;
 }
 // The chamber has offset bays and a shallow bow, rather than a rectangular rim.
 const outline=smooth([[557,222],[596,216],[610,180],[709,178],[747,199],[802,195],[840,225],[855,277],[846,332],[807,366],[752,364],[731,393],[631,388],[597,364],[552,358]].map(([x,y])=>({x,y})));
 const distances=[0];for(let i=1;i<outline.length;i++)distances.push(distances[i-1]+Math.hypot(outline[i].x-outline[i-1].x,outline[i].y-outline[i-1].y));
 const at=(d:number)=>{let i=1;while(i<distances.length-1&&distances[i]<d)i++;const t=(d-distances[i-1])/(distances[i]-distances[i-1]);return {x:outline[i-1].x+(outline[i].x-outline[i-1].x)*t,y:outline[i-1].y+(outline[i].y-outline[i-1].y)*t,angle:Math.atan2(outline[i].y-outline[i-1].y,outline[i].x-outline[i-1].x)/degrees}};
 capital('A',548,224,90,26,'hall-upper');capital('A',555,357,90,26,'hall-lower');
 let cursor=0,letter=0;const wall='QVAESTIONESMEMORIAVISIONES';
 while(cursor<distances.at(-1)!-14){
  const id=wall[letter++%wall.length],g=kit.find(g=>g.id===id)!,h=27*(1+.04*Math.sin(letter)),width=g.width/100*h;cursor+=width/2;
  while(cursor<distances.at(-1)!-width/2){
   const p=at(cursor),bounds=letterBox(p.x,p.y,width,h,p.angle*degrees,1.2);
   if(!pieces.some(g=>g.kind==='capital'&&g.bounds&&overlaps(bounds,g.bounds))){capital(id,p.x,p.y,p.angle,h);break}
   cursor+=.7;
  }cursor+=width/2+2.7;
 }
 // A second handwritten register gives the chamber walls depth. It follows
 // the bays, with enough inset for the cursive ascenders to clear the capitals.
 const inscription='quaerere discere experiri intelligere ';
 let penCursor=12,scriptIndex=0;
 while(penCursor<distances.at(-1)!-22){
  const char=inscription[scriptIndex++%inscription.length],g=script.glyphs[char],scale=.24,advance=(g.advance*scale+1)/.60;
  if(penCursor+advance>distances.at(-1)!-22)break;
  const p=at(penCursor+advance/2),x=700+(p.x-700)*.60,y=286+(p.y-286)*.60,angle=p.angle;
  if(g.d){const b=g.bounds,dx=((b[0]+b[2])/2-g.advance/2)*scale,dy=((b[1]+b[3])/2-80)*scale;
   pieces.push({kind:'script',glyph:char,d:g.d,transform:`translate(${x} ${y}) rotate(${angle}) scale(${scale}) translate(${-g.advance/2} -80)`,bounds:letterBox(x+dx*Math.cos(angle*degrees)-dy*Math.sin(angle*degrees),y+dx*Math.sin(angle*degrees)+dy*Math.cos(angle*degrees),(b[2]-b[0])*scale,(b[3]-b[1])*scale,angle*degrees,2)});
  }penCursor+=advance;
 }
 // Explicit connections share ink at both letter roots. Pen direction is kept
 // for the first/last few units, and the route between them is hand-authored.
 const connect=(a:StrokePort,b:StrokePort,route:number[][])=>{
  const points=[[a.x,a.y],[a.x+a.dx*8,a.y+a.dy*8],...route,[b.x+b.dx*8,b.y+b.dy*8],[b.x,b.y]];
  pieces.push({kind:'quill',d:quillLine(points,1.5,a.width)});
 };
 connect(ports['tower-upper'],ports['hall-upper'],[[498,231]]);
 connect(ports['tower-lower'],ports['hall-lower'],[[481,376],[511,356]]);
 // A small stair fan, clipped away from each actual lettering placement.
 const boxes=pieces.flatMap(p=>p.bounds?[p.bounds]:[]);
 for(let a=68;a<=297;a+=9.5){const t=a*degrees,segment=clearStair({x:290+100*Math.cos(t),y:300+100*Math.sin(t)},{x:290+159*Math.cos(t),y:300+159*Math.sin(t)},boxes,12);
  if(segment)pieces.push({kind:'stair',d:`M${segment.a.x} ${segment.a.y}L${segment.b.x} ${segment.b.y}`,strokeWidth:1.8,fill:'none'});
 }
 // Landing steps at the passage mouth are short and deliberately staggered.
 for(let i=0;i<5;i++)pieces.push({kind:'stair',d:`M${471+i*9} ${274+i*.6}L${471+i*9} ${323-i*.4}`,strokeWidth:1.5,fill:'none'});
 const round=(s:string)=>s.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi,n=>String(Number(Number(n).toFixed(5))));
 return {pieces:pieces.map(p=>({...p,d:p.kind==='stair'||p.kind==='quill'?round(p.d):p.d,...(p.transform?{transform:round(p.transform)}:{})})),ports};
}
