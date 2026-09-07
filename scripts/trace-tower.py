"""Reproducible vector study from the user's IMG_5431 photograph.

The photograph is an input, not a site background. No synthetic borders,
text paths, circles, or font substitutions are added to the tower.
"""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageOps
import json
import argparse

ROOT = Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('photo',type=Path,help='Full-resolution IMG_5431 decoded as JPEG, retaining EXIF orientation')
source=parser.parse_args().photo
(ROOT/'outputs/study').mkdir(exist_ok=True,parents=True)
im = ImageOps.exif_transpose(Image.open(source))
s = im.width / 1650
im = im.crop(tuple(round(v*s) for v in (870,335,1290,840)))
a = np.array(im)
g = cv2.cvtColor(a, cv2.COLOR_RGB2GRAY)
mask = (g < 98).astype(np.uint8)*255
n, labels, stats, centers = cv2.connectedComponentsWithStats(mask)
for i in range(1,n):
    x,y,w,h,area = stats[i]; cx,cy = centers[i]
    # Scope to the complete stair ring, excluding the next corridor, foxing,
    # and isolated camera/paper specks. This does not slice letter contours.
    if area < 35 or cy > 1080 or cx < 80 or cy < 83 or cx > 1035 or (cx > 990 and cy < 235) or (690 < cx < 880 and cy > 975):
        mask[labels == i] = 0

contours,hierarchy = cv2.findContours(cv2.resize(mask,None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
paths=[]
for contour in contours:
    if len(contour)<3: continue
    points=cv2.approxPolyDP(contour, 1.2, True)[:,0,:].astype(float)/4 + .125
    if len(points)<3:continue
    # Rounded quadratic joins remove pixel stair-stepping while keeping the
    # source's irregular pen contours. Holes survive via even-odd fill.
    mid=(points[-1]+points[0])/2
    d=f'M{mid[0]:.2f},{mid[1]:.2f}'
    for i,p in enumerate(points):
        end=(p+points[(i+1)%len(points)])/2
        d+=f'Q{p[0]:.2f},{p[1]:.2f} {end[0]:.2f},{end[1]:.2f}'
    paths.append(d+'Z')

out=ROOT/'public/study';out.mkdir(exist_ok=True,parents=True)
# Identical coordinates on the photograph and the vector allow a true overlay.
box=(60,65,1070,1090)
w,h=box[2]-box[0],box[3]-box[1]
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 65 {w} {h}" width="{w}" height="{h}"><title>Stair tower, ink contours traced from IMG_5431</title><path fill="#36271f" fill-rule="evenodd" d="{" ".join(paths)}"/></svg>'
(out/'stair-tower.svg').write_text(svg)
im.crop(box).save(out/'tower-reference.jpg',quality=94)
cv2.imwrite(str(ROOT/'outputs/study/reference-ink-mask.png'),mask[box[1]:box[3],box[0]:box[2]])
(ROOT/'outputs/study/trace-source.json').write_text(json.dumps({'source':'IMG_5431.HEIC','crop_in_oriented_photo':[round(v*s) for v in (870,335,1290,840)],'ink_threshold':98,'contours':len(paths),'viewbox':[60,65,w,h],'method':'Independent ink contours with quadratic joins; no geometric outlines.'},indent=2))
print(f'{len(paths)} ink contours, {len(svg)} SVG bytes')
