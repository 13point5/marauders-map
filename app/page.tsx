'use client';
import {useEffect,useRef,useState} from 'react';
import {Minus,Plus,Scan} from 'lucide-react';
import {useMapNavigation} from './use-map-navigation';
import {MapArt} from './map-sections/map-art';
import {sections,focuses,type SectionId,type ViewMode} from './map-sections/sections';
import './map-study.css';
export default function MapStudy(){
 const [section,setSection]=useState<SectionId>('all');
 const [mode,setMode]=useState<ViewMode>('drawing');
 const [focus,setFocus]=useState('whole');
 const [zoom,setZoom]=useState(1),[mapWidth,setMapWidth]=useState(600);
 const viewport=useRef<HTMLDivElement>(null);
 const box=(focuses[section].find(f=>f.id===focus)??focuses[section][0]).box;
 const ratio=box[2]/box[3];
 const {zoomTo}=useMapNavigation(viewport,true,zoom,setZoom,mapWidth,mapWidth/ratio);
 useEffect(()=>{const el=viewport.current;if(!el)return;const measure=()=>setMapWidth(Math.min(el.clientWidth*.96,el.clientHeight*ratio*.96));const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect()},[ratio]);
 useEffect(()=>{const el=viewport.current;if(el){el.scrollLeft=(el.scrollWidth-el.clientWidth)/2;el.scrollTop=(el.scrollHeight-el.clientHeight)/2}},[mapWidth]);
 function changeSection(id:SectionId){setSection(id);setFocus('whole');zoomTo(1)}
 return <main className="map-study">
  <header className="study-header"><div><span className="study-folio">SRIRAAM’S CARTOGRAPHY</span><h1>{section==='all'?'The tower & neighbouring halls':sections.find(s=>s.id===section)!.label}</h1></div><span className="study-source">A study in ink & passageways</span></header>
  <nav className="section-tabs" aria-label="Explore map sections">
   <button aria-pressed={section==='all'} onClick={()=>changeSection('all')}>All sections</button>
   {sections.map(s=><button key={s.id} aria-pressed={section===s.id} onClick={()=>changeSection(s.id)}>{s.label}</button>)}
  </nav>
  <nav className="compare-tabs" aria-label="Compare with your photograph">{([['drawing','Drawing'],['photo','Photograph'],['overlay','Overlay']] as const).map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)}>{label}</button>)}</nav>
  {focuses[section].length>1&&<nav className="focus-tabs" aria-label="Inspect the source details">{focuses[section].map(f=><button key={f.id} aria-pressed={focus===f.id} onClick={()=>{setFocus(f.id);zoomTo(1)}}>{f.label}</button>)}</nav>}
  <div ref={viewport} className="map-viewport" role="region" tabIndex={0} aria-label="Map. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan; zero fits.">
   <div className="map-paper" style={{width:mapWidth*zoom,aspectRatio:ratio}}><MapArt section={section} mode={mode} box={box}/></div>
  </div>
  <footer className="study-footer"><p>{mode==='overlay'?'Teal ink over your photograph · aligned at the same scale':'Drag to explore · pinch or Ctrl/⌘-scroll to zoom'}</p><div className="study-zoom"><button onClick={()=>zoomTo(zoom-.5)} disabled={zoom<=1} aria-label="Zoom out"><Minus size={18}/></button><button onClick={()=>zoomTo(1)} aria-label="Fit drawing"><Scan size={16}/><span>{zoom===1?'Fit':`${Math.round(zoom*100)}%`}</span></button><button onClick={()=>zoomTo(zoom+.5)} disabled={zoom>=5} aria-label="Zoom in"><Plus size={18}/></button></div></footer>
 </main>
}
