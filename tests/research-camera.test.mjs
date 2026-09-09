import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fitCamera,
  zoomCamera,
  boundCamera,
  ART_WIDTH,
  ART_HEIGHT,
} from '../app/research/camera.ts';
void test('fit contains the entire tower in narrow phones, landscape and desktop', () => {
  for (const [w, h] of [
    [320, 500],
    [390, 670],
    [844, 240],
    [1440, 750],
  ]) {
    const c = fitCamera(w, h);
    assert.ok(c.x >= 0 && c.y >= 0);
    assert.ok(c.x + ART_WIDTH * c.scale <= w);
    assert.ok(c.y + ART_HEIGHT * c.scale <= h);
  }
});
void test('zoom keeps the map location beneath the fingers stationary', () => {
  const c = { x: -130, y: 70, scale: 0.8 },
    anchor = { x: 94, y: 267 };
  const next = zoomCamera(c, 2.1, anchor);
  assert.ok(
    Math.abs((anchor.x - c.x) / c.scale - (anchor.x - next.x) / next.scale) <
      1e-8,
  );
  assert.ok(
    Math.abs((anchor.y - c.y) / c.scale - (anchor.y - next.y) / next.scale) <
      1e-8,
  );
});
void test('extreme panning always leaves recoverable paper in the viewport', () => {
  for (const sign of [-1, 1]) {
    const c = boundCamera(
      { x: sign * 100000, y: sign * 100000, scale: 2 },
      390,
      600,
    );
    assert.ok(c.x <= 342 && c.x + ART_WIDTH * c.scale >= 48);
    assert.ok(c.y <= 552 && c.y + ART_HEIGHT * c.scale >= 48);
  }
});
