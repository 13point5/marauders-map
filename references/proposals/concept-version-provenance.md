# Illustrated concept alternative

Source: `references/proposals/wide-estate-concept.png`, 2172 × 724.

Route: `/concept`. This is deliberately an illustrated alternative, separate from the editable, glyph-built SVG castle at `/`.

- Original: untouched source copied to `public/art/concept-original.png`.
- Restored: `public/art/concept-restored.png`, 2172 × 724. Built-in image generation performed a preservation edit with clearer linework. **Its pixel dimensions did not increase** despite a requested 3840 × 1280 output.
- Castle detail: `public/art/concept-castle-detail.png`, 1536 × 1024. Built-in image generation enlarged approximately the central 930 × 615 source region. This increases effective pixels per room, but synthesizes small architectural and lettering details; it is not a pixel-exact crop or faithful archival enlargement.
- WebP copies use cwebp quality94 for display (~800KB each); PNG source downloads remain available. Original is available as an explicit comparison.

Generation tool: built-in `image_gen`, September22,2026. No CLI/API fallback and no pixel-count-only upscale.

## Restoration prompt

Use case: precise-object-edit. Input image is the EDIT TARGET, not loose inspiration. Faithfully restore/upscale this exact complete wide parchment estate map to a high-resolution 3:1 image, ideally 3840x1280. Preserve the entire existing composition and every region's silhouette, orientation, position, relative size, room topology, pathway, tower, building, trees, ink density, and border. Make only the fine ink lines, masonry hatching, woodcut trees, and small calligraphy cleaner and more detailed at higher resolution. Preserve the aged tan parchment and deep brown ink. Do NOT redesign, simplify, add buildings, move buildings, enlarge towers, crop edges, change aspect ratio, create new decorations, or substitute a different layout. Precisely preserve the left dark woodland including its pale branching tree paths and moon; the little castle elevation lower left with bridge over the river; the original angled central main building with circular Research Tower upper-left, central chamfered Great Hall, circular Library upper-right, smaller twin turrets above The Owlery on the right, The Workshop lower-right, The Common Room lower-middle; and the irregular formal Garden at far right. Preserve all exact major labels in those exact positions: 'The Dark Forest', 'Research Tower', 'The Great Hall', 'The Library', 'The Owlery', 'The Workshop', 'The Common Room', 'The Garden'. Preserve border and compass markers. This is a preservation/upscale job, not a creative reinterpretation.

## Castle detail prompt

Use case precise-object-edit. The input is exact edit target. Create a high-resolution cropped enlargement of ONLY the central castle floorplan from this exact image. Crop coordinates in its 2172 by724 input: left760 top20 right1690 bottom635. Output this 930x615 source region as approximately1536x1024 or larger, preserving precise composition and all architectural outlines. Show the complete Research Tower near top left, the Great Hall center left, the Library upper right, Owlery at right, Workshop lower right, Common Room bottom center, all connecting rooms and passages. This is a precise magnification of the existing drawing, absolutely not a redesign. Increase resolution and fine ink detail, keep identical shapes, room positions, proportions, alignments, labels, pathways and parchment tone. Do not insert buildings or add fantasy motifs. Castle surroundings must crop at specified bounds, not bring the forest or garden into the frame.
