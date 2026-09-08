import test from 'node:test';
import assert from 'node:assert/strict';
import {anchoredScroll,pinchZoom,clampZoom} from '../app/map-camera.ts';

test('pinch distance doubles the zoom and respects bounds',()=>{assert.equal(pinchZoom(1.5,100,200),3);assert.equal(pinchZoom(4,100,200),5);assert.equal(pinchZoom(1,100,1),1);assert.equal(clampZoom(9),5)});
test('zoom keeps the map point under the cursor',()=>{const n=anchoredScroll({scrollX:300,scrollY:150,viewWidth:600,viewHeight:400,mapWidth:1000,oldZoom:1,newZoom:2,anchorX:120,anchorY:80});assert.deepEqual(n,{x:720,y:380});assert.equal((300+120)/1000,(n.x+120)/2000);assert.equal((150+80)/600,(n.y+80)/1200)});
test('fit resets both offsets even when the paper is letterboxed',()=>{const n=anchoredScroll({scrollX:700,scrollY:400,viewWidth:1200,viewHeight:800,mapWidth:1000,oldZoom:3,newZoom:1,anchorX:600,anchorY:400});assert.deepEqual(n,{x:0,y:0})});
test('zoom from a centered phone overview accounts for the paper margins',()=>{const n=anchoredScroll({scrollX:0,scrollY:0,viewWidth:360,viewHeight:500,mapWidth:360,oldZoom:1,newZoom:3,anchorX:180,anchorY:250});assert.deepEqual(n,{x:360,y:74})});
test('edge gestures clamp inside the paper',()=>{const n=anchoredScroll({scrollX:9000,scrollY:9000,viewWidth:320,viewHeight:500,mapWidth:300,oldZoom:2,newZoom:3,anchorX:10,anchorY:10});assert.deepEqual(n,{x:580,y:40})});

test('portrait drawings keep the map point under the zoom anchor',()=>{
 const result=anchoredScroll({scrollX:0,scrollY:0,viewWidth:390,viewHeight:600,mapWidth:300,mapHeight:500,oldZoom:1,newZoom:2,anchorX:195,anchorY:300});
 assert.equal(result.x,105);assert.equal(result.y,200);
});
