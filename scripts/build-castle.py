"""Author the concept's connected castle with the approved tower's glyph kit.

Geometry is compiled into a few SVG paths offline. No runtime glyph layout.
The tower itself remains an unchanged, separate server-rendered component.
"""
from quill import *

WORDS = ['OMNIBVS MARAVDENTIBVS', 'BONVM AVDERE EST', 'PER AMBAGES AD LVCEM',
         'MEMORIA ET SCIENTIA', 'QVAERERE INVENIRE', 'MIRABILIA LATENT']

def wall(points, size=11, phrase=0, cursive=False):
    """Letters are the wall; short bent strokes only occupy its corners."""
    for i,(a,b) in enumerate(zip(points,points[1:])):
        dx,dy=b[0]-a[0],b[1]-a[1]; distance=math.hypot(dx,dy)
        if distance < size*2.3:
            line([a,b],'joins'); continue
        inset=min(4,distance*.08)
        p=(a[0]+dx/distance*inset,a[1]+dy/distance*inset)
        q=(b[0]-dx/distance*inset,b[1]-dy/distance*inset)
        text='per silentium quaerere et invenire ' if cursive else WORDS[(phrase+i)%len(WORDS)]+' '
        letters_line(p,q,size,text,cursive)
    for i in range(1,len(points)-1):
        a,b,c=points[i-1:i+2]
        u=math.hypot(b[0]-a[0],b[1]-a[1]);v=math.hypot(c[0]-b[0],c[1]-b[1])
        n=min(4,u/3,v/3)
        p=pen('joins');p.moveTo((b[0]+(a[0]-b[0])*n/u,b[1]+(a[1]-b[1])*n/u))
        p.qCurveTo(b,(b[0]+(c[0]-b[0])*n/v,b[1]+(c[1]-b[1])*n/v));p.endPath()

def curve(center,r,start,end,size,phrase,cursive=False):
    # Equal advances along the arc; each glyph stays uniformly scaled.
    kit=script if cursive else caps
    length=math.radians(end-start)*r;entries=[];used=0;i=0
    while used<length:
        ch=phrase[i%len(phrase)];g=kit.get(ch)
        width=(g.get('width',g.get('advance',50)) if g else 35)*size/100
        step=width+(.2 if cursive else .6)
        if used+step>length:break
        entries.append((ch,used+width/2));used+=step;i+=1
    for ch,pos in entries:
        angle=start+math.degrees((pos+(length-used)/2)/r)
        x,y=polar(r,angle,center);glyph(ch,x,y,size,angle+90,cursive)

def steps(a,b,depth,count):
    dx,dy=b[0]-a[0],b[1]-a[1];n=math.hypot(dx,dy)
    for i in range(count):
        t=(i+1)/(count+1);x=a[0]+dx*t;y=a[1]+dy*t
        h=depth+(i%3-1)*.7
        line([(x,y),(x-dy/n*h,y+dx/n*h)],'stairs')

def rosette(x,y,r=7):
    arc(r,0,360,'fine',(x,y))
    for a in [0,60,120]:line([polar(r,a,(x,y)),polar(r,a+180,(x,y))],'fine')

# GREAT HALL. Long, open chamber with unequal projecting bays and open doors.
wall([(520,435),(520,300),(567,300),(567,282),(592,282),(592,300),
      (754,300),(754,287),(777,287),(777,300),(865,300),(910,350),(910,435)],12)
wall([(910,482),(910,575),(888,575),(888,604),(868,625),(802,625)],12,2)
wall([(756,625),(609,625),(609,640),(585,640),(585,625),(520,625),(520,480)],12,3)
wall([(545,414),(545,335),(704,335)],7,0,True)
wall([(724,335),(851,335),(879,363),(879,413)],7,0,True)
wall([(546,504),(546,593),(697,593)],7,0,True)
wall([(725,593),(851,593),(878,567),(878,515)],7,0,True)
# Six quiet pillar glyphs, without a grid of furniture.
for x,y,ch in [(563,361,'A'),(705,355,'M'),(850,375,'R'),(563,566,'V'),(706,573,'S'),(853,550,'A')]:
    glyph(ch,x,y,11,0)
# Existing quill vestibule connects at its right shoulder to the hall.
wall([(456.64,378.91),(482,380),(520,435)],9,1)
wall([(472.05,413.75),(488,446),(520,480)],9,2)

# LIBRARY. Curved reading chamber with unequal alcoves, not another stair tower.
lc=(1160,312)
curve(lc,185,139,428,12,'MEMORIA LIBRORVM MIRABILIA LATENT ',False)
curve(lc,151,142,425,8,'legere quaerere et semper discere ',True)
curve(lc,122,153,416,7,'in marginibus nova invenimus ',True)
for angle in [163,197,248,283,329,371,405]:
    wall([polar(159,angle,lc),polar(182,angle,lc)],8,angle%6)
# Shelf bands follow only selected alcoves and keep the reading floor empty.
for a,b in [(171,191),(205,239),(292,320),(378,398)]:
    curve(lc,170,a,b,5.5,'memoria rerum ',True)
# Front shoulders descend into an irregular gallery joining the hall.
wall([polar(185,139,lc),(983,456),(954,447),(910,435)],11,4)
wall([polar(151,142,lc),(1040,460),(995,478),(910,482)],9,2)
wall([polar(185,428,lc),(1195,526),(1154,552),(1081,552)],11,3)
wall([polar(151,425,lc),(1127,472),(1096,499),(970,499)],9,1)
wall([(970,499),(948,528),(948,580)],10,5)
wall([(1081,552),(1000,552),(995,607)],10,4)
# Narrow ascent tucked into a single gallery, not repeated around the ring.
steps((1008,519),(1060,519),16,7)

