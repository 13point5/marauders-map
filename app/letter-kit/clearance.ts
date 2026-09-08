export type XY={x:number;y:number};
export type KeepOut=XY[];
// Expand in the glyph's own axes so rotated letters retain the same clearance.
export function letterBox(x:number,y:number,width:number,height:number,angle:number,padding:number):KeepOut{
 const c=Math.cos(angle),s=Math.sin(angle);
 return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const dx=a*(width/2+padding),dy=b*(height/2+padding);return {x:x+dx*c-dy*s,y:y+dx*s+dy*c}});
}
export function inside(p:XY,box:KeepOut){
 return box.every((a,i)=>{const b=box[(i+1)%box.length];return (b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x)>=-1e-7});
}
// Clip against each convex letter box, then retain the longest unobstructed run.
// Endpoint caps are covered by the padding supplied when creating each box.
export function clearStair(a:XY,b:XY,boxes:KeepOut[],minimumLength=45):{a:XY;b:XY}|null{
 let runs:[[number,number]]|[number,number][]=[[0,1]];
 for(const box of boxes){
  let lo=0,hi=1,hit=true;
  for(let i=0;i<box.length;i++){
   const p=box[i],q=box[(i+1)%box.length],ex=q.x-p.x,ey=q.y-p.y;
   const c=ex*(a.y-p.y)-ey*(a.x-p.x),d=ex*(b.y-a.y)-ey*(b.x-a.x);
   if(Math.abs(d)<1e-9){if(c<0){hit=false;break}}else if(d>0)lo=Math.max(lo,-c/d);else hi=Math.min(hi,-c/d);
   if(lo>hi){hit=false;break}
  }
  if(!hit)continue;
  const next:[number,number][]=[];
  for(const [l,h] of runs){if(hi<=l||lo>=h)next.push([l,h]);else{if(lo>l)next.push([l,lo]);if(hi<h)next.push([hi,h])}}
  runs=next;if(!runs.length)return null;
 }
 const run=runs.sort((u,v)=>(v[1]-v[0])-(u[1]-u[0]))[0];
 const length=Math.hypot(b.x-a.x,b.y-a.y);if(!run||length*(run[1]-run[0])<minimumLength)return null;
 const at=(t:number)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
 // Small inward retreat avoids numeric boundary contact after SVG rounding.
 return {a:at(run[0]+.05/length),b:at(run[1]-.05/length)};
}
