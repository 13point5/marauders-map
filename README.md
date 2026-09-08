# Sriraam’s Marauder’s Map — lettering lab

A prototype for constructing original map architecture from reusable letter shapes, with the accepted photograph trace preserved as a reference. The earlier personal website is retained in `app/portfolio-map.tsx`.

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

## Current focus: one stair tower

The homepage is now a single-shape study from the user's IMG_5431 photograph. The previous portfolio experience is retained in `app/portfolio-map.tsx` for later integration, and is not shown in this study.

`public/study/stair-tower.svg` contains only filled ink contours. It is a vector tracing of the supplied artwork, not a newly typeset tower or a generative building system. There are no added circular or rectangular outlines. The photo, drawing, and overlay modes share the same image coordinates. Pan/zoom remains available.

To reproduce the study, decode IMG_5431 at full resolution to JPEG with orientation metadata, then run `python3 scripts/trace-tower.py /path/to/decoded-photo.jpg` and `node scripts/verify-tower.mjs`. The extraction requires Pillow, NumPy, and OpenCV; the verification uses the existing Sharp installation. These are offline authoring tools, not site runtime dependencies.

The verifier rasterizes the actual SVG and compares it to the isolated dark-ink mask at 1010×1025 pixels. It checks retention, precision, intersection-over-union, and absence of added geometric border primitives. This is a tracing-fidelity check, not an independent perceptual-quality score. The original photo overlay and enlarged browser screenshots provide the visual check. Generated masks and reports are in the ignored `outputs/study` folder.

## Original structures from reusable letter pieces

The current homepage has an original observatory, an original gallery, the accepted reference tower, and a visible letter kit. The new structures are assembled from 14 vector glyph forms (a partial capital alphabet with alternates), extracted and straightened from the photographed capital rim. They are not traces of either new floor plan, and they are not a complete installable font.

`app/letter-kit/glyphs.json` holds the reusable outlines; `app/letter-kit/layout.ts` owns the independently defined floor plans and places the pieces along smooth curves. Letter widths, orientations, and scales are controlled per piece. Conservative oriented bounds prevent letter collisions, and stair treads that would meet the letter bounds are omitted. Rearranging the lettering changes its selection while leaving the floor plan fixed.

The accepted original study is committed at `a0a356c20cd77ea1d4aa9cfde0ced423b7af152e` and tagged `accepted-tower-study`. Its SVG asset remains unchanged. The 99.8% reference tracing agreement does not apply to the new designs, whose geometry is intentionally different. Their checks test independent geometry, deterministic rearrangement, letter separation, and stair clearance. Run `node --experimental-strip-types --test tests/letter-layout.test.mjs`.

The kit is a proof of reusable construction. Extending it to a full alphabet, script forms, denser wall arrangements, and a wider architectural vocabulary remains design work; it should not be presented as a finished general-purpose font. `scripts/extract-letter-kit.py` reproduces the current pieces after the reference ink mask has been generated. The abandoned connected-photo extraction is kept only in ignored local study outputs, not published.
