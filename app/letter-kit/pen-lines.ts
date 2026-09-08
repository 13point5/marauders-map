type XY={x:number;y:number};
// A broad nib following straight runs and small, deliberate corner turns.
// Variation is in ink width, not a wobbly/sinusoidal centreline.
export function quillLine(points:number[][],weight=1,rootWidth?:number):string{
 const p=points.map(([x,y])=>({x,y})),samples:XY[]=[];
 const line=(a:XY,b:XY)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/1.5));for(let j=0;j<n;j++){const t=j/n;samples.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t})}};
 let last=p[0];
 for(let i=1;i<p.length-1;i++){
  const a=p[i-1],b=p[i],c=p[i+1],ab=Math.hypot(b.x-a.x,b.y-a.y),bc=Math.hypot(c.x-b.x,c.y-b.y),r=Math.min(6,ab*.18,bc*.18);
  const entry={x:b.x+(a.x-b.x)*r/ab,y:b.y+(a.y-b.y)*r/ab},exit={x:b.x+(c.x-b.x)*r/bc,y:b.y+(c.y-b.y)*r/bc};line(last,entry);
  for(let j=0;j<10;j++){const t=j/10;samples.push({x:(1-t)**2*entry.x+2*(1-t)*t*b.x+t*t*exit.x,y:(1-t)**2*entry.y+2*(1-t)*t*b.y+t*t*exit.y})}last=exit;
 }
 line(last,p.at(-1)!);samples.push(p.at(-1)!);
 const left:XY[]=[],right:XY[]=[];let distance=0;
 samples.forEach((s,i)=>{const a=samples[Math.max(0,i-1)],b=samples[Math.min(samples.length-1,i+1)],length=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;
  if(i)distance+=Math.hypot(s.x-samples[i-1].x,s.y-samples[i-1].y);
  const nib=1.2+1.35*Math.abs(nx*.82-ny*.57),pressure=(.92+.08*Math.sin(i/samples.length*Math.PI))*((i===0&&rootWidth===undefined)||i===samples.length-1?.76:1);
  const blend=Math.min(1,distance/24),smooth=blend*blend*(3-2*blend);
  const half=rootWidth===undefined?nib*pressure*weight:rootWidth/2*(1-smooth)+nib*pressure*weight*smooth;
  left.push({x:s.x+nx*half,y:s.y+ny*half});right.push({x:s.x-nx*half,y:s.y-ny*half});
 });
 const edge=[...left,...right.reverse()];return edge.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join('')+'Z';
}

export type StrokePort={x:number;y:number;dx:number;dy:number;width:number};
export type LetterPose={x:number;y:number;angle:number;sx:number;sy:number;cx:number;cy:number};
// Transform a pen direction along with its letter, including unequal X/Y scales.
// The perpendicular stroke thickness follows determinant / tangent stretch.
export function placeStrokePort(port:StrokePort,p:LetterPose):StrokePort{
 const a=p.angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=(port.x-p.cx)*p.sx,y=(port.y-p.cy)*p.sy;
 const dx=port.dx*p.sx,dy=port.dy*p.sy,length=Math.hypot(dx,dy);
 return {x:p.x+x*c-y*s,y:p.y+x*s+y*c,dx:(dx*c-dy*s)/length,dy:(dx*s+dy*c)/length,width:port.width*Math.abs(p.sx*p.sy)/length};
}
// Begin inside the letter's ink, follow its pen direction, then turn toward
// the route. Root width blends gradually; an attached root is never tapered.
export function joinedQuillLine(port:StrokePort,route:number[][],weight=1.65):string{
 const lead=12;
 return quillLine([[port.x,port.y],[port.x+port.dx*lead,port.y+port.dy*lead],...route],weight,port.width);
}
