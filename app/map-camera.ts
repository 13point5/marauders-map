export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;
export const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
export function pinchZoom(startZoom: number, startDistance: number, distance: number) {
  return clampZoom(startZoom * distance / Math.max(1, startDistance));
}
export function anchoredScroll({scrollX,scrollY,viewWidth,viewHeight,mapWidth,mapHeight=mapWidth*.6,oldZoom,newZoom,anchorX,anchorY}:{scrollX:number;scrollY:number;viewWidth:number;viewHeight:number;mapWidth:number;mapHeight?:number;oldZoom:number;newZoom:number;anchorX:number;anchorY:number}) {
  const axis=(scroll:number,view:number,base:number,anchor:number)=>{
    const oldMargin=Math.max(0,(view-base*oldZoom)/2);
    const newMargin=Math.max(0,(view-base*newZoom)/2);
    const position=(scroll+anchor-oldMargin)/oldZoom;
    return Math.max(0,Math.min(base*newZoom-view,position*newZoom+newMargin-anchor));
  };
  return {x:axis(scrollX,viewWidth,mapWidth,anchorX),y:axis(scrollY,viewHeight,mapHeight,anchorY)};
}
