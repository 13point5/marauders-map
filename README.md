# Sriraam’s map

An interactive, source-traced study of the Marauder’s Map: the approved tower and turning passage, the neighbouring Clock Tower and halls, and the stairwell/turret. All three sections come from the user’s IMG_5431 photograph and share its original coordinates. The app presents one continuous drawing without section selectors or comparison modes. Drag, wheel scrolling, pinch, zoom buttons, and keyboard navigation explore the map on different screen sizes.

## What the artwork is

The map is SVG contour artwork, **not live text or a font**. Python/Pillow/OpenCV isolate photographed ink within authored section boundaries and trace it into editable filled paths. Letterforms and their joins come from the source. No automatic gap closing, stroke thinning, invented interiors, or geometric lettering layout is applied. The newer sections select whole connected ink components to avoid severing strokes at scope boundaries. Inspected paper stains are excluded explicitly.

This method reproduces existing structures. Creating genuinely new architecture in the same style requires composing and drawing new vector lettering/joins; tracing does not generate a new design. The earlier generated font kits and invented layouts have been removed from the current source. They remain recoverable through Git history.

Pretext is not used and its dependency has been removed. UI labels use local IM Fell English fonts, independently of the map artwork.

## Stack and source layout

- React and TypeScript; Vinext/Vite; CSS; hosted through Sites/Cloudflare.
- `app/map-sections/`: section metadata, source-coordinate framing, and SVG composition.
- `public/study/`: current vector artwork and matching photograph crops.
- `app/map-camera.ts` / `app/use-map-navigation.ts`: responsive pan, pinch, wheel, and keyboard navigation.
- `scripts/sections.json`: authored boundaries and paper-stain exclusions for the new sections.
- `scripts/trace-reference-section.py`: generator for the unchanged approved tower.
- `scripts/trace-map-sections.py`: generator for the neighbouring structures.

The user's original HEIC files remain outside the repository. Coordinates use EXIF-oriented portrait photos normalized to 1650 pixels wide. The source used here is 4284×5712 after orientation. Supply an equivalent full-resolution PNG/JPEG to regenerate. Preserve orientation; a raw unrotated HEIC decode will produce incorrect crops. The combined comparison crop covers `[185,335,1330,1695]` in normalized photo coordinates.

## Development

```sh
npm install
npm run dev
npm run test:map
npx tsc --noEmit
npm run build
```

## Reproduce and verify the ink

Authoring requires Python with Pillow, NumPy, and OpenCV; verification uses Sharp (available through the current dependency tree). These tools are not shipped to the browser.

```sh
python3 scripts/trace-reference-section.py /path/to/oriented-photo.png
python3 scripts/trace-map-sections.py /path/to/oriented-photo.png
node scripts/verify-reference-section.mjs
python3 scripts/verify-reference-topology.py
node scripts/verify-map-sections.mjs
python3 scripts/verify-map-topology.py
```

Ignored `outputs/` contains cleaned source masks, proof images, and verification reports. Ink intersection-over-union measures the vector conversion against the cleaned source mask, not against the unprocessed photograph. The topology check detects disconnected strokes and newly merged components introduced during vectorization. Browser checks cover the continuous map, scrolling/zoom, and responsive layouts; physical touchscreen gestures still need a device check.

Original Marauder’s Map artwork belongs to its respective rights holders. Source photographs were supplied by the user. The former portfolio content and obsolete font experiments were removed from the working tree at the user’s request.
