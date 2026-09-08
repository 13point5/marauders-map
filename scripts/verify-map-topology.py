"""Verify that vectorization neither splits nor merges selected source components."""
from pathlib import Path
import cv2,numpy as np,json
root=Path(__file__).resolve().parents[1]
for name in ['clock-halls','stairwell']:
 work=root/'outputs'/name
 source=cv2.imread(str(work/'source-ink-mask.png'),0)>128
 render=cv2.imread(str(work/'rendered-ink-mask.png'),0)>128
 n,labels,stats,_=cv2.connectedComponentsWithStats(source.astype(np.uint8))
 _,render_labels,_,_=cv2.connectedComponentsWithStats(render.astype(np.uint8))
 broken=[];owners={};checked=0
 for i in range(1,n):
  if stats[i,4]<150:continue
  x,y,w,h,_=stats[i];core=cv2.erode((labels[y:y+h,x:x+w]==i).astype(np.uint8),np.ones((3,3),np.uint8))>0
  ids=np.unique(render_labels[y:y+h,x:x+w][core]);ids=ids[ids!=0];checked+=1
  if len(ids)!=1:broken.append(int(i))
  for rid in ids:owners.setdefault(int(rid),[]).append(i)
 merged=[v for v in owners.values() if len(v)>1]
 assert not broken,(name,broken)
 assert not merged,(name,merged)
 report={'checked':checked,'broken':broken,'merged':merged};(work/'topology.json').write_text(json.dumps(report,indent=2));print(name,report)
