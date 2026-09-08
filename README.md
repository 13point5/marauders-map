# Sriraam’s Map

A responsive parchment map that starts folded. Tap the cover or “Mischief Managed” to reveal it; open either side independently, or use “Open fully” for the whole sequence. Once open, drag, pinch, double-tap, scroll, or use the zoom controls to explore. “Fold again” returns to the cover.

## Current implementation

React + TypeScript, Vinext/Vite, CSS 3D transforms, hosted through Sites/Cloudflare. No animation library or Pretext dependency. Local IM Fell English fonts render interface text.

The paper is a continuous twelve-strip sheet: two stationary center strips, five alternating mountain/valley hinges on each side. Each side expands in three stages. The same map texture is sliced by background position across the front faces; the two outermost back faces meet to form the cover. Responsive framing follows independent side expansion. Reduced-motion preferences disable the CSS motion.

The current artwork is **AI-generated raster illustration, not live type, a font, or the earlier traced vector artwork**. The two images were generated with the built-in image tool using the user's original photos as references, then encoded as WebP without changing the composition. `references/proposals/implemented-art-prompts.txt` contains the exact prompts. Fine lettering is illustrative, not a verified reconstruction of every original glyph. The folds are a working web interaction, not an exact replica of the movie prop’s paper mechanics.

This version focuses on the cover, unfolding, and exploration. Destination content, footsteps, and voice activation are not yet implemented.

## Project layout

- `app/page.tsx`: folding state, phone/desktop framing, controls, and open-map view.
- `app/folded-map.tsx`: nested hinged paper leaves and front/back textures.
- `app/fold-geometry.ts`: crease angles, texture indices, and projected bounds.
- `app/map-camera.ts` and `app/use-map-navigation.ts`: anchored zoom, pan, pointer pinch, and Safari gesture handling.
- `public/art/`: current cover and estate images.
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

The geometry tests cover continuous texture ordering, alternating hinges, and framing bounds. Camera tests cover pinch bounds and zoom anchoring. Older reference tests check retained vector studies; they do not verify the new illustration. Browser checks cover closed/partial/open states, independent unfolding, automatic opening, refolding, dragging, overview controls, and phone/desktop viewport sizes. Physical touchscreen behavior should also be tried on a real phone.

Original Marauder’s Map artwork belongs to its respective rights holders. Reference images were supplied by the user.
