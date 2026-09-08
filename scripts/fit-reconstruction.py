"""Fit EXISTING reusable capital glyphs to measured slots in the reference.
No new glyph contours are extracted here: output consists only of glyph IDs
and affine placement parameters. The full tower trace is a comparison target.
"""
import cv2,numpy as np,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=cv2.imread(str(root/'outputs/study/reference-ink-mask.png'),0)
full=np.zeros((1311,1090),np.uint8);full[65:65+src.shape[0],60:60+src.shape[1]]=src
outer=[('E',33,85),('S',85,124),('T',130,181),('A',178,228),('V',221,279),('D',280,343),('E',346,400),('R',402,470),('E',472,525),('E',533,589),('S',589,632),('T',633,688),('O',695,750),('M',749,829),('N',833,890),('I',898,925),('B',937,989),('V',989,1041),('S',1035,1081),('I',1093,1127),('T',1136,1183),('I',1193,1229),('N',1239,1294),('E',1304,1358),('R',1359,1433),('V',1439,1492),('M',1489,1567),('A',1567,1646),('R',1651,1723),('A',1723,1779),('V',1764,1840),('D',1847,1907),('E',1910,1969),('N',1969,2024),('T',2023,2089),('I',2091,2128),('B',2128,2187),('V',2188,2252),('S',2235,2289),('A',2664,2735),('V',2715,2790),('D',2791,2857),('E',2854,2906),('R',2912,2970),('E',2970,3000)]
inner=[('A',36,90),('V',78,145),('D',147,200),('E',199,260),('R',260,316),('M',315,390),('A',390,458),('R',460,529),('A',529,592),('V',583,646),('D',646,701),('E',700,758),('R',758,833),('E',836,892),('E',923,971),('S',970,1007),('T',1007,1065),('A',1082,1139),('V',1132,1191),('D',1191,1254),('E',1260,1316),('R',1313,1383),('E',1382,1439),('E',1466,1515),('S',1515,1550),('T',1539,1600)]
kit=json.loads((root/'app/letter-kit/glyphs.json').read_text())
result={'method':'Existing vector capitals fitted to reference positions; no whole-shape tracing in reconstruction.','capitals':[]}
for name,cx,cy,r0,r1,width,slots in [('outer',563,565,411,503,3000,outer),('inner',573,558,186,269,1600,inner)]:
 angle=np.linspace(2*np.pi,0,width,endpoint=False);r=np.linspace(r0,r1,140)
 xx=cx+np.cos(angle)[None,:]*r[:,None];yy=cy+np.sin(angle)[None,:]*r[:,None]
 strip=cv2.remap(full,xx.astype('float32'),yy.astype('float32'),cv2.INTER_LINEAR)
 for letter,a,b in slots:
  crop=(strip[15:110,a:b]>127).astype('uint8')
  n,lab,stats,_=cv2.connectedComponentsWithStats(crop)
  if n<2:continue
  ix=1+np.argmax(stats[1:,4]);crop[lab!=ix]=0
  bx,by,bw,bh=stats[ix,:4]
  target=np.pad(crop,((12,12),(12,12))).astype('float32');total=target.sum()
  best=None
  for g in kit:
   if g['id'].split('.')[0]!=letter:continue
   template=cv2.imread(str(root/f"outputs/reconstruction/templates/{g['id']}.png"),0)
   for h in np.linspace(max(15,bh*.82),min(target.shape[0]-1,bh*1.16),8).astype(int):
    for w in np.linspace(max(8,bw*.82),min(target.shape[1]-1,bw*1.16),8).astype(int):
     t=(cv2.resize(template,(w,h),interpolation=cv2.INTER_AREA)>127).astype('float32')
     score=cv2.matchTemplate(target,t,cv2.TM_CCORR);_,mx,_,loc=cv2.minMaxLoc(score)
     f1=2*mx/(t.sum()+total)
     if best is None or f1>best[0]:best=(f1,g['id'],w,h,loc)
  f1,gid,w,h,(lx,ly)=best
  px=a+lx-12+w/2;py=15+ly-12+h/2
  theta=2*np.pi*(1-px/width);radius=r0+py*(r1-r0)/139
  result['capitals'].append({'glyph':gid,'band':name,'x':round(cx+radius*np.cos(theta),3),'y':round(cy+radius*np.sin(theta),3),'angle':round(theta*180/np.pi-90,3),'width':round(w*2*np.pi*radius/width,3),'height':round(h*(r1-r0)/139,3),'slotFitF1':round(f1,3)})
(root/'app/letter-kit/reference-layout.json').write_text(json.dumps(result,separators=(',',':')))
print('placed',len(result['capitals']),'reused capitals; mean slot fit',np.mean([x['slotFitF1'] for x in result['capitals']]))
