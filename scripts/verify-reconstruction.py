"""Compare raster ink at identical registration; do not score parchment background.
IoU is pixel agreement with the traced source mask, not perceptual accuracy.
"""
import cv2, numpy as np, json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
a=cv2.imread(str(root/'outputs/study/reference-ink-mask.png'),0)>127
b=cv2.imread(str(root/'outputs/reconstruction/rebuilt.png'),cv2.IMREAD_UNCHANGED)[:,:,3]>127
intersection=int((a&b).sum());union=int((a|b).sum())
metrics={'resolution':[1010,1025],'referenceInkPixels':int(a.sum()),'rebuiltInkPixels':int(b.sum()),'inkIoU':intersection/union,'precision':intersection/int(b.sum()),'recall':intersection/int(a.sum()),'note':'Same-size ink-mask agreement; includes approximate cursive and doorways. Not a perceptual or tracing quality score.'}
(root/'outputs/reconstruction/metrics.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps(metrics,indent=2))
# Beige paper, grey original-only ink, cyan rebuilt-only ink, dark shared ink.
overlay=np.full((*a.shape,3),(175,215,236),np.uint8)
overlay[a&~b]=(140,130,125);overlay[b&~a]=(155,133,0);overlay[a&b]=(31,39,54)
cv2.imwrite(str(root/'outputs/reconstruction/difference.png'),overlay)
