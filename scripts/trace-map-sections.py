"""Trace authored photo regions without inventing, closing, or thinning ink.
Coordinates in sections.json use the EXIF-oriented photo at 1650px width.
"""
from pathlib import Path
import argparse,json
import cv2,numpy as np
from PIL import Image,ImageOps
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('photo');p.add_argument('--section');args=p.parse_args()
im=ImageOps.exif_transpose(Image.open(args.photo)).convert('RGB');scale=im.width/1650
configs=json.loads((root/'scripts/sections.json').read_text())
for name,c in configs.items():
 if args.section and args.section!=name:continue
 box=c['crop1650'];crop=im.crop(tuple(round(v*scale) for v in box));rgb=np.array(crop);h,w=rgb.shape[:2]
 def points(seq):return np.array([[(x-box[0])*scale,(y-box[1])*scale] for x,y in seq],np.int32)
 raw=(cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY)<98).astype(np.uint8)*255
 roi=np.zeros((h,w),np.uint8)
 for poly in c['outlines']:cv2.fillPoly(roi,[points(poly)],255)
 # Select whole photographed ink components instead of clipping them at an
 # approximate region boundary: a scope polygon must never sever a quill stroke.
 count,raw_labels,raw_stats,_=cv2.connectedComponentsWithStats(raw)
 selected=np.bincount(raw_labels[roi>0],minlength=count)
 include=(selected/np.maximum(raw_stats[:,4],1)>.35);include[0]=False
 mask=include[raw_labels].astype(np.uint8)*255
 for poly in c['voids']:cv2.fillPoly(mask,[points(poly)],0)
 for poly in c['keep']:
  keep=np.zeros_like(mask);cv2.fillPoly(keep,[points(poly)],255);mask|=raw&keep&roi
 for poly in c.get('erase',[]):cv2.fillPoly(mask,[points(poly)],0)
 n,labels,stats,centers=cv2.connectedComponentsWithStats(mask)
 for i in range(1,n):
  cx,cy=centers[i];px=box[0]+cx/scale;py=box[1]+cy/scale
  detached_ok=not c.get('keepDetachedIn') or stats[i,4]>15000 or any(cv2.pointPolygonTest(np.array(poly,np.float32),(float(px),float(py)),False)>=0 for poly in c['keepDetachedIn'])
  if not detached_ok or stats[i,4]<c['minArea'] or any((px-x)**2+(py-y)**2<r*r for x,y,r in c['spots']):mask[labels==i]=0
 n,labels,stats,centers=cv2.connectedComponentsWithStats(mask);parts=[]
 for i in range(1,n):
  x,y,bw,bh,area=stats[i];component=(labels[y:y+bh,x:x+bw]==i).astype(np.uint8)*255
  contours,_=cv2.findContours(cv2.resize(component,None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE);paths=[]
  for contour in contours:
   a=cv2.approxPolyDP(contour,.9,True)[:,0,:].astype(float)/4+.125+[x,y]
   if len(a)<3:continue
   mid=(a[-1]+a[0])/2;d=f'M{mid[0]:.3f},{mid[1]:.3f}'
   for j,v in enumerate(a):
    e=(v+a[(j+1)%len(a)])/2;d+=f'Q{v[0]:.3f},{v[1]:.3f} {e[0]:.3f},{e[1]:.3f}'
   paths.append(d+'Z')
  if paths:parts.append({'id':f'ink-{i:03d}','d':' '.join(paths),'bounds':[int(x),int(y),int(bw),int(bh)]})
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><title>{c["title"].replace("&","&amp;")}, traced from IMG_5431</title><g fill="#36271f" fill-rule="evenodd">'+''.join(f'<path id="{a["id"]}" d="{a["d"]}"/>' for a in parts)+'</g></svg>'
 (root/f'public/study/{name}.svg').write_text(svg);crop.save(root/f'public/study/{name}-photo.jpg',quality=95)
 work=root/f'outputs/{name}';work.mkdir(exist_ok=True,parents=True);cv2.imwrite(str(work/'source-ink-mask.png'),mask)
 proof=np.full_like(rgb,[232,223,201]);proof[mask>0]=[54,39,31];Image.fromarray(proof).resize((round(w/scale*1.5),round(h/scale*1.5))).save(work/'proof.png')
 meta={'source':'IMG_5431.HEIC','title':c['title'],'method':'Photo-derived vector contours with authored boundaries and paper exclusions','sourceOrientedSize':list(im.size),'crop1650':box,'width':w,'height':h,'componentCount':len(parts),'parts':[{'id':a['id'],'bounds':a['bounds']} for a in parts]}
 (root/f'app/map-sections/{name}.json').write_text(json.dumps(meta,indent=2)+'\n');print(name,len(parts),len(svg))
