"""Compose an original tower from the approved quill kit, ahead of time.

No raster tracing or runtime type-on-path layout. Layout follows the research
tower in references/proposals/wide-estate-concept.png. Glyphs are the approved
photo-informed kit recovered from f9c25fd, rounded to 0.01 kit units.
"""
import json, math
from pathlib import Path
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path

ROOT = Path(__file__).resolve().parents[1]
(ROOT/'outputs/research-tower').mkdir(parents=True,exist_ok=True)
caps = {g['id']: g for g in json.loads((ROOT/'app/research/glyphs.json').read_text())}
script = json.loads((ROOT/'app/research/cursive-glyphs.json').read_text())['glyphs']
layers = {}
ntos = lambda n: str(round(n, 2)).removesuffix('.0')
def pen(layer):
    if layer not in layers: layers[layer] = SVGPathPen(None, ntos=ntos)
    return layers[layer]
def polar(r, angle, center=(333, 309)):
    a = math.radians(angle)
    return (center[0]+r*math.cos(a), center[1]+r*math.sin(a))
def glyph(char, x, y, height, angle, cursive=False):
    kit = script if cursive else caps
    g = kit.get(char)
    if not g: return
    size = height/100
    width = g.get('width',g.get('advance',50))
    a=math.radians(angle); c=math.cos(a)*size; s=math.sin(a)*size
    # Anchor at the ink's baseline. Uniform scaling preserves stroke weight.
    baseline=80 if cursive else 100
    transform=(c,s,-s,c,x-width/2*c+baseline*s,y-width/2*s-baseline*c)
    parse_path(g['d'], TransformPen(pen('script' if cursive else 'capitals'),transform))
def ring(r, start, end, height, phrase, cursive=False):
    length=math.radians(end-start)*r; kit=script if cursive else caps
    entries=[]; cursor=0; index=0
    while True:
        ch=phrase[index%len(phrase)]; g=kit.get(ch)
        width=(g.get('width',g.get('advance',50)) if g else 35)*height/100
        advance=width+(0.2 if cursive else .6)
        if cursor+advance>length:break
        entries.append((ch,cursor+width/2));cursor+=advance;index+=1
    offset=(length-cursor)/2
    for ch, distance in entries:
        angle=start+math.degrees((distance+offset)/r)
        x,y=polar(r,angle)
        glyph(ch,x,y,height,angle+90,cursive)
def line(points, layer='rules'):
    p=pen(layer);p.moveTo(points[0])
    for pt in points[1:]:p.lineTo(pt)
    p.endPath()
def arc(r,a,b,layer='rules',center=(333,309)):
    line([polar(r,a+(b-a)*i/90,center) for i in range(91)],layer)
def letters_line(a,b,height,phrase,cursive=False):
    dx=b[0]-a[0];dy=b[1]-a[1];length=math.hypot(dx,dy);angle=math.degrees(math.atan2(dy,dx))
    kit=script if cursive else caps;used=0;entries=[]
    for ch in (phrase*10):
        g=kit.get(ch);w=(g.get('width',g.get('advance',50)) if g else 35)*height/100
        if used+w>length:break
        entries.append((ch,used+w/2));used+=w+.45
    for ch,pos in entries:
        t=(pos+(length-used)/2)/length
        glyph(ch,a[0]+dx*t,a[1]+dy*t,height,angle,cursive)

# The doorway is a real opening in both ink rims. Capitals form the outer wall;
# cursive forms the inner edge. Neither is crossed by a continuous circle.
# IMG_5431's circular rim is uninterrupted lettering. Architectural returns
# occur at the entrance, not as repeated U-shaped decorations around the arc.
ring(207,67,402,12,'OMNIBVS MARAVDENTIBVS BONVM AVDERE EST ',False)
ring(187,68,398,10,'per silentium quaerere et invenire ',True)
ring(118,70,398,17,'ambulantibus mirabilia latent ',True)

