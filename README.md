# Sriraam’s Map

The main route is a connected, pannable **quill-letter castle**, following the main-building arrangement in `references/proposals/wide-estate-concept.png`: Research Tower northwest, Great Hall in the middle, curved Library northeast, Common Room and substantial Workshop below, and a smaller paired Owlery to the east. The Entrance Court and small western rooms connect the wings. Seven destinations are clickable. Folding and the main map's grounds remain outside this castle pass.

`/concept` is a separate comparison experience preserving the complete generated concept, including its grounds. The original image is the exact composition; optional restored artwork and a closer castle study are image-based alternatives, not the editable vector castle. See its provenance file in `references/proposals/` for actual image sizes and generation limitations.

## Implementation

React 19 + TypeScript, Vinext/Vite, SVG, local IM Fell English labels and native pointer events, hosted through Sites/Cloudflare. No Pretext, Canvas, WebGL or animation library.

The restored Research Tower artwork remains unchanged. The rest of the castle uses its same approved capital and cursive glyph contours. `scripts/quill.py` holds the shared offline lettering primitives; the tower and castle generators compose geometry ahead of time. Each glyph is uniformly scaled, not stretched along a wall. Short pen returns occupy corners; no continuous baselines underline the letter-built walls.

The castle's six vector layers are served as one cacheable SVG resource. This keeps several megabytes of repeated glyph outlines out of React's HTML/RSC stream and lets controls initialize promptly. The artwork remains vector geometry; it is not a generated bitmap. `app/castle/plan.ts` supplies room identities, hit regions, camera targets and personal content. Geometry and metadata can be extended with new rooms; automatic content-driven building growth is not implemented.

The camera updates one fixed-size drawing layer through requestAnimationFrame. Gestures do not update React state or resize the SVG. Temporary compositor promotion during movement is released after 140ms of inactivity so zoomed ink is rerasterized sharply. Drag pans; touch pinch or Ctrl/Command-wheel zooms at the gesture; plain wheel pans. Keyboard arrows, +/- and zero provide alternatives. The room picker focuses a destination; its note appears beside the map on desktop and below on phones.

## Key files

- `app/castle/drawing.tsx`, `plan.ts`: map composition, labels and room content.
- `public/art/castle-ink.svg`: generated capital/cursive architecture.
- `scripts/build-castle.py`, `scripts/quill.py`: reproducible castle geometry and shared approved lettering primitives.
- `app/research/tower.tsx`, `ink.json`, glyph kits and `scripts/build-research-tower.py`: unchanged approved tower and its generator.
- `app/research/experience.tsx`, `research.css`, `camera.ts`, `use-camera.ts`: reused interface and gesture handling.
- `app/concept/`, `public/art/concept-*`: separate concept comparison.
- `references/`: supplied originals, previews, crops and concept proposals. HEIC originals remain byte-for-byte, with checksums in the manifest; these are not website assets.
- `public/study/`, `app/map-sections/`, `app/estate/`, older fold/camera modules: retained studies and parked implementations; not mounted by the current route.

## Development

```sh
npm install
npm run dev
npm run test:map
npx tsc --noEmit
npm run build
```

Regenerate vector architecture with `python3 scripts/build-castle.py` (requires fontTools). The shared primitive extraction was verified to reproduce the approved tower's committed ink data byte-for-byte.

The 22 existing tests cover camera fit/anchoring and retained studies. `scripts/verify-castle-gestures.mjs` accepts the CDP websocket URL from `agent-browser get cdp-url` and checks the current seven room notes, phone overflow, pinch, mouse dragging and continuous touch dragging from rooms and empty paper. It asserts full gesture displacement, protecting the capture-transfer fix that previously let drags stop after their first movement. Browser emulation is not a physical-phone frame-rate test.

Original Marauder’s Map artwork belongs to its respective rights holders. Reference photographs were supplied by the user.
