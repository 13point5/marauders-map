'use client';
import {useEffect,useRef,useState} from 'react';
import {Minus,Plus,Scan,Shuffle} from 'lucide-react';
import {useMapNavigation} from './use-map-navigation';
import {OriginalBuilding,LetterKit,type KitStyle} from './letter-kit/art';
import {entranceOptions,type EntranceVariant} from './letter-kit/entrance-variants';
import {ReferenceSectionArt,sectionFocuses,type SectionMode,type SectionFocus} from './letter-kit/reference-section-art';
import {RebuiltTower} from './letter-kit/rebuilt-art';
import './tower-study.css';
type Mode='trace'|'photo'|'overlay';
type Compare='rebuilt'|'original'|'overlay'|'parts';
type Study='wing'|'reconstruction'|'observatory'|'gallery'|'reference'|'letters';
export default function TowerStudy(){
 const [study,setStudy]=useState<Study>('wing'),[mode,setMode]=useState<Mode>('trace'),[seed,setSeed]=useState(13);
 const [entrance,setEntrance]=useState<EntranceVariant>('quiet'),[entranceDetail,setEntranceDetail]=useState(true);
 const [kitStyle,setKitStyle]=useState<KitStyle>('capitals');
 const [showJoins,setShowJoins]=useState(false);
 const [sectionMode,setSectionMode]=useState<SectionMode>('drawing');
 const [sectionFocus,setSectionFocus]=useState<SectionFocus>('whole');
 const [comparison,setComparison]=useState<Compare>('rebuilt');
 const [zoom,setZoom]=useState(1),[mapWidth,setMapWidth]=useState(1000);
 const viewport=useRef<HTMLDivElement>(null);
 const portrait=study==='wing'&&sectionFocus==='whole';
 const paperRatio=study==='wing'?(portrait?.6:1000/740):5/3;
 const {zoomTo}=useMapNavigation(viewport,true,zoom,setZoom,mapWidth,mapWidth/paperRatio);
 useEffect(()=>{const el=viewport.current;if(!el)return;const measure=()=>setMapWidth(study==='wing'?Math.min(el.clientWidth*.94,el.clientHeight*paperRatio):Math.min(el.clientWidth/(study==='reconstruction'?(entranceDetail?.82:.56):study==='reference'?.56:.72),el.clientHeight*5/3));const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect()},[study,entranceDetail,paperRatio]);
 useEffect(()=>{const el=viewport.current;if(el){el.scrollLeft=(el.scrollWidth-el.clientWidth)/2;el.scrollTop=(el.scrollHeight-el.clientHeight)/2}},[mapWidth]);
 const original=study==='observatory'||study==='gallery';
 function changeStudy(s:Study){setStudy(s);zoomTo(1)}
 return <main className="tower-study">
  <header className="study-header"><div><span className="study-folio">V · A MAP OF THE MIND</span><h1>{study==='wing'?'Tower & turning passage':'Letters into architecture'}</h1></div><span className="study-source">Sriraam’s personal cartography</span></header>
  <nav className="study-modes study-choices" aria-label="Choose a design study">{([['wing','Photo reconstruction'],['reconstruction','Rebuilt tower'],['observatory','New observatory'],['gallery','New gallery'],['reference','Reference tower'],['letters','Letter kit']] as [Study,string][]).map(([s,label])=><button key={s} aria-pressed={study===s} onClick={()=>changeStudy(s)}>{label}</button>)}</nav>
  <div className="study-secondary">{study==='wing'?<nav className="reference-modes" aria-label="Compare with your photograph">{([['drawing','Drawing'],['photo','Photograph'],['overlay','Overlay']] as [SectionMode,string][]).map(([m,label])=><button key={m} aria-pressed={sectionMode===m} onClick={()=>setSectionMode(m)}>{label}</button>)}</nav>:study==='reconstruction'?<nav className="reference-modes" aria-label="Compare the reconstruction">{([['rebuilt','Rebuilt'],['original','Original trace'],['overlay','Overlay'],['parts','Show parts']] as [Compare,string][]).map(([c,label])=><button key={c} aria-pressed={comparison===c} onClick={()=>setComparison(c)}>{label}</button>)}</nav>:study==='reference'?<nav className="reference-modes" aria-label="Compare with the photograph">{(['trace','photo','overlay'] as Mode[]).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='trace'?'The drawing':m==='photo'?'Your photograph':'Compare overlay'}</button>)}</nav>:original?<button className="reletter" onClick={()=>setSeed(s=>s+1)}><Shuffle size={14}/> Rearrange the lettering</button>:<nav className="reference-modes" aria-label="Choose a lettering alphabet">{([['capitals','Capitals A–Z'],['cursive-lower','Cursive a–z'],['cursive-upper','Cursive A–Z']] as [KitStyle,string][]).map(([k,label])=><button key={k} aria-pressed={kitStyle===k} onClick={()=>setKitStyle(k)}>{label}</button>)}</nav>}</div>
  {study==='wing'&&<nav className="entrance-options section-focus" aria-label="Inspect the source details">{sectionFocuses.map(([f,label])=><button key={f} aria-pressed={sectionFocus===f} onClick={()=>{setSectionFocus(f);zoomTo(1)}}>{label}</button>)}</nav>}
  {study==='reconstruction'&&<nav className="entrance-options" aria-label="Choose an entrance design">{entranceOptions.map((v,i)=><button key={v.id} aria-pressed={entrance===v.id} onClick={()=>setEntrance(v.id)}><span>{i+1}</span>{v.label}</button>)}</nav>}
  <div ref={viewport} className="map-viewport study-viewport" role="region" tabIndex={0} aria-label="Map study. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan; zero fits.">
   <div className="study-paper" style={{width:mapWidth*zoom,aspectRatio:paperRatio}}>
    <svg viewBox={study==='wing'?(portrait?'0 0 600 1000':'0 0 1000 740'):'0 0 1000 600'} className="tower-canvas" role="img" aria-label={study==='wing'?'The tower and turning passage reconstructed from the user’s photograph':original?'An original floor plan built from reusable letter shapes':study==='reconstruction'?'Reference tower reconstructed from reusable letter pieces':study==='letters'?'The reusable hand-lettered vector kit':'The approved reference tower'}>
     {study==='wing'?<ReferenceSectionArt mode={sectionMode} focus={sectionFocus}/>:study==='reconstruction'?<svg x={entranceDetail?120:240} y="36" width={entranceDetail?760:520} height="528" viewBox={entranceDetail?"550 770 510 340":"60 65 1010 1025"}>
      {(comparison==='original'||comparison==='overlay')&&<image href="/study/stair-tower.svg" x="60" y="65" width="1010" height="1025" opacity={comparison==='overlay'?.45:1}/>}
      {comparison!=='original'&&<RebuiltTower variant={entrance} colored={comparison==='parts'} overlay={comparison==='overlay'}/>}
     </svg>:original?<OriginalBuilding plan={study} seed={seed}/>:study==='letters'?<LetterKit style={kitStyle} showJoins={showJoins}/>:<>
      {mode!=='trace'&&<image href="/study/tower-reference.jpg" x="240" y="36" width="520" height="528"/>}
      {mode!=='photo'&&<image href="/study/stair-tower.svg" x="240" y="36" width="520" height="528" className={mode==='overlay'?'trace-overlay':undefined}/>}
     </>}
    </svg>
   </div>
  </div>
  <footer className="study-footer"><p>{study==='wing'?sectionMode==='overlay'?'Teal ink over your photograph · aligned at the same scale':'IMG_5431 · source-traced ink · drag to explore, pinch to zoom':study==='letters'?<a className="font-download" href={kitStyle==='capitals'?'/fonts/map-capitals.ttf':'/fonts/map-script.ttf'} download>{kitStyle==='capitals'?'Download capital font':'Download cursive font'}</a>:study==='reconstruction'?comparison==='overlay'?'Teal: rebuilt · brown: original · aligned at the same scale':comparison==='parts'?'Brown: capitals · rust: cursive letters · teal: stairs · gold: entrance':entranceOptions.find(v=>v.id===entrance)!.description:study==='reference'&&mode==='overlay'?'Drawing over photograph · same scale and position':'Drag to explore · pinch or Ctrl/⌘-scroll to zoom'}</p><div className="study-zoom">{study==='letters'&&<button className="detail-toggle" aria-pressed={showJoins} onClick={()=>setShowJoins(v=>!v)}>{showJoins?'Letters only':'Show joins'}</button>}{study==='reconstruction'&&<button className="detail-toggle" onClick={()=>{setEntranceDetail(d=>!d);zoomTo(1)}}>{entranceDetail?'Whole tower':'Entrance detail'}</button>}<button onClick={()=>zoomTo(zoom-.5)} disabled={zoom<=1} aria-label="Zoom out"><Minus size={18}/></button><button onClick={()=>zoomTo(1)} aria-label="Fit drawing"><Scan size={16}/><span>{zoom===1?'Fit':`${Math.round(zoom*100)}%`}</span></button><button onClick={()=>zoomTo(zoom+.5)} disabled={zoom>=5} aria-label="Zoom in"><Plus size={18}/></button></div></footer>

 </main>
}
