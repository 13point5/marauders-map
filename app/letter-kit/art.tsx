'use client';
import {useMemo} from 'react';
import glyphs from './glyphs.json';
import {buildPlan,type Plan} from './layout';
export function OriginalBuilding({plan,seed}:{plan:Plan;seed:number}){
 const {placed,stairs}=useMemo(()=>buildPlan(plan,glyphs,seed),[plan,seed]);
 return <g transform="translate(-100 -56) scale(1.2)" className="original-building" aria-label="Original floor plan assembled from reusable hand-lettered vector pieces">
  <g fill="#36271f" fillRule="evenodd">{placed.map((p,i)=><path key={i} d={p.glyph.d} data-glyph={p.glyph.id} transform={`translate(${p.x} ${p.y}) rotate(${p.angle*180/Math.PI}) scale(${p.width/p.glyph.width} ${p.height/100}) translate(${-p.glyph.width/2} -50)`}/>)}</g>
  <g stroke="#36271f" strokeWidth="1.05" strokeLinecap="round" fill="none">{stairs.map(({a,b},i)=><path key={i} d={`M${a.x} ${a.y}Q${(a.x+b.x)/2+.5} ${(a.y+b.y)/2-.4} ${b.x} ${b.y}`}/>)}</g>
  <text x="490" y="263" textAnchor="middle" fontSize="24" fontStyle="italic">{plan==='observatory'?'The Observatory':'The Long Gallery'}</text>
  <text x="490" y="288" textAnchor="middle" fontSize="10" letterSpacing="2.5">{plan==='observatory'?'IN PURSUIT OF IDEAS':'A PLACE FOR CURIOSITY'}</text>
 </g>
}
export function LetterKit(){return <g fill="#36271f" fillRule="evenodd">{glyphs.map((g,i)=>{const x=230+i%5*130,y=130+Math.floor(i/5)*140;return <g key={g.id} transform={`translate(${x} ${y})`}><path d={g.d} transform={`scale(.65) translate(${-g.width/2} 0)`}/><text y="92" textAnchor="middle" fontSize="14">{g.id}</text></g>})}<text x="490" y="545" textAnchor="middle" fontSize="15" fontStyle="italic">Reusable ink pieces · a partial alphabet, with alternate forms</text></g>}
