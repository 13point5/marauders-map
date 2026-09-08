import kit from './glyphs.json';
import font from './cursive-glyphs.json';
import layout from './reference-layout.json';
import {useMemo} from 'react';
import type {EntranceVariant} from './entrance-variants';
import {reconstructTower} from './reconstruction';
export function RebuiltTower({colored=false,overlay=false,variant='quiet'}:{colored?:boolean;overlay?:boolean;variant?:EntranceVariant}){
 const pieces=useMemo(()=>reconstructTower(kit,font,layout,variant),[variant]);
 const colors={capital:'#38271e',cursive:'#8d432f',stair:'#3e7377',doorway:'#9a6930'};
 return <g data-reconstruction="reusable-glyphs" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">{pieces.map((p,i)=>{
  const ink=overlay?'#087e91':colored?colors[p.kind]:'#36271f';
  return <path key={i} data-kind={p.kind} data-glyph={p.glyph} d={p.d} transform={p.transform} fill={p.fill||ink} stroke={p.strokeWidth?ink:undefined} strokeWidth={p.strokeWidth}/>;
 })}</g>
}