# Unequal stair flights and broad landings, with a protected band at each rim.
# Individual quill strokes have free ends, as in the photographed tower.
# No enclosing rails, doubled rungs, or end posts turn the flights into fences.
flights=[(-171,-143,12),(-121,-78,18),(-57,-29,12),(-10,30,17),(83,120,16),(137,160,10)]
for start,end,count in flights:
    for i in range(count+1):
        a=start+(end-start)*i/count
        # Small, deterministic changes in stroke length follow the hand-drawn
        # reference without disturbing either protected band of lettering.
        inner=133+(i%3)*.55
        outer=177-(i%4)*.65
        line([polar(inner,a),polar(outer,a+.12*math.sin(i))],'stairs')

# A quiet landing at the top, punctuated by a quill compass rosette.
cx,cy=polar(153,-133)
for angle in range(0,360,45):
    line([polar(3,angle,(cx,cy)),polar(7,angle,(cx,cy))],'fine')

# Angled entrance, then a complete small octagonal vestibule. Its shoulders
# share exact coordinates with the ring mouth and the chamber's open top edge.
left=polar(207,67);right=polar(207,42)
left_inner=polar(126,67);right_inner=polar(126,42)
left_elbow=(460,559);right_elbow=(526,515)
letters_line(left_inner,left,14,'INVENIRE')
letters_line(right,right_inner,14,'AD LVCEM')
letters_line(left,left_elbow,14,'PER AMBAGES')
letters_line(right,right_elbow,14,'SCIENTIA')
# The capitals themselves form these walls. A continuous baseline here reads
# as an underline, so only the short corner returns below receive pen strokes.
letters_line((460,562),(482,591),10,'ARS')
letters_line((550,545),(526,512),10,'MENS')
chamber=[(482,591),(461,624),(482,681),(540,700),(594,680),(615,625),(592,573),(548,547)]
for i in range(len(chamber)-1):
    a,b=chamber[i],chamber[i+1]
    letters_line(a,b,13,['MEMORIA','AVDERE','MIRABILIA','QVAERERE','LVCEM','INVENIRE','MENTIS'][i])
    # Short rounded quill corner returns are authored separately from the glyphs.
    if i<len(chamber)-2:
        nxt=chamber[i+2];v=(b[0]-a[0],b[1]-a[1]);w=(nxt[0]-b[0],nxt[1]-b[1])
        lv=math.hypot(*v);lw=math.hypot(*w)
        p=pen('joins');p.moveTo((b[0]-v[0]/lv*4,b[1]-v[1]/lv*4))
        p.qCurveTo(b,(b[0]+w[0]/lw*4,b[1]+w[1]/lw*4));p.endPath()

# Sparse survey marks beyond the walls leave the floor and paper breathing room.
line([(88,478),(226,408)],'survey')
line([(436,100),(585,23)],'survey')
line([(567,350),(673,294)],'survey')
for x,y in [(105,466),(577,30),(661,300)]:
    line([(x-4,y),(x+4,y)],'fine');line([(x,y-4),(x,y+4)],'fine')

styles={
 'capitals':{'fill':'currentColor'}, 'script':{'fill':'currentColor'},
 'rules':{'fill':'none','stroke':'currentColor','strokeWidth':.85},
 'stairs':{'fill':'none','stroke':'currentColor','strokeWidth':1.25},
 'joins':{'fill':'none','stroke':'currentColor','strokeWidth':1.8},
 'fine':{'fill':'none','stroke':'currentColor','strokeWidth':.6},
 'survey':{'fill':'none','stroke':'currentColor','strokeWidth':.55,'opacity':.3},
}
data=[dict(id=k,d=v.getCommands(),**styles[k]) for k,v in layers.items()]
(ROOT/'app/research/ink.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 730 780" style="color:#392719"><rect width="730" height="780" fill="#e7d7b2"/>'
for item in data:
    attrs=' '.join(f'{"stroke-width" if k=="strokeWidth" else k}="{v}"' for k,v in item.items() if k!='id')
    svg+=f'<path {attrs} stroke-linejoin="round" stroke-linecap="round"/>'
svg+='</svg>'
(ROOT/'outputs/research-tower/drawing.svg').write_text(svg)
print(f'{len(data)} merged vector layers, {sum(len(x["d"]) for x in data):,} path characters')
