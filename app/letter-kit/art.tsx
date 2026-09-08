'use client';
import {useMemo} from 'react';
import glyphs from './glyphs.json';
import script from './cursive-glyphs.json';
import {buildPlan,type Plan} from './layout';
import {strokePorts} from './stroke-ports';
import {joinedQuillLine,type StrokePort} from './pen-lines';
export function OriginalBuilding({plan,seed}:{plan:Plan;seed:number}){
 const {placed,stairs}=useMemo(()=>buildPlan(plan,glyphs,seed),[plan,seed]);
 return <g transform="translate(-100 -56) scale(1.2)" className="original-building" aria-label="Original floor plan assembled from reusable hand-lettered vector pieces">
  <g fill="#36271f" fillRule="evenodd">{placed.map((p,i)=><path key={i} d={p.glyph.d} data-glyph={p.glyph.id} transform={`translate(${p.x} ${p.y}) rotate(${p.angle*180/Math.PI}) scale(${p.width/p.glyph.width} ${p.height/100}) translate(${-p.glyph.width/2} -50)`}/>)}</g>
  <g stroke="#36271f" strokeWidth="1.05" strokeLinecap="round" fill="none">{stairs.map(({a,b},i)=><path key={i} d={`M${a.x} ${a.y}Q${(a.x+b.x)/2+.5} ${(a.y+b.y)/2-.4} ${b.x} ${b.y}`}/>)}</g>
  <text x="490" y="263" textAnchor="middle" fontSize="24" fontStyle="italic">{plan==='observatory'?'The Observatory':'The Long Gallery'}</text>
  <text x="490" y="288" textAnchor="middle" fontSize="10" letterSpacing="2.5">{plan==='observatory'?'IN PURSUIT OF IDEAS':'A PLACE FOR CURIOSITY'}</text>
 </g>
}
export type KitStyle='capitals'|'cursive-lower'|'cursive-upper';
export function LetterKit({style='capitals',showJoins=false}:{style?:KitStyle;showJoins?:boolean}){
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
 return <g fill="#36271f" fillRule="evenodd">{alphabet.map((letter,i)=>{
  const x=180+i%7*107,y=76+Math.floor(i/7)*121;
  const char=style==='cursive-lower'?letter.toLowerCase():letter;
  const g=style==='capitals'?glyphs.find(g=>g.id===letter)!:script.glyphs[char as keyof typeof script.glyphs];
  const b='bounds' in g?g.bounds:[0,0,'width' in g?g.width:100,100];
  const scale=Math.min(showJoins?.48:.62,74/(b[2]-b[0]),77/(b[3]-b[1]));
  const ports:Record<string,StrokePort>=style==='capitals'?strokePorts.capitals:strokePorts.script;
  const port=ports[char],dx=port.dx,dy=port.dy;
  const continuation=showJoins?joinedQuillLine(port,[[port.x+dx*32,port.y+dy*32],[port.x+dx*32-dy*26,port.y+dy*32+dx*26]],style==='capitals'?2:1):'';
  return <g key={letter} data-kit-letter={char} transform={`translate(${x} ${y})`}><g transform={`translate(0 37) scale(${scale}) translate(${-(b[0]+b[2])/2} ${-(b[1]+b[3])/2})`}>{showJoins&&<path data-stroke-continuation={char} d={continuation}/>}<path d={g.d}/></g><text y="98" textAnchor="middle" fontSize="13" opacity=".6">{char}</text></g>;
 })}<text x="500" y="582" textAnchor="middle" fontSize="14" fontStyle="italic">{showJoins?'Pen continuations · the same letterforms, with connected strokes':style==='capitals'?'A–Z · sampled capitals and matching drawn forms':'A–Z / a–z · custom broad-pen letterforms'}</text></g>
}
