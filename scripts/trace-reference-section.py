"""Source-faithful tower and turning passage from IMG_5431.
This is a photograph-derived vector facsimile, not a generated font layout.
Scope and stain exclusions are authored in the oriented 1650px photo space.
No automatic gap-closing, thinning, or invented architectural lines are used.
"""
from pathlib import Path
import argparse,json
import cv2,numpy as np
from PIL import Image,ImageOps
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('photo');args=parser.parse_args()
im=ImageOps.exif_transpose(Image.open(args.photo)).convert('RGB');scale=im.width/1650
box=(885,350,1320,1230);crop=im.crop(tuple(round(v*scale) for v in box));rgb=np.array(crop);h,w=rgb.shape[:2]
def points(seq):return np.array([[(x-box[0])*scale,(y-box[1])*scale] for x,y in seq],np.int32)
# Follow the section's exterior, ending at the two original lower returns.
outline=[(900,355),(1275,355),(1283,640),(1274,706),(1306,801),(1305,866),(1295,907),(1306,970),(1294,1008),(1249,1046),(1259,1062),(1265,1116),(1204,1120),(1181,1082),(1188,1041),(1212,1020),(1191,1018),(1138,1042),(1101,1064),(1040,1106),(1053,1142),(1020,1172),(1009,1200),(975,1228),(889,1170),(915,1132),(933,1101),(978,1088),(943,1065),(986,1029),(1005,1048),(1024,1075),(1060,1043),(1100,997),(1134,976),(1146,955),(1188,968),(1210,985),(1214,970),(1190,911),(1162,902),(1113,882),(1080,833),(1084,797),(1070,756),(1027,746),(967,720),(914,675),(888,605),(887,500)]
roi=np.zeros((h,w),np.uint8);cv2.fillPoly(roi,[points(outline)],255)
gray=cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY)
mask=((gray<98)&(roi>0)).astype(np.uint8)*255
# Empty interiors in the artwork remain empty; photographed paper spots do not
# become drawing marks. Other exclusions below are inspected paper stains.
exclusions=[[(1020,495),(1116,478),(1165,522),(1154,596),(1098,611),(1040,594),(1020,543)]]
for polygon in exclusions:cv2.fillPoly(mask,[points(polygon)],0)
# This photographed foxing spot touches the A's antialiased edge. Its exact
# ellipse is excluded after close inspection; the neighbouring A/D stay intact.
spot=points([(1234.5,911.5)])[0]
cv2.ellipse(mask,tuple(spot),(round(5.8*scale),round(5.3*scale)),0,0,360,0,-1)
n,labels,stats,centers=cv2.connectedComponentsWithStats(mask)
removed=[]
paper_spots=[(998,366),(1265,412),(1199,715),(1183,724),(1155,732),(1208,742),(1088,812),(1161,816),(1229,825),(1087,832),(1103,864),(1279,864),(1274,865),(1243,910),(1269,1022),(1253,1042),(1196,1071),(1252,1085),(1218,1086)]
for i in range(1,n):
 x,y,bw,bh,area=stats[i];cx,cy=centers[i];px=box[0]+cx/scale;py=box[1]+cy/scale
 if area<28 or (area<1000 and any((px-a)**2+(py-b)**2<6**2 for a,b in paper_spots)):
  mask[labels==i]=0;removed.append(i)
# Keep independent ink components as independently editable paths; contour
# holes are retained inside each component using the even-odd fill rule.
n,labels,stats,centers=cv2.connectedComponentsWithStats(mask)
parts=[]
for i in range(1,n):
 x,y,bw,bh,area=stats[i];component=(labels[y:y+bh,x:x+bw]==i).astype(np.uint8)*255
 contours,_=cv2.findContours(cv2.resize(component,None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
 paths=[]
 for contour in contours:
  p=cv2.approxPolyDP(contour,.9,True)[:,0,:].astype(float)/4+.125+[x,y]
  if len(p)<3:continue
  mid=(p[-1]+p[0])/2;d=f'M{mid[0]:.3f},{mid[1]:.3f}'
  for j,v in enumerate(p):
   e=(v+p[(j+1)%len(p)])/2;d+=f'Q{v[0]:.3f},{v[1]:.3f} {e[0]:.3f},{e[1]:.3f}'
  paths.append(d+'Z')
 if paths:parts.append({'id':f'ink-{i:03d}','d':' '.join(paths),'bounds':[int(x),int(y),int(bw),int(bh)]})
out=root/'public/study';out.mkdir(exist_ok=True)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><title>Tower and turning passage, traced from IMG_5431</title><g fill="#36271f" fill-rule="evenodd">'+''.join(f'<path id="{p["id"]}" d="{p["d"]}"/>' for p in parts)+'</g></svg>'
(out/'reference-section.svg').write_text(svg);crop.save(out/'reference-section-photo.jpg',quality=95)
work=root/'outputs/reference-section';work.mkdir(exist_ok=True,parents=True);cv2.imwrite(str(work/'source-ink-mask.png'),mask)
metadata={'source':'IMG_5431.HEIC','method':'Source-traced vector contours; authored section boundary and paper-stain exclusions','sourceOrientedSize':list(im.size),'crop1650':box,'width':w,'height':h,'threshold':98,'outline1650':outline,'emptyInterior1650':exclusions,'touchingPaperSpot1650':[1234.5,911.5,5.8,5.3],'removedPaperSpots1650':paper_spots,'componentCount':len(parts),'parts':[{'id':p['id'],'bounds':p['bounds']} for p in parts]}
(root/'app/letter-kit/reference-section.json').write_text(json.dumps(metadata,indent=2)+'\n')
print(json.dumps({'width':w,'height':h,'components':len(parts),'svgBytes':len(svg)}))
