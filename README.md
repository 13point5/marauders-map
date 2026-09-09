# Sriraam’s Map

The current preview focuses on **one Research Tower and its entrance**. The previous full estate was rejected for its design and laggy navigation. Folding and the rest of the estate are parked while this individual section is developed.

## Current implementation

React 19 + TypeScript, Vinext/Vite, local IM Fell English fonts, hosted through Sites/Cloudflare. No Pretext, Canvas, WebGL, or animation library.

The tower composition follows the circular Research Tower in `references/proposals/wide-estate-concept.png`, with unequal stair flights, landings, and an angled entrance. It is an original interpretation, not a pixel-accurate reconstruction of the proposal or film prop.

Architecture uses the previously approved quill glyph kit recovered from commit `f9c25fd`. Some capitals derive from photographed lettering; companion capitals and the cursive kit were authored to match. Glyph contours were simplified at 0.22 kit units (the capitals are 100 units tall), then uniformly scaled and positioned ahead of time. `scripts/build-research-tower.py` combines them into six vector layers in `app/research/ink.json`. A server component renders those layers once and passes the drawing to the client camera as stable content; the large ink data is excluded from the client JavaScript bundle. The drawing is editable vector geometry, not a generated bitmap or runtime font layout. Labels use the local font.

The camera owns one fixed-size drawing layer. Pointer, pinch, wheel and keyboard input update a CSS translate/scale transform through one requestAnimationFrame callback. Gestures do not update React state or resize the SVG. Fit and +/- controls provide alternatives. Plain wheel input pans; Ctrl/Command-wheel zooms at the pointer. The page does not mount the older full estate or twelve folded panels. Development-only DOM diagnostics record camera writes; production builds exclude them.

## Files

- `app/page.tsx`: server-composed drawing; `app/research/experience.tsx`: client controls and research note.
- `app/research/tower.tsx`, `ink.json`: static vector artwork and labels.
- `app/research/glyphs.json`, `cursive-glyphs.json`: approved lettering kit with simplified contours.
- `app/research/camera.ts`, `use-camera.ts`: pure camera math and imperative input handling.
- `scripts/build-research-tower.py`: reproducible tower composition; requires Python and fontTools.
- `scripts/simplify-quill-kit.py`: optional one-time contour preparation; requires fontTools, OpenCV and NumPy. The committed kit is already prepared.
- `references/`: all twelve supplied source images, previews, inspected crops, prompts and concept proposals. Original HEIC files remain byte-for-byte; the manifest records checksums. They are not shipped as website assets.
- `public/study/`, `app/map-sections/`: retained approved photographic vector studies.
- `app/estate/`, fold and previous camera modules: parked previous implementation, not imported by the current route. Source history retains the whole unfolding experience for later work.

## Development and verification

```sh
npm install
npm run dev
npm run test:map
npx tsc --noEmit
npm run build
```

Regenerate artwork with `python3 scripts/build-research-tower.py`. The script creates an optional inspection SVG under ignored `outputs/research-tower/`.

Current camera tests verify fit at narrow, landscape and desktop dimensions, pointer anchoring and recoverability after extreme pan. Older tests concern retained studies and parked code, not the current tower's artistic fidelity. Browser checks cover dragging, zoom controls, fit, keyboard and the research note at desktop and phone viewport sizes. Physical phone pinch and device frame rate still need testing on an actual phone. Development camera callback intervals are not a GPU frame-rate benchmark.

Original Marauder’s Map artwork belongs to its respective rights holders. Reference images were supplied by the user.
