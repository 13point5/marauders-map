"""Fit radial stair segments; the independent complete-kit script owns lettering.
Run after fit-reconstruction.py. Doorways below are manually drawn editable paths.
Requires OpenCV, NumPy, and SciPy; none are browser dependencies.
"""
import cv2, numpy as np, json
from scipy.signal import find_peaks
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=cv2.imread(str(root/'outputs/study/reference-ink-mask.png'),0)
full=np.zeros((1311,1090),np.uint8);full[65:65+src.shape[0],60:60+src.shape[1]]=src
angles=np.linspace(0,2*np.pi,3600,endpoint=False);r=np.arange(267,378)
strip=cv2.remap(full,(573+np.cos(angles)[None,:]*r[:,None]).astype('float32'),(558+np.sin(angles)[None,:]*r[:,None]).astype('float32'),cv2.INTER_LINEAR)
peaks,_=find_peaks((strip/255).mean(axis=0),distance=21,prominence=.075,height=.12)
stairs=[]
for peak in peaks:
 theta=angles[peak];deg=theta*180/np.pi
 if 53<deg<83 or 220<deg<249:continue
 radii=np.arange(245,413);best=None
 for tilt in np.linspace(-.0006,.0006,21):
  a=theta+tilt*(radii-320)
  x=573+radii*np.cos(a);y=558+radii*np.sin(a)
  v=cv2.remap(full,x.astype('float32')[None,:],y.astype('float32')[None,:],cv2.INTER_LINEAR)[0]/255
  score=v[(radii>=270)&(radii<=370)].mean()
  if best is None or score>best[0]:best=(score,x,y,v)
 score,x,y,v=best
 closed=cv2.morphologyEx((v>.3).astype('uint8')[None,:],cv2.MORPH_CLOSE,np.ones((1,11),np.uint8))
 n,lab,stats,_=cv2.connectedComponentsWithStats(closed)
 if n<2:continue
 index=1+np.argmax(stats[1:,4]);positions=np.where(lab[0]==index)[0]
 if len(positions)<65:continue
 a,b=positions[0],positions[-1]
 stairs.append({'a':[round(x[a],2),round(y[a],2)],'b':[round(x[b],2),round(y[b],2)],'width':round(2.8+score*1.5,2)})
path=root/'app/letter-kit/reference-layout.json';layout=json.loads(path.read_text());layout['stairs']=stairs
layout['doorways']=[
 'M608 984 Q640 952 671 933 Q693 965 717 1007 L665 1018 Q659 1008 649 1005 Q641 1004 641 1015 Q640 1028 627 1025 Q619 1024 615 1034',
 'M800 874 Q777 880 759 898 L783 964 M777 960 L850 922 Q846 940 866 947 L893 969',
 'M864 934 Q861 952 884 956 L903 986 Q883 986 864 979 Q882 1001 908 1003 L920 1040 L989 1025 Q985 1010 970 1011 L949 966 Q935 967 931 961'
]
path.write_text(json.dumps(layout,separators=(',',':')))
print(len(stairs),'radial stair segments')
