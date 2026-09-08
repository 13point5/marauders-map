# Sriraam’s Map

A responsive parchment map that starts folded. Tap the cover or “Mischief Managed” to reveal it; open either side independently, or use “Open fully” for the whole sequence. Once open, drag, pinch, double-tap, scroll, or use the zoom controls to explore. “Fold again” returns to the cover.

## Current implementation

React + TypeScript, Vinext/Vite, CSS 3D transforms, hosted through Sites/Cloudflare. No animation library or Pretext dependency. Local IM Fell English fonts render interface text.

The paper is a continuous twelve-strip sheet: two stationary center strips, five alternating mountain/valley hinges on each side. Each side expands in three stages. A shared SVG drawing is clipped to each front strip; the two illustrated outermost back faces meet to form the cover. Responsive framing follows independent side expansion. Reduced-motion preferences disable the CSS motion.

The unfolded map is **live SVG geometry and lettering**, authored in React/TypeScript. A shared SVG symbol supplies the exact same geometry to each folded leaf and the open map. Walls, pen returns, circular stairs, branching word-canopies, garden beds, water and bridges are separate editable elements. IM Fell English capitals and italic lettering follow measured wall paths; sharp corners use short continuous pen returns instead of squeezing glyphs around the bend. This is an original coded interpretation, not an exact reconstruction of the film prop.

The Research Tower is substantially larger than the small paired Owlery. The Workshop has an irregular five-bay plan, the Great Hall is a single long buttressed room, and the Library follows a curved wing. The forest has dense word canopies and gnarled trunks; the garden has herb beds, roses, vegetable rows and a glasshouse. Tapping a place opens a short personal note; named footsteps traverse the halls. Voice activation is not implemented.

The folded cover remains an illustrated WebP asset. Its built-in image-generation prompt is retained in `references/proposals/implemented-art-prompts.txt`. The earlier flat estate bitmap has been removed from the app. Original vector tracing studies remain available as reference material.

## Project layout

- `app/page.tsx`: folding state, phone/desktop framing, controls, and open-map view.
- `app/folded-map.tsx`: nested hinged paper leaves and front/back textures.
- `app/fold-geometry.ts`: crease angles, texture indices, and projected bounds.
- `app/map-camera.ts` and `app/use-map-navigation.ts`: anchored zoom, pan, pointer pinch, and Safari gesture handling.
- `app/estate/`: authored map geometry, letter metrics, landscape, selectable place outlines and styles.
- `public/art/`: illustrated folded cover.
- `references/`: all twelve supplied source images, oriented previews, inspected crops, prompts and concept proposals. Original HEIC files are preserved byte-for-byte; the manifest records checksums. These references are not shipped as website assets.
- `public/study/`, `app/map-sections/*.json`, and the trace/verification scripts: retained approved vector studies for future lettering work. These no longer appear as app views. Rejected collage layouts and their temporary generated fragments have been removed.

## Development and verification

```sh
npm install
npm run dev
npm run test:map
npx tsc --noEmit
npm run build
```

The geometry tests cover continuous strip ordering, alternating hinges, framing bounds, glyph fitting, and curved geometry. Camera tests cover pinch bounds and zoom anchoring. Older reference tests check retained vector studies; they do not verify the new illustration. Browser checks cover closed/partial/open states, independent unfolding, automatic opening, refolding, dragging, overview controls, and phone/desktop viewport sizes. Physical touchscreen behavior should also be tried on a real phone.

Original Marauder’s Map artwork belongs to its respective rights holders. Reference images were supplied by the user.
