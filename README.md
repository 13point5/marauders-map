# Sriraam’s Marauder’s Map

A personal website with an original MinaLima map cover, an interactive typographic floor plan, independently folding wings, and animated named footsteps.

## Content and artwork

Personal biography, interests, article, and social links come from https://www.sriraam.me/ (accessed 7 September 2026).

Cover/reference artwork: MinaLima, https://media.minalima.com/2023/02/zoom-hpwp07-1300x1300.jpg. Source: https://minalima.com/shop-wizarding-world/shop-by-collection/the-marauders-map/ . Original artwork belongs to its respective rights holders. Official replica reference: https://harrypottershop.co.uk/products/marauders-map-replica . The live interior is an original interactive SVG floor plan with text forming the architectural walls.

Fonts: IM Fell English and Cormorant Garamond, served locally from Google Fonts assets.

## Development

Run `npm install`, then `npm run dev`. Build with `npm run build`; check types with `npx tsc --noEmit`. Run the camera geometry tests with `npm run test:map`.

Content lives in `app/page.tsx`; architectural geometry and named footstep routes are in `app/map-art.tsx`.

Wall inscriptions use [Pretext](https://github.com/chenglou/pretext) to measure the loaded local font, fit whole words, and reuse prepared text without repeated DOM measurement. Walls have separate straight segments, door openings, and measured curved inscriptions. Short wall returns are deliberately blank instead of breaking words.

Drag with a mouse or finger to pan. Pinch to zoom on touchscreens; use the wheel or trackpad to pan and Ctrl/Command-scroll to zoom at the pointer. Double-click empty map space to zoom, or use the zoom buttons and Fit. With the map focused, arrow keys pan, +/− zoom, and 0 fits the full map. The viewport adapts to available width and height, with persistent wing controls on small screens. The camera math and interaction handlers live in `app/map-camera.ts` and `app/use-map-navigation.ts`.

Click “Mischief Managed” or the cover to open. Voice activation appears when the browser supports SpeechRecognition; it starts only after pressing the microphone control. Speech availability and permission depend on the browser. Click opening remains available. The site respects reduced motion, provides keyboard-accessible destinations, and allows footsteps to be paused.

## Validation

Browser checks cover opening/folding, all five destinations, named footsteps, zoom buttons, drag and wheel panning, keyboard navigation, and layouts at 320×568, 390×844, 768×1024, 844×390, and 1440×1000. Measured inscriptions stay within their wall capacities. Camera tests cover pinch scaling, pointer anchoring, centered overview margins, fit, and boundary clamping. Physical touchscreen pinch and microphone recognition have not been tested on real hardware.
