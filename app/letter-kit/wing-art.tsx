'use client';
import {useMemo} from 'react';
import glyphs from './glyphs.json';
import script from './cursive-glyphs.json';
import {astronomyWing} from './astronomy-wing';
export function WingArt({walking,onOpen}:{walking:boolean;onOpen:()=>void}){
 const {pieces}=useMemo(()=>astronomyWing(glyphs,script),[]);
 return <g className="astronomy-wing" fill="#36271f" fillRule="evenodd">
  <g>{pieces.map((p,i)=><path key={i} data-wing-kind={p.kind} d={p.d} transform={p.transform} fill={p.fill||'#36271f'} stroke={p.strokeWidth?'#36271f':undefined} strokeWidth={p.strokeWidth} strokeLinecap="round"/>)}</g>
  <g className="wing-titles" textAnchor="middle">
   <text x="677" y="95" fontSize="29" fontStyle="italic">The Astronomy Wing</text><text x="677" y="118" fontSize="10" letterSpacing="3">A MAP OF THE INQUIRING MIND</text>
   <text x="286" y="287" fontSize="21">Astronomy</text><text x="286" y="311" fontSize="21">Tower</text><text x="286" y="336" fontSize="9" letterSpacing="2">LEARNING TO LEARN</text>
   <text x="697" y="273" fontSize="27">The Room</text><text x="697" y="306" fontSize="27">of Questions</text>
   <text x="510" y="436" fontSize="12" fontStyle="italic" transform="rotate(-7 510 436)">The turning passage</text>
  </g>
  <g role="button" tabIndex={0} aria-label="Open Sriraam’s research notes" className="wing-room" onClick={onOpen} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen()}}}>
   <rect x="613" y="242" width="170" height="104" rx="30" fill="transparent"/><path d="M659 345 Q695 350 736 345" fill="none" stroke="#6e4d31" strokeWidth=".8"/>
  </g>
  <g className={walking?'wing-walker':'wing-walker paused'}>
   <g className="walker-trail" fill="#59412d">{[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${-i*8} ${i%2?4:-4}) rotate(90)`} opacity={1-i*.14}><ellipse cy="-2" rx="1.7" ry="3.2"/><path d="M-1.6 2h3.2v2h-3.2Z"/></g>)}</g>
   <g transform="translate(0 -23)"><path d="M-30-10L28-12L33 4L-27 7Z" fill="#e8dfc9" stroke="#755a3e" strokeWidth=".7"/><text textAnchor="middle" y="0" fontSize="11" fontStyle="italic">Sriraam</text></g>
  </g>
  <g transform="translate(142 504)" stroke="#6b5039" fill="none"><path d="M0-20L0 18M-13 0H13M-4-8L0-20L4-8" strokeWidth=".9"/><text y="-29" textAnchor="middle" stroke="none" fill="#6b5039" fontSize="11">N</text></g>
  <text x="832" y="498" textAnchor="end" className="wing-titles" fontSize="12" fontStyle="italic">No. 013½ · Sriraam’s atlas</text>
 </g>
}
