# Sriraam’s Marauder’s Map

A personal website with an original MinaLima map cover, an interactive typographic floor plan, independently folding wings, and animated named footsteps.

## Content and artwork

Personal biography, interests, article, and social links come from https://www.sriraam.me/ (accessed 7 September 2026).

Cover/reference artwork: MinaLima, https://media.minalima.com/2023/02/zoom-hpwp07-1300x1300.jpg. Source: https://minalima.com/shop-wizarding-world/shop-by-collection/the-marauders-map/ . Original artwork belongs to its respective rights holders. Official replica reference: https://harrypottershop.co.uk/products/marauders-map-replica . The live interior is an original interactive SVG floor plan with text forming the architectural walls.

Fonts: IM Fell English and Cormorant Garamond, served locally from Google Fonts assets.

## Development

Run `npm install`, then `npm run dev`. Build with `npm run build`; check types with `npx tsc --noEmit`.

Content lives in `app/page.tsx`; architectural geometry and named footstep routes are in `app/map-art.tsx`.

Click “Mischief Managed” or the cover to open. Voice activation appears when the browser supports SpeechRecognition; it starts only after pressing the microphone control. Speech availability and permission depend on the browser. Click opening remains available. The site respects reduced motion, provides keyboard-accessible destinations, and allows footsteps to be paused.

## Validation

Production build and TypeScript checks passed. Browser interaction and microphone recognition have not been manually tested.
