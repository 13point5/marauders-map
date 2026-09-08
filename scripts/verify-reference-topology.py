"""Check continuity and the unmarked interior after rasterizing the SVG.
Run verify-reference-section.mjs first to produce the rendered ink mask.
"""
import cv2,numpy as np,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
work=root/'outputs/reference-section'
s=cv2.imread(str(work/'source-ink-mask.png'),0)>128
r=cv2.imread(str(work/'rendered-ink-mask.png'),0)>128
n,labels,stats,_=cv2.connectedComponentsWithStats(s.astype(np.uint8))
_,render_labels,_,_=cv2.connectedComponentsWithStats(r.astype(np.uint8))
broken=[];checked=0
for i in range(1,n):
 if stats[i,4]<150:continue
 core=cv2.erode((labels==i).astype(np.uint8),np.ones((3,3),np.uint8))>0
 ids=np.unique(render_labels[core]);ids=ids[ids!=0];checked+=1
 if len(ids)!=1:broken.append((i,len(ids)))
assert not broken,broken
m=json.loads((root/'app/map-sections/reference-section.json').read_text());scale=m['sourceOrientedSize'][0]/1650
x,y=[round((v-o)*scale) for v,o in zip([1090,550],m['crop1650'][:2])];radius=round(50*scale)
empty=not r[y-radius:y+radius,x-radius:x+radius].any();assert empty
report={'connectedInkComponentsChecked':checked,'brokenConnections':broken,'centralVoidEmpty':bool(empty)}
(work/'topology.json').write_text(json.dumps(report,indent=2)+'\n');print(report)
