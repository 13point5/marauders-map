# Sriraam’s Map

The current preview is **one connected castle wing**: a Great Hall, Research Tower, Study, Field Notes room, small Workshop and Entrance Court. It is a whole pannable map with clickable rooms. Folding, forest, gardens and the full estate are outside the current scope.

## Current implementation

React 19 + TypeScript, Vinext/Vite, SVG, local IM Fell English fonts and native pointer events, hosted through Sites/Cloudflare. No Pretext, Canvas, WebGL or animation library.

The architectural direction follows `references/proposals/wide-estate-concept.png`: an angled plan, masonry outlines, buttresses, door openings, unequal room footprints and selective lettering. The tower has three short stair flights separated by broad landings. This is an original coded interpretation, not an exact reconstruction of the film prop. The earlier quill-letter studies remain available as references.

`app/castle/drawing.tsx` renders the architecture on the server and passes it as stable content into the client map. `app/castle/plan.ts` defines room identities, hit regions, camera targets and personal content from sriraam.me. Rooms can be added or enlarged by editing their geometry and matching metadata; automatic room growth and a content editor are not implemented.

The camera updates one fixed-size drawing layer through requestAnimationFrame. Gestures do not update React state or resize the SVG. Temporary compositor promotion during movement is released after 140 ms of inactivity so zoomed vector ink is rerasterized sharply. Drag pans; touch pinch or Ctrl/Command-wheel zooms around the gesture; plain wheel pans. Keyboard arrows, +/- and zero provide alternatives. The room picker focuses a destination; its note appears to the side on desktop and below on phones.

## Files

- `app/page.tsx`: current server-composed route.
- `app/castle/drawing.tsx`, `plan.ts`: castle artwork and room content.
- `app/research/experience.tsx`, `research.css`: reused map interface and responsive styling.
- `app/research/camera.ts`, `use-camera.ts`: camera math and gesture handling.
- `app/research/tower.tsx`, `ink.json`, glyph kits and `scripts/build-research-tower.py`: retained earlier quill tower; not imported by the current route.
- `references/`: supplied originals, previews, inspected crops and concept proposals. HEIC originals remain byte-for-byte, with checksums in the manifest. These are not shipped as website assets.
- `public/study/`, `app/map-sections/`: retained approved photographic vector studies.
- `app/estate/`, fold and older camera modules: parked prior implementations, not mounted by the current route.

## Development and verification

```sh
npm install
npm run dev
npm run lint
npm run test:map
npx tsc --noEmit
npm run build
```

Camera tests verify fit at phone, landscape and desktop dimensions, pointer anchoring and recovery after extreme pan. The rest of the 22 tests concern retained studies and parked code. Browser checks cover all six room notes, narrow-phone overflow, actual emulated two-touch input, dragging from a room without opening it, zoom controls and keyboard panning. Browser touch emulation is not a physical iPhone frame-rate test.

Original Marauder’s Map artwork belongs to its respective rights holders. Reference photographs were supplied by the user.
