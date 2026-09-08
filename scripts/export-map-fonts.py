"""Export the two reusable vector kits as TrueType fonts; no source font input."""
import json
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path
root=Path(__file__).resolve().parents[1]
caps=json.loads((root/'app/letter-kit/glyphs.json').read_text())
script=json.loads((root/'app/letter-kit/cursive-glyphs.json').read_text())
for family,filename,is_script in [('Map Capitals','map-capitals.ttf',False),('Map Script','map-script.ttf',True)]:
 glyphs={};metrics={};mapping={}
 empty=TTGlyphPen(None).glyph();glyphs['.notdef']=empty;metrics['.notdef']=(500,0)
 glyphs['space']=empty;metrics['space']=(240,0);mapping[32]='space'
 chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' if is_script else 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
 for char in chars:
  g=script['glyphs'][char] if is_script else next(g for g in caps if g['id']==char)
  name='uni'+format(ord(char),'04X');pen=TTGlyphPen(None)
  transform=(10,0,0,-10,70,800 if is_script else 1000)
  parse_path(g['d'],TransformPen(pen,transform));glyphs[name]=pen.glyph()
  advance=round(g['advance']*10) if is_script else round((g['width']+18)*10)
  # Correct left bearing is recomputed from the rendered glyph bounds.
  glyphs[name].recalcBounds(glyphs);metrics[name]=(advance,glyphs[name].xMin)
  mapping[ord(char)]=name
 fb=FontBuilder(1000,isTTF=True);fb.setupGlyphOrder(list(glyphs));fb.setupCharacterMap(mapping)
 fb.setupGlyf(glyphs);fb.setupHorizontalMetrics(metrics);fb.setupHorizontalHeader(ascent=1100,descent=-500)
 fb.setupNameTable({'familyName':family,'styleName':'Regular','uniqueFontIdentifier':family+'-1.0','fullName':family+' Regular','psName':family.replace(' ','')+'-Regular','version':'Version 1.0'})
 fb.setupOS2(sTypoAscender=1100,sTypoDescender=-500,usWinAscent=1200,usWinDescent=500)
 fb.setupPost();fb.setupMaxp();fb.save(root/'public/fonts'/filename)
 print(filename,len(chars),'letters')
