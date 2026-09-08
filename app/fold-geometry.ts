// Twelve equal strips: two stationary center strips and five hinged leaves per side.
// Alternating mountain/valley hinges preserve one continuous printed sheet.
export const LEAVES = 5;
export const FOLD_STEPS = 3;
export const MAP_RATIO = 3;
export const clampFold = (step: number) =>
  Math.max(0, Math.min(FOLD_STEPS, step));
export function hingeAngle(
  side: 'left' | 'right',
  depth: number,
  step: number,
) {
  return (
    (side === 'left' ? -1 : 1) *
    (depth % 2 ? 1 : -1) *
    180 *
    (1 - clampFold(step) / FOLD_STEPS)
  );
}
export function sheetIndex(side: 'left' | 'right', depth: number) {
  return side === 'left' ? LEAVES - depth : LEAVES + 1 + depth;
}
export function foldBounds(left: number, right: number) {
  const reach = (step: number) => {
    const cosine = Math.cos(Math.PI * (1 - clampFold(step) / FOLD_STEPS));
    let position = 0,
      furthest = 0;
    for (let depth = 1; depth <= LEAVES; depth++) {
      position += depth % 2 ? cosine : 1;
      furthest = Math.max(furthest, position);
    }
    return furthest;
  };
  const a = reach(left),
    b = reach(right);
  return { width: 2 + a + b, center: (b - a) / 2 };
}
