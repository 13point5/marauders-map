import test from 'node:test';
import assert from 'node:assert/strict';
import {
  foldBounds,
  hingeAngle,
  sheetIndex,
  LEAVES,
} from '../app/fold-geometry.ts';

void test('the front faces reconstruct the complete map without repeated or missing strips', () => {
  const indices = [
    ...Array.from({ length: LEAVES }, (_, i) => sheetIndex('left', LEAVES - i)),
    5,
    6,
    ...Array.from({ length: LEAVES }, (_, i) => sheetIndex('right', i + 1)),
  ];
  assert.deepEqual(
    indices,
    Array.from({ length: 12 }, (_, i) => i),
  );
});
void test('accordion uses alternating mountain and valley hinges and becomes flat', () => {
  for (const side of ['left', 'right'])
    for (let depth = 1; depth <= LEAVES; depth++) {
      assert.equal(Math.abs(hingeAngle(side, depth, 0)), 180);
      assert.equal(Math.abs(hingeAngle(side, depth, 3)), 0);
      if (depth < LEAVES)
        assert.equal(
          hingeAngle(side, depth, 1),
          -hingeAngle(side, depth + 1, 1),
        );
    }
});
void test('camera fits closed and fully open paper, following asymmetric expansion', () => {
  assert.deepEqual(foldBounds(0, 0), { width: 2, center: 0 });
  assert.deepEqual(foldBounds(3, 3), { width: 12, center: 0 });
  assert.deepEqual(foldBounds(0, 3), { width: 7, center: 2.5 });
  assert.deepEqual(foldBounds(3, 0), { width: 7, center: -2.5 });
});
void test('the first reveal includes the furthest hinge, not just the outer tip', () => {
  assert.ok(Math.abs(foldBounds(1, 1).width - 4) < 1e-10);
});
