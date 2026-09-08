import {sections,fullMapBox,type SectionId,type ViewMode} from './sections';
export function MapArt({section,mode,box}:{section:SectionId;mode:ViewMode;box:readonly number[]}){
 const chosen=sections.filter(s=>section==='all'||s.id===section);
 const photoBox=section==='all'?fullMapBox:(()=>{const b=chosen[0].source.crop1650;return [b[0],b[1],b[2]-b[0],b[3]-b[1]]})();
 return <svg viewBox={box.join(' ')} className="map-canvas" role="img" aria-label={section==='all'?'The photographed tower, connected halls, and stairwell':chosen[0].label}>
  {mode!=='drawing'&&<image href={`/study/${section==='all'?'map':section}-photo.jpg`} x={photoBox[0]} y={photoBox[1]} width={photoBox[2]} height={photoBox[3]} opacity={mode==='overlay'?.65:1}/>}
  {mode!=='photo'&&chosen.map(({id,source})=><image key={id} data-source-traced={id} href={`/study/${id}.svg`} x={source.crop1650[0]} y={source.crop1650[1]} width={source.crop1650[2]-source.crop1650[0]} height={source.crop1650[3]-source.crop1650[1]} className={mode==='overlay'?'ink-overlay':undefined}/>)}
 </svg>;
}
