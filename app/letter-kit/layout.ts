// The floor plan is independent of the photographed tower. Only individual
// letter outlines are reused. All layout and collision checks are deterministic.
export type Point={x:number;y:number};
export type Glyph={id:string;width:number;height:number;d:string};
export type Placed={glyph:Glyph;x:number;y:number;angle:number;width:number;height:number;corners:Point[]};
export const plans={
 observatory:[[516,453],[455,454],[390,431],[350,442],[310,390],[300,333],[260,314],[279,269],[320,254],[320,180],[359,142],[407,139],[450,98],[523,100],[565,120],[620,112],[660,158],[666,216],[700,239],[704,291],[670,318],[652,371],[600,406],[570,446]],
 gallery:[[520,450],[470,435],[385,435],[350,407],[345,368],[267,356],[228,328],[228,265],[256,230],[311,225],[338,206],[356,159],[407,144],[465,166],[555,165],[570,133],[614,125],[650,159],[645,196],[705,222],[725,270],[700,315],[655,329],[641,387],[600,410],[565,450]]
} as const;
export type Plan=keyof typeof plans;
const lerp=(a:Point,b:Point,t:number)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
export function smooth(points:Point[]){
 const result:Point[]=[];
 for(let i=0;i<points.length-1;i++){
  const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];
  const count=Math.max(8,Math.ceil(Math.hypot(c.x-b.x,c.y-b.y)/2));
  for(let j=0;j<count;j++){const t=j/count,t2=t*t,t3=t2*t;const at=(k:'x'|'y')=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3);result.push({x:at('x'),y:at('y')})}
 }
 result.push(points.at(-1)!);return result;
}
export function overlaps(a:Point[],b:Point[]){
 for(const poly of [a,b])for(let i=0;i<poly.length;i++){
  const q=poly[(i+1)%poly.length],p=poly[i],axis={x:-(q.y-p.y),y:q.x-p.x};
  const ap=a.map(p=>p.x*axis.x+p.y*axis.y),bp=b.map(p=>p.x*axis.x+p.y*axis.y);
  if(Math.max(...ap)<Math.min(...bp)||Math.max(...bp)<Math.min(...ap))return false;
 }return true;
}
export function glyphCorners(x:number,y:number,w:number,h:number,angle:number,padding=.6){
 const c=Math.cos(angle),s=Math.sin(angle);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const dx=a*(w/2+padding),dy=b*(h/2+padding);return {x:x+dx*c-dy*s,y:y+dx*s+dy*c}});
}
export function buildPlan(plan:Plan,glyphs:Glyph[],seed:number){
 let state=seed>>>0;const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296};
 const outer=smooth(plans[plan].map(([x,y])=>({x,y}))),center={x:488,y:279};
 const inner=outer.map(p=>lerp(center,p,.68));
 const placed:Placed[]=[];
 function wall(points:Point[],size:number,reverse=false){
  const p=reverse?[...points].reverse():points;
  const distances=[0];for(let i=1;i<p.length;i++)distances.push(distances[i-1]+Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y));
  const total=distances.at(-1)!;
  const sample=(s:number)=>{let j=1;while(j<distances.length-1&&distances[j]<s)j++;const t=(s-distances[j-1])/(distances[j]-distances[j-1]||1);const at=lerp(p[j-1],p[j],t);return {...at,angle:Math.atan2(p[j].y-p[j-1].y,p[j].x-p[j-1].x)}};
  let cursor=2,index=0;const recent:string[]=[];
  while(cursor<total-8&&index++<250){
   const available=glyphs.filter(g=>!recent.includes(g.id.split('.')[0]));const glyph=available[Math.floor(random()*available.length)];recent.push(glyph.id.split('.')[0]);if(recent.length>3)recent.shift();const height=size*(.84+random()*.29),width=glyph.width/100*height*(.94+random()*.12),tilt=(random()-.5)*.11;
   cursor+=width/2;
   while(cursor+width/2<total-2){
    const at=sample(cursor),angle=at.angle+tilt,corners=glyphCorners(at.x,at.y,width,height,angle);
    if(!placed.some(other=>overlaps(corners,other.corners))){placed.push({glyph,x:at.x,y:at.y,angle,width,height,corners});break}
    cursor+=.7;
   }
   cursor+=width/2+1.1;
  }
 }
 wall(outer,21);wall(inner,15,true);
 wall([outer[0],inner[0]],16);wall([inner.at(-1)!,outer.at(-1)!],16);
 // Stairs live between the two ink rims. Reject any tread touching a glyph box.
 const stairs:{a:Point;b:Point}[]=[];
 let previous:Point|null=null;
 for(let i=0;i<outer.length;i++){
  const p=outer[i];if(p.x>355||p.y<225||p.y>355)continue;
  if(previous&&Math.hypot(p.x-previous.x,p.y-previous.y)<8)continue;
  const a=lerp(inner[i],p,.28),b=lerp(inner[i],p,.75),angle=Math.atan2(b.y-a.y,b.x-a.x),length=Math.hypot(b.x-a.x,b.y-a.y),box=glyphCorners((a.x+b.x)/2,(a.y+b.y)/2,length,1,angle,.4);
  if(!placed.some(g=>overlaps(box,g.corners))){stairs.push({a,b});previous=p}
 }
 return {placed,stairs};
}
