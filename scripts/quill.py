"""Shared offline geometry from the approved quill-letter tower."""
import json, math
from pathlib import Path
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path

ROOT = Path(__file__).resolve().parents[1]
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

