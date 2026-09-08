# Sriraam’s map lettering study

The homepage presents a reconstructed stair tower, two independently designed buildings, the accepted reference trace, and complete reusable lettering kits. The earlier personal portfolio map is retained in `app/portfolio-map.tsx` for later integration.

## Complete lettering kits

**Map Capitals** contains A–Z and two alternate forms (28 vector pieces). Twelve sampled forms from IMG_5431 are retained. The missing capitals are drawn with a broad pen in a matching style; A and O were also redrawn to repair a clipped counter and an accidental attached stroke in the earlier extraction.

**Map Script** contains uppercase A–Z and lowercase a–z, plus a space. All 52 letter contours are independently authored pen paths, informed by the low x-height, slant, loops, and weight variation visible across the user's IMG_5430, IMG_5431, IMG_5432, and IMG_5433 photos. They are a designed companion alphabet, not exact extractions of every handwritten source character. Unseen or ambiguous letters are inferred in the same style. No stock italic font supplies this kit.

The Letter kit screen has three alphabet views and downloads for `public/fonts/map-capitals.ttf` and `public/fonts/map-script.ttf`. These are TrueType exports of the same outlines used in the SVG artwork. The capital font contains uppercase letters; the script font contains both cases. They are alphabet fonts, without numerals, punctuation, or advanced contextual ligatures.

The JSON outlines are in `app/letter-kit/glyphs.json` and `app/letter-kit/cursive-glyphs.json`. The authored pen recipes and the nib-to-contour conversion are in `scripts/build-complete-kits.py`. `scripts/export-map-fonts.py` exports the fonts without reading a source font file.

## Tower reconstruction and clearance

The reconstructed tower uses 71 capital placements, 78 cursive placements, 62 stair strokes, and three manually drawn entrance paths. `reference-layout.json` records measured capital positions and stair geometry. `reconstruction.ts` assembles actual glyph outlines; its cursive baseline is an invisible positioning guide.

Each letter has a padded, rotated bound. `clearance.ts` clips each stair segment against those bounds and retains its longest clear run. This accounts for ascenders, descenders, slant, line width, and rounded line caps. Letters are not covered with opaque patches, and no visible circular boundary is added.

Original trace and Overlay expose the unchanged accepted `public/study/stair-tower.svg` for comparison. Rebuilt and Show parts contain independent vector pieces and no reference image. The complete tower tracing remains tagged `accepted-tower-study` at `a0a356c20cd77ea1d4aa9cfde0ced423b7af152e`. The original tracing's 99.8% ink agreement is not an accuracy claim for the reconstruction or these new alphabets.

The observatory and gallery use independent geometry in `app/letter-kit/layout.ts`. Their lettering can be rearranged without changing the building plan. Pan, pinch, wheel, zoom buttons, and keyboard navigation remain available throughout the study.

## Development and verification

```sh
npm install
npm run dev
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.mjs
npm run build
```

To regenerate the completed alphabets and exports from the checked-in sampled pieces:

```sh
python3 scripts/build-complete-kits.py
python3 scripts/export-map-fonts.py
node scripts/render-kits.mjs
node --experimental-strip-types scripts/render-reconstruction.mjs
node --experimental-strip-types scripts/verify-letter-clearance.mjs
```

Offline authoring uses NumPy, OpenCV, fontTools, and Sharp. These are not browser dependencies. Generated proof sheets and reports go into ignored `outputs/alphabet` and `outputs/reconstruction` folders.

The raster clearance verifier renders actual letter paths and stair strokes separately at 1010×1025, including line width and round caps. The current result is **zero overlapping ink pixels and zero stair pixels within three pixels of letter ink**. Geometric tests separately exercise rotated obstacles, endpoint contact, internal crossings, fully blocked segments, all 62 rendered stairs, alphabet completeness, glyph reuse, floor-plan separation, and camera math. All 19 tests pass.

Browser inspection covers the three alphabet views, the rebuilt tower, desktop and 320×568 phone layouts, zoom, drag, and Fit. Physical touchscreen pinch remains untested on real hardware.

The original extraction can be reproduced with `scripts/trace-tower.py`, `scripts/extract-letter-kit.py`, and the reconstruction-fitting scripts. Running the older capital extraction resets that kit to its initial partial alphabet; rerun `build-complete-kits.py` and the font exporter afterward. `fit-reference-details.py` only owns stair and doorway geometry; it no longer replaces the custom script kit.

## Reference and retained portfolio content

Personal content comes from https://www.sriraam.me/ (accessed 7 September 2026). The map study is based on the user's four replica photographs. Original Marauder’s Map artwork belongs to its respective rights holders. Prior cover reference: https://minalima.com/shop-wizarding-world/shop-by-collection/the-marauders-map/ . UI labels still use locally served IM Fell English and Cormorant Garamond; these are separate from the custom map-lettering kits.

The retained portfolio uses Pretext for text measurement. The custom letter-outline construction and stair clearance do not depend on Pretext.
