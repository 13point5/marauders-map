'use client';
import {useEffect,useRef,useState} from 'react';
import {Minus,Plus,Scan} from 'lucide-react';
import {useMapNavigation} from './use-map-navigation';
import {MapArt} from './map-sections/map-art';
import {fullMapBox} from './map-sections/sections';
import './map-study.css';
export default function MapStudy(){
 const [zoom,setZoom]=useState(1),[mapWidth,setMapWidth]=useState(600);
 const viewport=useRef<HTMLDivElement>(null);
 const ratio=fullMapBox[2]/fullMapBox[3];
 const {zoomTo}=useMapNavigation(viewport,true,zoom,setZoom,mapWidth,mapWidth/ratio);
 useEffect(()=>{const el=viewport.current;if(!el)return;const measure=()=>setMapWidth(Math.min(el.clientWidth*.96,el.clientHeight*ratio*.96));const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect()},[ratio]);
 useEffect(()=>{const el=viewport.current;if(el){el.scrollLeft=(el.scrollWidth-el.clientWidth)/2;el.scrollTop=(el.scrollHeight-el.clientHeight)/2}},[mapWidth]);
 return <main className="map-study">
  <header className="study-header"><div><span className="study-folio">SRIRAAM’S CARTOGRAPHY</span><h1>The tower & neighbouring halls</h1></div><span className="study-source">A study in ink & passageways</span></header>
  <div ref={viewport} className="map-viewport" role="region" tabIndex={0} aria-label="Map. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan; zero fits.">
   <div className="map-paper" style={{width:mapWidth*zoom,aspectRatio:ratio}}><MapArt/></div>
  </div>
  <footer className="study-footer"><p>Drag to explore · pinch or Ctrl/⌘-scroll to zoom</p><div className="study-zoom"><button onClick={()=>zoomTo(zoom-.5)} disabled={zoom<=1} aria-label="Zoom out"><Minus size={18}/></button><button onClick={()=>zoomTo(1)} aria-label="Fit drawing"><Scan size={16}/><span>{zoom===1?'Fit':`${Math.round(zoom*100)}%`}</span></button><button onClick={()=>zoomTo(zoom+.5)} disabled={zoom>=5} aria-label="Zoom in"><Plus size={18}/></button></div></footer>
 </main>
}
