'use client';
import {useEffect,useRef,useState} from 'react';
import {Minus,Plus,Scan,Shuffle} from 'lucide-react';
import {useMapNavigation} from './use-map-navigation';
import {OriginalBuilding,LetterKit} from './letter-kit/art';
import {RebuiltTower} from './letter-kit/rebuilt-art';
import './tower-study.css';
type Mode='trace'|'photo'|'overlay';
type Compare='rebuilt'|'original'|'overlay'|'parts';
type Study='reconstruction'|'observatory'|'gallery'|'reference'|'letters';
export default function TowerStudy(){
 const [study,setStudy]=useState<Study>('reconstruction'),[mode,setMode]=useState<Mode>('trace'),[seed,setSeed]=useState(13);
 const [comparison,setComparison]=useState<Compare>('rebuilt');
 const [zoom,setZoom]=useState(1),[mapWidth,setMapWidth]=useState(1000);
 const viewport=useRef<HTMLDivElement>(null);
 const {zoomTo}=useMapNavigation(viewport,true,zoom,setZoom,mapWidth);
 useEffect(()=>{const el=viewport.current;if(!el)return;const measure=()=>setMapWidth(Math.min(el.clientWidth/((study==='reference'||study==='reconstruction')?.56:.72),el.clientHeight*5/3));const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect()},[study]);
 useEffect(()=>{const el=viewport.current;if(el){el.scrollLeft=(el.scrollWidth-el.clientWidth)/2;el.scrollTop=(el.scrollHeight-el.clientHeight)/2}},[mapWidth]);
 const original=study==='observatory'||study==='gallery';
 function changeStudy(s:Study){setStudy(s);zoomTo(1)}
 return <main className="tower-study">
  <header className="study-header"><div><span className="study-folio">III · REBUILDING THE REFERENCE</span><h1>The same tower, piece by piece</h1></div><span className="study-source">A study in reusable lettering</span></header>
  <nav className="study-modes study-choices" aria-label="Choose a design study">{([['reconstruction','Rebuilt tower'],['observatory','New observatory'],['gallery','New gallery'],['reference','Reference tower'],['letters','Letter kit']] as [Study,string][]).map(([s,label])=><button key={s} aria-pressed={study===s} onClick={()=>changeStudy(s)}>{label}</button>)}</nav>
  <div className="study-secondary">{study==='reconstruction'?<nav className="reference-modes" aria-label="Compare the reconstruction">{([['rebuilt','Rebuilt'],['original','Original trace'],['overlay','Overlay'],['parts','Show parts']] as [Compare,string][]).map(([c,label])=><button key={c} aria-pressed={comparison===c} onClick={()=>setComparison(c)}>{label}</button>)}</nav>:study==='reference'?<nav className="reference-modes" aria-label="Compare with the photograph">{(['trace','photo','overlay'] as Mode[]).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='trace'?'The drawing':m==='photo'?'Your photograph':'Compare overlay'}</button>)}</nav>:original?<button className="reletter" onClick={()=>setSeed(s=>s+1)}><Shuffle size={14}/> Rearrange the lettering</button>:<p>Each piece can be moved, rotated, and scaled independently.</p>}</div>
  <div ref={viewport} className="map-viewport study-viewport" role="region" tabIndex={0} aria-label="Map study. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan; zero fits.">
   <div className="study-paper" style={{width:mapWidth*zoom}}>
    <svg viewBox="0 0 1000 600" className="tower-canvas" role="img" aria-label={original?'An original floor plan built from reusable letter shapes':study==='reconstruction'?'Reference tower reconstructed from reusable letter pieces':study==='letters'?'The reusable hand-lettered vector kit':'The approved reference tower'}>
     {study==='reconstruction'?<svg x="240" y="36" width="520" height="528" viewBox="60 65 1010 1025">
      {(comparison==='original'||comparison==='overlay')&&<image href="/study/stair-tower.svg" x="60" y="65" width="1010" height="1025" opacity={comparison==='overlay'?.45:1}/>}
      {comparison!=='original'&&<RebuiltTower colored={comparison==='parts'} overlay={comparison==='overlay'}/>}
     </svg>:original?<OriginalBuilding plan={study} seed={seed}/>:study==='letters'?<LetterKit/>:<>
      {mode!=='trace'&&<image href="/study/tower-reference.jpg" x="240" y="36" width="520" height="528"/>}
      {mode!=='photo'&&<image href="/study/stair-tower.svg" x="240" y="36" width="520" height="528" className={mode==='overlay'?'trace-overlay':undefined}/>}
     </>}
    </svg>
   </div>
  </div>
  <footer className="study-footer"><p>{study==='reconstruction'?comparison==='overlay'?'Teal: rebuilt · brown: original · aligned at the same scale':comparison==='parts'?'Brown: capitals · rust: italic letters · teal: stairs · gold: entrance':'71 reused capitals · fitted stairs · approximate cursive':study==='reference'&&mode==='overlay'?'Drawing over photograph · same scale and position':'Drag to explore · pinch or Ctrl/⌘-scroll to zoom'}</p><div className="study-zoom"><button onClick={()=>zoomTo(zoom-.5)} disabled={zoom<=1} aria-label="Zoom out"><Minus size={18}/></button><button onClick={()=>zoomTo(1)} aria-label="Fit drawing"><Scan size={16}/><span>{zoom===1?'Fit':`${Math.round(zoom*100)}%`}</span></button><button onClick={()=>zoomTo(zoom+.5)} disabled={zoom>=5} aria-label="Zoom in"><Plus size={18}/></button></div></footer>
 </main>
}
