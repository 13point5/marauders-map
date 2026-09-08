"""Complete the sampled capitals and draw a companion map-script alphabet.
The new contours are authored pen paths, informed by IMG_5430–5433. They are
not extracted from a stock font and are not claimed as exact source facsimiles.
Twelve sampled forms are retained; A and O are redrawn to repair clipped ink.
"""
import json, math
from pathlib import Path
import cv2, numpy as np
from fontTools.pens.basePen import BasePen
from fontTools.svgLib.path import parse_path
root=Path(__file__).resolve().parents[1]
# Coordinates: a loose slant, baseline 80, x-height 45, ascenders 10.
# Each entry is (advance, independently authored pen path).
lower={
'a':(44,'M1 74 Q13 61 24 48 C41 35 43 51 32 68 C21 87 9 78 16 61 Q24 44 37 48 M38 47 Q28 70 31 77 Q35 83 47 69'),
'b':(43,'M1 75 Q22 53 34 21 C42 -3 26 4 19 31 Q10 62 14 77 C28 48 46 42 39 63 Q30 88 15 77 Q29 81 46 68'),
'c':(39,'M1 75 Q15 62 25 49 C39 38 41 52 33 52 C18 42 6 78 24 79 Q32 80 42 68'),
'd':(46,'M1 74 Q16 58 25 49 C40 37 40 54 30 68 C17 86 9 76 17 60 Q27 43 38 48 M32 74 Q42 41 52 13 Q45 7 39 23 Q28 54 33 76 Q36 83 49 68'),
'e':(37,'M1 75 Q16 66 27 57 C44 39 24 40 17 54 C3 81 22 87 40 68'),
'f':(37,'M0 77 Q24 49 35 20 C42 -2 25 5 22 21 Q15 53 11 99 C9 123 28 115 23 97 Q18 82 7 80 M3 52 Q25 49 41 44'),
'g':(45,'M0 75 Q17 57 26 49 C42 36 39 57 30 69 C18 84 8 76 18 60 Q27 45 38 48 M38 48 Q26 90 20 108 C10 135 -10 112 5 104 Q28 90 48 69'),
'h':(49,'M1 75 Q25 48 36 18 C43 -2 29 3 22 23 Q14 49 9 79 C21 57 37 40 39 51 Q39 57 31 74 Q28 87 52 69'),
'i':(28,'M1 75 Q12 63 20 49 Q13 66 13 75 Q13 85 31 68 M23 31 L24 28'),
'j':(28,'M0 75 Q12 61 22 49 Q14 78 6 106 C-1 126 -19 114 -10 105 Q3 94 31 69 M26 31 L27 27'),
'k':(46,'M1 75 Q23 51 35 20 C42 0 29 4 22 24 Q13 49 9 79 M13 66 Q34 37 43 48 C49 58 31 66 21 64 Q29 88 49 69'),
'l':(30,'M0 75 Q24 47 32 21 C39 0 24 3 18 25 Q6 58 12 75 Q17 85 34 68'),
'm':(72,'M0 75 Q12 64 20 48 L11 78 C24 54 39 39 36 54 L27 78 C43 51 57 41 57 52 L49 74 Q48 84 75 68'),
'n':(48,'M0 75 Q13 62 20 48 L11 78 C25 54 42 39 39 54 L31 74 Q29 85 51 69'),
'o':(42,'M0 75 Q11 64 21 51 C41 33 45 57 31 73 C12 94 5 73 17 56 Q31 38 37 48 Q30 65 46 66'),
'p':(47,'M0 75 Q13 62 22 48 L4 111 M17 65 C39 35 51 48 37 68 Q24 85 15 75 Q34 82 50 67'),
'q':(44,'M0 75 Q15 58 24 49 C41 36 40 56 30 69 C15 89 8 75 18 59 Q27 44 38 48 M37 48 Q28 78 23 106 Q22 116 30 104 L37 94 M27 82 Q38 77 48 68'),
'r':(39,'M0 75 Q14 61 20 48 Q20 62 33 47 Q43 45 34 55 M22 58 Q17 70 17 77 Q25 82 43 68'),
's':(37,'M0 75 Q18 57 27 44 Q20 57 28 65 C38 81 8 85 12 74 Q17 83 41 68'),
't':(32,'M0 75 Q19 49 27 24 M22 34 Q8 70 14 77 Q18 85 36 68 M4 50 Q19 48 35 45'),
'u':(48,'M0 75 Q13 60 20 48 C7 78 13 87 29 69 L39 48 Q27 70 33 77 Q37 83 52 69'),
'v':(43,'M0 75 Q14 61 20 48 C6 84 25 88 37 59 Q44 41 37 45 Q29 55 46 63'),
'w':(65,'M0 75 Q12 60 20 48 C5 82 22 88 35 53 C21 87 43 87 57 59 Q63 43 57 45 Q50 55 69 64'),
'x':(43,'M0 75 Q13 57 19 50 Q23 45 26 57 L31 76 Q35 80 47 69 M40 46 Q27 69 11 82'),
'y':(48,'M0 75 Q13 60 20 48 C6 81 16 87 32 66 L41 48 Q26 91 18 110 C7 130 -8 112 5 102 Q28 88 52 68'),
'z':(43,'M0 75 Q14 59 21 49 Q30 54 37 49 L17 76 Q30 67 34 77 C44 94 17 120 7 111 Q-1 104 17 99 Q34 87 47 68')}
upper={
'A':(66,'M0 82 Q23 66 48 10 Q56 5 49 24 L33 77 Q36 85 68 68 M18 57 Q39 49 61 50'),
'B':(64,'M6 78 Q27 37 34 12 M3 28 C39 -6 81 9 53 36 Q40 48 23 48 C73 26 76 62 41 78 Q21 88 10 77'),
'C':(62,'M60 26 C72 0 41 2 25 18 C-7 48 0 94 34 77 Q53 68 65 54'),
'D':(67,'M5 78 Q24 44 32 15 M4 25 C39 -4 82 10 64 47 C53 74 26 89 10 74'),
'E':(57,'M57 23 C70 3 33 2 23 24 Q13 42 36 42 C5 40 -3 67 14 78 Q32 92 60 60'),
'F':(62,'M3 27 Q19 3 45 13 Q59 20 67 10 M39 14 Q23 43 16 82 M12 47 Q36 39 56 41'),
'G':(66,'M59 24 C75 -2 35 3 18 25 C-9 61 7 92 34 74 Q49 63 53 48 L37 94 Q30 112 14 101 M33 49 L66 44'),
'H':(73,'M4 25 Q22 3 32 14 Q25 39 10 80 M63 10 Q49 41 43 76 Q46 85 75 67 M19 50 Q43 37 66 41'),
'I':(38,'M7 23 Q29 6 44 10 M32 13 Q22 42 10 75 M0 79 Q21 69 39 75'),
'J':(48,'M10 24 Q31 6 53 12 M43 13 Q31 59 19 87 C3 120 -24 87 -4 73'),
'K':(69,'M5 25 Q24 2 34 12 L12 80 M66 13 Q50 33 27 48 Q46 41 48 61 Q49 82 73 67'),
'L':(60,'M7 64 Q36 38 40 15 C44 -1 21 5 20 30 Q15 67 6 82 Q34 67 47 78 Q56 84 65 70'),
'M':(86,'M0 79 Q23 52 39 11 L26 74 Q52 41 64 12 L54 75 Q57 85 88 66'),
'N':(75,'M0 80 Q21 46 32 13 Q34 42 42 78 Q52 38 66 14 Q72 6 78 14'),
'O':(68,'M51 15 C21 -3 -8 55 9 76 C30 99 75 51 63 20 Q55 6 45 12'),
'P':(62,'M6 81 Q27 42 35 12 M4 28 C46 -9 79 14 54 39 Q39 52 24 43'),
'Q':(70,'M53 14 C22 -2 -7 58 11 77 C34 99 78 48 64 21 Q56 8 47 12 M25 67 Q46 57 51 81 Q54 95 75 78'),
'R':(67,'M6 81 Q27 41 35 12 M4 27 C46 -8 80 14 54 39 Q40 52 24 44 Q45 40 45 62 Q46 88 71 67'),
'S':(58,'M58 25 C76 4 39 -3 26 17 C8 43 63 38 45 66 C22 95 -4 76 6 62'),
'T':(64,'M0 28 Q18 1 46 13 Q60 21 71 10 M44 16 Q26 55 18 82'),
'U':(73,'M4 24 Q24 1 34 13 C4 62 4 100 42 65 L63 13 Q41 65 49 77 Q55 83 77 65'),
'V':(65,'M2 26 Q23 3 34 13 C9 62 18 95 44 58 Q70 19 61 12'),
'W':(94,'M1 25 Q21 3 33 12 C9 66 15 96 48 43 L56 15 C33 78 44 97 72 56 Q93 21 87 12'),
'X':(68,'M5 25 Q24 1 30 18 L43 73 Q49 85 72 65 M65 12 Q37 47 8 83'),
'Y':(70,'M4 24 Q23 4 31 13 C11 53 25 69 49 39 L64 13 Q44 57 33 89 C21 117 -6 98 5 85'),
'Z':(65,'M5 28 Q19 5 34 14 Q52 25 66 10 Q43 43 11 78 Q34 65 48 79 Q59 89 71 71')}
# Missing architectural capitals: serif strokes echoing the sampled rim.
cap={
'A':(83,'M8 96 L39 6 L72 96 M20 65 L59 65 M0 96 L24 96 M57 96 L82 95'),
'O':(79,'M43 6 C-1 0 0 93 40 97 C86 104 88 9 43 6'),
'C':(73,'M64 19 C46 -3 12 6 11 47 C8 92 46 109 67 81 M64 7 L65 27'),
'F':(66,'M17 5 L16 96 M15 6 Q40 8 60 5 L62 21 M17 48 L48 47 M48 37 L48 59 M5 96 L31 97'),
'G':(79,'M67 20 C48 -4 11 5 10 49 C9 89 45 110 68 83 L68 58 M51 57 L78 58 M67 8 L68 29'),
'H':(78,'M16 6 L15 96 M62 6 L61 95 M15 48 L61 49 M3 6 L29 5 M50 6 L74 5 M3 96 L28 95 M49 96 L74 97'),
'J':(53,'M39 7 L38 74 C37 104 6 99 7 81 M25 6 L52 5'),
'K':(76,'M16 5 L16 96 M63 7 L18 53 M35 38 L66 94 M3 6 L29 5 M3 96 L29 96 M51 7 L75 5 M53 95 L78 97'),
'L':(65,'M17 6 L16 95 Q37 94 59 97 L62 80 M4 6 L30 5'),
'P':(70,'M17 6 L16 96 M17 7 C77 -5 77 57 18 49 M4 96 L30 97'),
'Q':(79,'M43 6 C-1 0 0 93 40 97 C86 104 88 9 43 6 M40 76 Q49 73 59 94 Q67 109 80 104'),
'U':(77,'M16 7 L15 69 C12 103 62 107 62 71 L63 7 M4 6 L29 5 M52 6 L76 7'),
'W':(108,'M10 7 L30 95 L52 31 L74 97 L97 6 M48 7 L73 96 M0 6 L24 6 M37 6 L62 5 M87 6 L108 5'),
'X':(77,'M13 7 L64 95 M64 6 L12 96 M2 6 L27 5 M53 6 L76 5 M1 96 L26 96 M53 96 L78 97'),
'Y':(77,'M10 6 L39 51 L38 96 M67 6 L39 51 M0 6 L24 6 M54 6 L78 5 M25 96 L52 97'),
'Z':(73,'M10 22 L11 7 L64 6 L10 96 L65 95 L66 78')}
class SamplePen(BasePen):
 def __init__(self):super().__init__(None);self.strokes=[];self.current=[]
 def _moveTo(self,p):
  if self.current:self.strokes.append(self.current)
  self.current=[p]
 def _lineTo(self,p):
  a=np.array(self.current[-1]);b=np.array(p);n=max(2,int(np.linalg.norm(b-a)*3));self.current.extend([tuple(a+(b-a)*t) for t in np.linspace(0,1,n)[1:]])
 def _curveToOne(self,b,c,d):
  a=np.array(self.current[-1]);b,c,d=map(np.array,(b,c,d));n=max(10,int((np.linalg.norm(b-a)+np.linalg.norm(c-b)+np.linalg.norm(d-c))*3))
  self.current.extend([tuple((1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d) for t in np.linspace(0,1,n)[1:]])
 def _qCurveToOne(self,b,c):
  a=np.array(self.current[-1]);b,c=map(np.array,(b,c));self._curveToOne(a+(b-a)*2/3,c+(b-c)*2/3,c)
 def _closePath(self):self._lineTo(self.current[0]);self._endPath()
 def _endPath(self):
  if self.current:self.strokes.append(self.current);self.current=[]
def outline(path,architectural=False):
 pen=SamplePen();parse_path(path,pen);pen._endPath();scale=4;offset=40;mask=np.zeros((760,840),np.uint8)
 for stroke in pen.strokes:
  for i,(x,y) in enumerate(stroke):
   # Broad pen nib with modest deterministic variation, not raster distress.
   pulse=1+.07*math.sin(i*.09)+.035*math.cos(i*.23)
   axes=(int((8.2 if architectural else 3.6)*scale*pulse),int((2.2 if architectural else 1.05)*scale*pulse))
   cv2.ellipse(mask,(round((x+offset)*scale),round((y+offset)*scale)),axes,-32,0,360,255,-1)
 contours,_=cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE);paths=[];pts=[]
 for contour in contours:
  if cv2.contourArea(contour)<2:continue
  p=cv2.approxPolyDP(contour,.7,True)[:,0,:].astype(float)/scale-offset;pts.extend(p.tolist());mid=(p[-1]+p[0])/2;d=f'M{mid[0]:.2f} {mid[1]:.2f}'
  for j,v in enumerate(p):
   e=(v+p[(j+1)%len(p)])/2;d+=f'Q{v[0]:.2f} {v[1]:.2f} {e[0]:.2f} {e[1]:.2f}'
  paths.append(d+'Z')
 pts=np.array(pts);bounds=[float(pts[:,0].min()),float(pts[:,1].min()),float(pts[:,0].max()),float(pts[:,1].max())]
 return ' '.join(paths),bounds
