"""Make a small reusable vector alphabet from the accepted tower's capitals.
This is a shape kit, not a full text font. The original tower stays unchanged.
"""
import cv2,numpy as np,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=cv2.imread(str(root/'outputs/study/reference-ink-mask.png'),0)
full=np.zeros((1311,1090),np.uint8);full[65:65+src.shape[0],60:60+src.shape[1]]=src
angle=np.linspace(0,2*np.pi,3000,endpoint=False);r=np.linspace(411,503,140)
x=563+np.cos(angle)[None,:]*r[:,None];y=565+np.sin(angle)[None,:]*r[:,None]
strip=cv2.flip(cv2.remap(full,x.astype('float32'),y.astype('float32'),cv2.INTER_LINEAR),1)
# Individually selected glyph intervals, including alternate hand-drawn forms.
letters=[('A',178,232,20,94),('V',230,279,18,90),('D',279,345,18,93),('E',345,401,18,92),('R',401,470,18,93),('E.alt',472,524,18,93),('S',590,635,18,95),('T',636,690,18,96),('O',694,751,18,101),('M',748,829,17,99),('N',832,892,18,101),('I',895,932,18,101),('B',936,984,18,100),('V.alt',1756,1840,12,99)]
kit=[];tiles=[]
for label,a,b,c,d in letters:
 crop=(strip[c:d,a:b]>127).astype('uint8')*255
 n,lab,stats,_=cv2.connectedComponentsWithStats(crop)
 if n<2:continue
 idx=1+np.argmax(stats[1:,4]);crop[lab!=idx]=0
 bx,by,bw,bh=stats[idx,:4];crop=crop[by:by+bh,bx:bx+bw]
 contours,_=cv2.findContours(cv2.resize(crop,None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
 paths=[];scale=100/bh
 for contour in contours:
  p=cv2.approxPolyDP(contour,.8,True)[:,0,:].astype(float)/4+.125
  if len(p)<3:continue
  p*=scale;mid=(p[-1]+p[0])/2;cmd=f'M{mid[0]:.2f},{mid[1]:.2f}'
  for j,v in enumerate(p):
   e=(v+p[(j+1)%len(p)])/2;cmd+=f'Q{v[0]:.2f},{v[1]:.2f} {e[0]:.2f},{e[1]:.2f}'
  paths.append(cmd+'Z')
 kit.append({'id':label,'width':round(bw*scale,2),'height':100,'d':' '.join(paths)})
 tile=np.full((155,155,3),237,np.uint8);small=cv2.resize(crop,(round(bw*100/bh),100),interpolation=cv2.INTER_AREA)
 tw=min(145,small.shape[1]);small=cv2.resize(small,(tw,100));tile[10:110,5:5+tw][small>127]=[31,39,54]
 cv2.putText(tile,label,(10,142),cv2.FONT_HERSHEY_SIMPLEX,.55,(50,50,50),1);tiles.append(tile)
(root/'app/letter-kit/glyphs.json').write_text(json.dumps(kit,separators=(',',':')))
while len(tiles)%5:tiles.append(np.full((155,155,3),237,np.uint8))
cv2.imwrite(str(root/'outputs/study/letter-kit.png'),np.vstack([np.hstack(tiles[i:i+5]) for i in range(0,len(tiles),5)]))
print(len(kit),'reusable glyphs')
