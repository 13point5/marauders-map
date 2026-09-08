'use client';
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { anchoredScroll, clampZoom, pinchZoom } from './map-camera';

type Position={x:number;y:number};
type GestureEvent=Event & {scale:number;clientX:number;clientY:number};
export function useMapNavigation(viewport:RefObject<HTMLDivElement|null>,open:boolean,zoom:number,setZoom:(n:number)=>void,mapWidth:number,mapHeight=mapWidth*.6) {
 const current=useRef({zoom,mapWidth,mapHeight});
 const pending=useRef<Position|null>(null);
 const zoomAction=useRef<(n:number,p?:Position)=>void>(()=>{});
 // oxlint-disable-next-line react/react-compiler -- scrollLeft/scrollTop are owned DOM properties, not mutations of React props or state.
 useLayoutEffect(()=>{current.current={zoom,mapWidth,mapHeight};const el=viewport.current;if(el&&pending.current){el.scrollLeft=pending.current.x;el.scrollTop=pending.current.y;pending.current=null}},[zoom,mapWidth,mapHeight,viewport]);
 useEffect(()=>{
  const el=viewport.current;if(!open||!el)return;
  const pointers=new Map<number,Position>();
  let start:Position|null=null,previous:Position|null=null,dragged=false,suppressUntil=0;
  let pinch:{distance:number;zoom:number;midpoint:Position}|null=null;
  let safariStartZoom=1;
  const local=(p:Position)=>{const rect=el.getBoundingClientRect();return {x:p.x-rect.left,y:p.y-rect.top}};
  const pair=()=>{const [a,b]=[...pointers.values()];return {distance:Math.hypot(a.x-b.x,a.y-b.y),midpoint:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}};
  const stop=()=>{pointers.clear();pinch=null;start=null;previous=null;el.classList.remove('is-dragging')};
  const zoomAt=(value:number,point?:Position)=>{
   const state=current.current,next=clampZoom(value);if(next===state.zoom)return;
   const anchor=point??{x:el.clientWidth/2,y:el.clientHeight/2};
   pending.current=anchoredScroll({scrollX:pending.current?.x??el.scrollLeft,scrollY:pending.current?.y??el.scrollTop,viewWidth:el.clientWidth,viewHeight:el.clientHeight,mapWidth:state.mapWidth,mapHeight:state.mapHeight,oldZoom:state.zoom,newZoom:next,anchorX:anchor.x,anchorY:anchor.y});
   current.current={...state,zoom:next};setZoom(next);
  };
  zoomAction.current=zoomAt;
  const down=(e:PointerEvent)=>{
   if(e.pointerType==='mouse'&&e.button!==0)return;
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pointers.size===1){start={x:e.clientX,y:e.clientY};previous=start;dragged=false;if(!(e.target as Element).closest('button,[role="button"],a'))el.focus({preventScroll:true})}
   if(pointers.size===2){const data=pair();pinch={...data,zoom:current.current.zoom};dragged=true;suppressUntil=Date.now()+500;for(const id of pointers.keys())el.setPointerCapture(id)}
  };
  const move=(e:PointerEvent)=>{
   if(!pointers.has(e.pointerId))return;
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pointers.size>=2&&pinch){e.preventDefault();const data=pair();const anchor=local(pinch.midpoint);zoomAt(pinchZoom(pinch.zoom,pinch.distance,data.distance),anchor);
    const target=pending.current??{x:el.scrollLeft,y:el.scrollTop};target.x-=data.midpoint.x-pinch.midpoint.x;target.y-=data.midpoint.y-pinch.midpoint.y;
    if(pending.current)pending.current=target;else{el.scrollLeft=target.x;el.scrollTop=target.y}
    pinch={distance:data.distance,midpoint:data.midpoint,zoom:current.current.zoom};el.classList.add('is-dragging');return;
   }
   if(!previous||!start)return;
   if(!dragged&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<6)return;
   dragged=true;el.setPointerCapture(e.pointerId);el.classList.add('is-dragging');e.preventDefault();el.scrollLeft-=e.clientX-previous.x;el.scrollTop-=e.clientY-previous.y;previous={x:e.clientX,y:e.clientY};
  };
  const up=(e:PointerEvent)=>{
   if(dragged)suppressUntil=Date.now()+400;
   pointers.delete(e.pointerId);if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);pinch=null;
   previous=[...pointers.values()][0]??null;start=previous;
   if(!pointers.size)el.classList.remove('is-dragging');
  };
  const click=(e:MouseEvent)=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation()}};
  const wheel=(e:WheelEvent)=>{e.preventDefault();const factor=e.deltaMode===1?16:e.deltaMode===2?el.clientHeight:1;if(e.ctrlKey||e.metaKey)zoomAt(current.current.zoom*Math.exp(-e.deltaY*factor*.008),local({x:e.clientX,y:e.clientY}));else{el.scrollLeft+=(e.shiftKey&&!e.deltaX?e.deltaY:e.deltaX)*factor;el.scrollTop+=(e.shiftKey?0:e.deltaY)*factor}};
  const doubleClick=(e:MouseEvent)=>{if((e.target as Element).closest('button,[role="button"],a'))return;e.preventDefault();zoomAt(current.current.zoom*1.5,local({x:e.clientX,y:e.clientY}))};
  const key=(e:KeyboardEvent)=>{if(e.target!==el)return;const step=e.shiftKey?150:55;const delta:Record<string,Position>={ArrowLeft:{x:-step,y:0},ArrowRight:{x:step,y:0},ArrowUp:{x:0,y:-step},ArrowDown:{x:0,y:step}};
   if(delta[e.key]){e.preventDefault();el.scrollLeft+=delta[e.key].x;el.scrollTop+=delta[e.key].y}
   else if(['+','=','-','0'].includes(e.key)){e.preventDefault();zoomAt(e.key==='0'?1:current.current.zoom+(e.key==='-'?-.5:.5))}
  };
  const gestureStart=(e:Event)=>{e.preventDefault();safariStartZoom=current.current.zoom};
  const gestureChange=(event:Event)=>{event.preventDefault();const e=event as GestureEvent;zoomAt(safariStartZoom*e.scale,local({x:e.clientX,y:e.clientY}))};
  const gestureEnd=(e:Event)=>e.preventDefault();
  const preventDrag=(e:DragEvent)=>e.preventDefault();
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move,{passive:false});el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('click',click,true);el.addEventListener('wheel',wheel,{passive:false});el.addEventListener('dblclick',doubleClick);el.addEventListener('keydown',key);el.addEventListener('dragstart',preventDrag);
  el.addEventListener('gesturestart',gestureStart,{passive:false});el.addEventListener('gesturechange',gestureChange,{passive:false});el.addEventListener('gestureend',gestureEnd,{passive:false});window.addEventListener('blur',stop);
  return()=>{stop();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('click',click,true);el.removeEventListener('wheel',wheel);el.removeEventListener('dblclick',doubleClick);el.removeEventListener('keydown',key);el.removeEventListener('dragstart',preventDrag);el.removeEventListener('gesturestart',gestureStart);el.removeEventListener('gesturechange',gestureChange);el.removeEventListener('gestureend',gestureEnd);window.removeEventListener('blur',stop)};
 },[open,setZoom,viewport]);
 return {zoomTo:(value:number)=>zoomAction.current(value)};
}
