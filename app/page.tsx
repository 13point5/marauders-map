'use client';
import {useEffect,useRef,useState} from 'react';
import {Minus,Plus,Scan} from 'lucide-react';
import {useMapNavigation} from './use-map-navigation';
import './tower-study.css';

type Mode='trace'|'photo'|'overlay';
export default function TowerStudy(){
 const [mode,setMode]=useState<Mode>('trace');
 const [zoom,setZoom]=useState(1),[mapWidth,setMapWidth]=useState(1000);
 const viewport=useRef<HTMLDivElement>(null);
 const {zoomTo}=useMapNavigation(viewport,true,zoom,setZoom,mapWidth);
 useEffect(()=>{const el=viewport.current;if(!el)return;const measure=()=>setMapWidth(Math.min(el.clientWidth/.56,el.clientHeight*5/3));const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect()},[]);
 useEffect(()=>{const el=viewport.current;if(el){el.scrollLeft=(el.scrollWidth-el.clientWidth)/2;el.scrollTop=(el.scrollHeight-el.clientHeight)/2}},[mapWidth]);
 return <main className="tower-study">
  <header className="study-header"><div><span className="study-folio">I · A STUDY IN INK</span><h1>The stair tower</h1></div><span className="study-source">After your Marauder’s Map · IMG_5431</span></header>
  <nav className="study-modes" aria-label="Compare the tower with the photograph">{(['trace','photo','overlay'] as Mode[]).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='trace'?'The drawing':m==='photo'?'Your photograph':'Compare overlay'}</button>)}</nav>
  <div ref={viewport} className="map-viewport study-viewport" role="region" tabIndex={0} aria-label="Tower study. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan; zero fits.">
   <div className="study-paper" style={{width:mapWidth*zoom}}>
    <svg viewBox="0 0 1000 600" className="tower-canvas" role="img" aria-label={mode==='trace'?'A single irregular stair tower formed from hand-lettered ink, with an open center and radial steps':mode==='photo'?'The original stair tower in your photograph':'The vector contours aligned over your original photograph'}>
     {/* The photo and vector share an identical crop and registration. */}
     {mode!=='trace'&&<image href="/study/tower-reference.jpg" x="240" y="36" width="520" height="528"/>}
     {mode!=='photo'&&<image href="/study/stair-tower.svg" x="240" y="36" width="520" height="528" className={mode==='overlay'?'trace-overlay':undefined}/>}
    </svg>
   </div>
  </div>
  <footer className="study-footer"><p>{mode==='overlay'?'Drawing over photograph · same scale and position':'Drag to explore · pinch or Ctrl/⌘-scroll to zoom'}</p><div className="study-zoom"><button onClick={()=>zoomTo(zoom-.5)} disabled={zoom<=1} aria-label="Zoom out"><Minus size={18}/></button><button onClick={()=>zoomTo(1)} aria-label="Fit tower"><Scan size={16}/><span>{zoom===1?'Fit':`${Math.round(zoom*100)}%`}</span></button><button onClick={()=>zoomTo(zoom+.5)} disabled={zoom>=5} aria-label="Zoom in"><Plus size={18}/></button></div></footer>
 </main>
}