kit=json.loads((root/'app/letter-kit/glyphs.json').read_text());kit=[g for g in kit if g['id'] not in cap]
for char,(advance,path) in cap.items():
 d,b=outline(path,True)
 # Normalize to existing kit coordinates while retaining broad-pen detail.
 sx=100/(b[3]-b[1]);pen=SamplePen()
 # Transform the generated path with fontTools, preserving quadratic contours.
 from fontTools.pens.svgPathPen import SVGPathPen
 from fontTools.pens.transformPen import TransformPen
 out=SVGPathPen(None);parse_path(d,TransformPen(out,(sx,0,0,sx,-b[0]*sx,-b[1]*sx)))
 kit.append({'id':char,'width':round((b[2]-b[0])*sx,2),'height':100,'d':out.getCommands(),'origin':'drawn companion capital; photo-informed'})
kit.sort(key=lambda g:g['id']);(root/'app/letter-kit/glyphs.json').write_text(json.dumps(kit,separators=(',',':')))
script={}
for char,(advance,path) in {**lower,**upper}.items():
 d,b=outline(path)
 script[char]={'d':d,'advance':advance,'bounds':b,'origin':'authored pen path informed by IMG_5430–5433'}
script[' ']={'d':'','advance':24,'bounds':[0,0,0,0],'origin':'spacing'}
(root/'app/letter-kit/cursive-glyphs.json').write_text(json.dumps({'unitsPerEm':100,'baseline':80,'coordinateSystem':'y-down','glyphs':script},separators=(',',':')))
(root/'outputs/alphabet/pen-recipes.json').write_text(json.dumps({'lower':lower,'upper':upper,'capital':cap}))
print(len(kit),'capital forms;',len(script)-1,'custom cursive letters')
