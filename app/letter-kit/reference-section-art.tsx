import source from './reference-section.json';
export type SectionMode='drawing'|'photo'|'overlay';
export type SectionFocus='whole'|'tower'|'entrance'|'bend';
export const sectionFocuses=[['whole','Whole section'],['tower','Tower'],['entrance','Entrance joins'],['bend','Passage bend']] as const;
const viewBoxes:Record<SectionFocus,string>={whole:`0 0 ${source.width} ${source.height}`,tower:'5 20 1040 1150',entrance:'470 800 640 610',bend:'450 1310 675 760'};
export function ReferenceSectionArt({mode,focus}:{mode:SectionMode;focus:SectionFocus}){
 return <svg x="20" y="20" width={focus==='whole'?560:960} height={focus==='whole'?960:700} viewBox={viewBoxes[focus]} aria-label="The photographed stair tower and turning passage, with an empty central circle">
  {mode!=='drawing'&&<image href="/study/reference-section-photo.jpg" width={source.width} height={source.height} opacity={mode==='overlay'?.65:1}/>}
  {mode!=='photo'&&<image data-source-traced="IMG_5431" href="/study/reference-section.svg" width={source.width} height={source.height} className={mode==='overlay'?'section-ink-overlay':undefined}/>}
 </svg>;
}
