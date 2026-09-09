import json,math,cv2,numpy as np
from pathlib import Path
from fontTools.pens.basePen import BasePen
from fontTools.svgLib.path import parse_path
class Flatten(BasePen):
 def __init__(self):super().__init__(None);self.contours=[];self.points=[]
 def _moveTo(self,p):self.points=[p]
 def _lineTo(self,p):self.points.append(p)
 def _curveToOne(self,a,b,c):
  p=self._getCurrentPoint()
  for t in np.linspace(0,1,5)[1:]:self.points.append(tuple((1-t)**3*p[i]+3*(1-t)**2*t*a[i]+3*(1-t)*t*t*b[i]+t**3*c[i] for i in range(2)))
 def _qCurveToOne(self,a,b):
  p=self._getCurrentPoint()
  for t in np.linspace(0,1,4)[1:]:self.points.append(tuple((1-t)**2*p[i]+2*(1-t)*t*a[i]+t*t*b[i] for i in range(2)))
 def _closePath(self):self.contours.append(self.points);self.points=[]
 def _endPath(self):self._closePath()
for file in ['glyphs','cursive-glyphs']:
 path=Path('app/research')/(file+'.json');data=json.loads(path.read_text());glyphs=data if isinstance(data,list) else data['glyphs'].values()
 for g in glyphs:
  p=Flatten();parse_path(g['d'],p);d=''
  for contour in p.contours:
   pts=cv2.approxPolyDP(np.array(contour,dtype=np.float32),.22,True).reshape(-1,2)
   d+='M'+'L'.join(f'{x:.2f} {y:.2f}' for x,y in pts)+'Z'
  g['d']=d
 path.write_text(json.dumps(data,separators=(',',':')))
