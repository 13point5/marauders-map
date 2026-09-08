"""Fit reusable letters to the small entrance detail, independently of connectors.
Measurements are authoring guidance, not a claim of exact character transcription.
"""
import cv2,numpy as np,json
from pathlib import Path
from scipy.optimize import differential_evolution
root=Path(__file__).resolve().parents[1]
src=cv2.imread(str(root/'outputs/study/reference-ink-mask.png'),0);full=np.zeros((1311,1090),np.uint8);full[65:1090,60:1070]=src
# Crops isolate the letter-shaped ink at the ends and edges of the returns.
slots=[('capital','R',(875,842,951,900),(910,872),(45,65),(32,54)),('capital','A',(908,895,982,949),(944,920),(38,62),(32,52)),('capital','M',(922,944,991,1008),(955,977),(40,67),(25,45)),('cursive','m',(867,941,947,1005),(910,972),(46,72),(20,36)),('cursive','s',(606,984,674,1040),(641,1010),(27,46),(23,42))]
result=[]
for family,glyph,(x0,y0,x1,y1),(cx,cy),wr,hr in slots:
 name=glyph if family=='capital' else 'script-'+glyph
 template=cv2.imread(str(root/f'outputs/reconstruction/templates/{name}.png'),0)
 th,tw=template.shape;target=full[y0:y1,x0:x1]>127;total=target.sum()
 def render(v):
  x,y,angle,w,h=v;c=np.cos(angle*np.pi/180);s=np.sin(angle*np.pi/180)
  a=c*w/tw;b=-s*h/th;d=s*w/tw;e=c*h/th
  return cv2.warpAffine(template,np.array([[a,b,x-x0-a*tw/2-b*th/2],[d,e,y-y0-d*tw/2-e*th/2]],np.float32),(x1-x0,y1-y0),flags=cv2.INTER_LINEAR)>127
 def loss(v):
  ink=render(v);return -2*np.logical_and(ink,target).sum()/(ink.sum()+total)
 fit=differential_evolution(loss,[(cx-8,cx+8),(cy-8,cy+8),(-180,180),wr,hr],popsize=12,maxiter=120,seed=13,polish=False,tol=.001)
 x,y,angle,w,h=fit.x
 result.append({'family':family,'glyph':glyph,'x':round(x,3),'y':round(y,3),'angle':round(angle,3),'width':round(w,3),'height':round(h,3)})
 print(glyph,result[-1], 'local fit',round(-fit.fun,3))
path=root/'app/letter-kit/reference-layout.json';layout=json.loads(path.read_text())
layout['entrance']={'letters':result,'connectors':['M608 984 Q637 950 671 933 L717 1007 L660 1018', 'M796 875 Q773 878 759 898 L786 961 L865 916 Q862 939 891 950', 'M900 993 Q912 1006 920 1040 L989 1025 Q982 1004 967 1002', 'M921 849L919 851']}
path.write_text(json.dumps(layout,separators=(',',':')))
