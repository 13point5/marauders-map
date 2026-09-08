import {sections,fullMapBox} from './sections';
export function MapArt(){
 return <svg viewBox={fullMapBox.join(' ')} className="map-canvas" role="img" aria-label="The tower, connected halls, and stairwell">
  {sections.map(({id,source})=><image key={id} data-source-traced={id} href={`/study/${id}.svg`} x={source.crop1650[0]} y={source.crop1650[1]} width={source.crop1650[2]-source.crop1650[0]} height={source.crop1650[3]-source.crop1650[1]}/>)}
 </svg>;
}