# WESTERN ROOMS & PASSAGE. A small, irregular cluster beside the hall.
wall([(520,480),(474,480),(450,499),(450,563)],10,2)
wall([(450,599),(450,669),(475,692),(596,692)],10,4)
wall([(520,625),(520,651),(657,651),(657,706)],10,1)
wall([(450,499),(372,499),(344,526),(344,599),(411,599)],10,3)
wall([(411,599),(411,626),(333,626),(333,704),(360,730),(430,730),(450,704)],10,0)
wall([(358,536),(358,582),(413,582)],6,0,True)
wall([(347,641),(347,689),(368,712),(416,712)],6,0,True)
steps((429,510),(429,551),-14,7)
wall([(596,692),(596,718),(634,718)],10,3)
wall([(450,704),(474,745),(566,745)],10,5)

# LOWER PASSAGE & COMMON ROOM. Offset doors and a chamfered, generous chamber.
wall([(756,625),(756,686),(932,686),(958,649),(948,622)],10,2)
wall([(802,625),(802,655),(913,655),(931,614)],10,4)
wall([(634,718),(665,744),(665,805)],11,3)
wall([(701,744),(701,706),(887,706),(926,725),(926,812)],11,0)
wall([(926,851),(926,969),(884,1000),(688,1000),(653,973),(653,852)],12,2)
wall([(653,852),(665,842)],11,4)
wall([(684,825),(684,957),(706,977),(866,977)],7,0,True)
wall([(900,867),(900,949),(878,967)],7,0,True)
# A low hearth with a quill arch, leaving the main floor entirely open.
arc(23,190,350,'joins',(788,958));line([(765,954),(765,967),(811,967),(811,954)],'joins')
rosette(793,793,9)

# WORKSHOP. A substantial wing with two small work cells and stepped exterior.
wall([(926,725),(985,725),(985,654),(1080,654),(1080,627),(1145,627),
      (1145,654),(1254,654),(1281,682),(1281,888),(1241,922),(1172,922)],12,1)
wall([(1132,922),(1009,922),(985,897),(985,851),(926,851)],12,4)
wall([(985,811),(985,767),(926,767)],11,2)
wall([(1010,713),(1010,681),(1105,681)],7,0,True)
wall([(1239,708),(1250,722),(1250,802)],7,0,True)
wall([(1010,824),(1010,888),(1084,888)],7,0,True)
# Different sized satellite cells create an expandable workshop footprint.
wall([(1080,654),(1080,697),(1121,697)],9,4)
wall([(1155,697),(1195,697),(1195,654)],9,3)
wall([(1281,802),(1210,802),(1210,842)],9,1)
wall([(1210,876),(1210,922)],9,2)
wall([(1132,922),(1132,887),(1172,887),(1172,922)],9,0)
steps((1140,891),(1164,891),21,5)
rosette(1233,856,8)

# OWLERY. Smaller paired round chambers east of the library, as in the concept.
wall([(1154,552),(1220,552),(1259,579)],9,1)
wall([(1209,526),(1233,526),(1278,552)],9,4)
for center,r,start,end in [((1294,533),31,70,394),((1382,546),27,98,420)]:
    curve(center,r,start,end,9,'AVES EPISTVLAE ',False)
    curve(center,r-12,start+8,end-8,5,'per aera ',True)
    rosette(center[0],center[1],5)
wall([(1259,579),(1250,598),(1250,623),(1281,654),(1369,654),(1402,624),(1402,579)],10,2)
wall([(1402,579),(1385,573)],9,1)
wall([(1326,553),(1360,566)],9,4)
wall([(1281,603),(1359,603)],6,0,True)

# ENTRANCE COURT. Fully closed shoulders; two open routes into the castle.
wall([(566,745),(578,787),(597,816),(597,855)],11,4)
wall([(634,718),(631,786),(655,804),(655,816),(597,855)],10,2)
wall([(597,855),(576,884),(576,939),(548,970),(512,970)],11,1)
wall([(473,970),(429,970),(403,939),(403,855),(430,825),(542,825)],11,3)
wall([(542,825),(545,792),(474,780),(450,744)],10,5)
wall([(450,744),(450,704)],10,2)
wall([(576,909),(620,909),(653,894)],9,0)
wall([(576,939),(620,939),(653,926)],9,1)
steps((478,976),(508,976),31,6)
# A short approach, kept clear of lettering and the castle's complete edges.
line([(472,1016),(447,1047),(423,1065)],'survey')
line([(518,1016),(514,1046),(490,1078)],'survey')

styles={'capitals':{'fill':'currentColor'},'script':{'fill':'currentColor'},
        'joins':{'fill':'none','stroke':'currentColor','strokeWidth':1.5},
        'stairs':{'fill':'none','stroke':'currentColor','strokeWidth':1.05},
        'fine':{'fill':'none','stroke':'currentColor','strokeWidth':.65},
        'survey':{'fill':'none','stroke':'currentColor','strokeWidth':.55,'opacity':.4}}
data=[dict(id=k,d=v.getCommands(),**styles[k]) for k,v in layers.items()]
# A cacheable vector file keeps megabytes of paths out of React's HTML/RSC stream.
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" style="color:#493320">'
for item in data:
    attrs=' '.join(f'{"stroke-width" if k=="strokeWidth" else k}="{v}"' for k,v in item.items() if k!='id')
    svg+=f'<path {attrs} stroke-linejoin="round" stroke-linecap="round"/>'
svg+='</svg>'
(ROOT/'public/art/castle-ink.svg').write_text(svg)
print(f'Castle: {len(data)} vector layers; {sum(len(x["d"]) for x in data):,} path characters')
