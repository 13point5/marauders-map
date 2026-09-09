'use client';
/* oxlint-disable react/react-compiler -- This imperative camera intentionally owns a DOM ref's style inside an effect, never a React prop or state object. */
import { useEffect, useRef, type RefObject } from 'react';
import {
  boundCamera,
  fitCamera,
  zoomCamera,
  type Camera,
  type Point,
} from './camera';

// Gestures own one transform, never React state or artwork dimensions.
export function useCamera(
  view: RefObject<HTMLDivElement | null>,
  art: RefObject<HTMLDivElement | null>,
) {
  const actions = useRef({ fit: () => {}, zoom: (_factor: number) => {} });
  useEffect(() => {
    const viewport = view.current,
      layer = art.current;
    if (!viewport || !layer) return;
    let width = viewport.clientWidth,
      height = viewport.clientHeight;
    let base = fitCamera(width, height),
      camera: Camera = base;
    let frame = 0,
      suppressUntil = 0,
      dragged = false;
    let paintCount = 0,
      lastFrame = 0;
    const frameIntervals: number[] = [];
    const pointers = new Map<number, Point>();
    let origin: Point | null = null;
    let rect = viewport.getBoundingClientRect();
    const local = (p: Point) => ({ x: p.x - rect.left, y: p.y - rect.top });
    const paint = () => {
      frame = 0;
      layer.style.transform = `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`;
      if (process.env.NODE_ENV === 'development') {
        const now = performance.now();
        if (lastFrame && now - lastFrame < 100)
          frameIntervals.push(now - lastFrame);
        lastFrame = now;
        layer.dataset.cameraPaints = String(++paintCount);
        layer.dataset.cameraFrameIntervals = JSON.stringify(
          frameIntervals.slice(-120).map((n) => Math.round(n * 10) / 10),
        );
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const fit = () => {
      camera = base;
      schedule();
    };
    const zoom = (factor: number, anchor = { x: width / 2, y: height / 2 }) => {
      const scale = Math.max(
        base.scale,
        Math.min(base.scale * 5, camera.scale * factor),
      );
      camera = boundCamera(zoomCamera(camera, scale, anchor), width, height);
      schedule();
    };
    const pan = (x: number, y: number) => {
      camera = boundCamera(
        { ...camera, x: camera.x + x, y: camera.y + y },
        width,
        height,
      );
      schedule();
    };
    actions.current = { fit, zoom };
    const pair = () => {
      const [a, b] = [...pointers.values()];
      return {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      rect = viewport.getBoundingClientRect();
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) {
        origin = { x: event.clientX, y: event.clientY };
        dragged = false;
      }
      if (pointers.size > 1) {
        dragged = true;
        suppressUntil = Date.now() + 500;
      }
      if (!(event.target as Element).closest('button,a'))
        viewport.focus({ preventScroll: true });
    };
    const move = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const before = pointers.size === 2 ? pair() : null;
      const next = { x: event.clientX, y: event.clientY };
      if (
        pointers.size === 1 &&
        !dragged &&
        origin &&
        Math.hypot(next.x - origin.x, next.y - origin.y) < 5
      )
        return;
      pointers.set(event.pointerId, next);
      dragged = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
      event.preventDefault();
      if (before) {
        const after = pair();
        if (before.distance > 0)
          zoom(after.distance / before.distance, local(before.center));
        pan(after.center.x - before.center.x, after.center.y - before.center.y);
      } else pan(next.x - previous.x, next.y - previous.y);
    };
    const up = (event: PointerEvent) => {
      if (dragged) suppressUntil = Date.now() + 400;
      pointers.delete(event.pointerId);
      if (viewport.hasPointerCapture(event.pointerId))
        viewport.releasePointerCapture(event.pointerId);
      origin = [...pointers.values()][0] ?? null;
      if (!pointers.size) viewport.classList.remove('is-dragging');
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      rect = viewport.getBoundingClientRect();
      const units =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
      if (event.ctrlKey || event.metaKey)
        zoom(
          Math.exp(-event.deltaY * units * 0.006),
          local({ x: event.clientX, y: event.clientY }),
        );
      else
        pan(
          -(event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX) *
            units,
          -(event.shiftKey ? 0 : event.deltaY) * units,
        );
    };
    const click = (event: MouseEvent) => {
      if (Date.now() < suppressUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const double = (event: MouseEvent) => {
      if ((event.target as Element).closest('button,a')) return;
      event.preventDefault();
      zoom(1.6, local({ x: event.clientX, y: event.clientY }));
    };
    const key = (event: KeyboardEvent) => {
      if (event.target !== viewport) return;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [60, 0],
        ArrowRight: [-60, 0],
        ArrowUp: [0, 60],
        ArrowDown: [0, -60],
      };
      if (moves[event.key]) {
        event.preventDefault();
        pan(...moves[event.key]);
      } else if (['+', '=', '-', '0'].includes(event.key)) {
        event.preventDefault();
        if (event.key === '0') fit();
        else zoom(event.key === '-' ? 1 / 1.4 : 1.4);
      }
    };
    const resetPointers = () => {
      pointers.clear();
      origin = null;
      viewport.classList.remove('is-dragging');
    };
    // Safari desktop trackpad events yield to pointer pinch when touch owns it.
    let gestureScale = 1;
    const gestureStart = (event: Event) => {
      event.preventDefault();
      gestureScale = 1;
      rect = viewport.getBoundingClientRect();
    };
    const gestureChange = (event: Event) => {
      event.preventDefault();
      if (pointers.size >= 2) return;
      const e = event as Event & {
        scale: number;
        clientX: number;
        clientY: number;
      };
      zoom(e.scale / gestureScale, local({ x: e.clientX, y: e.clientY }));
      gestureScale = e.scale;
    };
    const resize = new ResizeObserver(() => {
      const oldBase = base;
      width = viewport.clientWidth;
      height = viewport.clientHeight;
      rect = viewport.getBoundingClientRect();
      base = fitCamera(width, height);
      camera =
        camera.scale / oldBase.scale < 1.02
          ? base
          : boundCamera(
              { ...camera, scale: (camera.scale * base.scale) / oldBase.scale },
              width,
              height,
            );
      schedule();
    });
    resize.observe(viewport);
    paint();
    viewport.addEventListener('pointerdown', down);
    viewport.addEventListener('pointermove', move, { passive: false });
    viewport.addEventListener('pointerup', up);
    viewport.addEventListener('pointercancel', up);
    viewport.addEventListener('lostpointercapture', up);
    viewport.addEventListener('wheel', wheel, { passive: false });
    viewport.addEventListener('click', click, true);
    viewport.addEventListener('dblclick', double);
    viewport.addEventListener('keydown', key);
    viewport.addEventListener('gesturestart', gestureStart, { passive: false });
    viewport.addEventListener('gesturechange', gestureChange, {
      passive: false,
    });
    window.addEventListener('blur', resetPointers);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      viewport.removeEventListener('pointerdown', down);
      viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerup', up);
      viewport.removeEventListener('pointercancel', up);
      viewport.removeEventListener('lostpointercapture', up);
      viewport.removeEventListener('wheel', wheel);
      viewport.removeEventListener('click', click, true);
      viewport.removeEventListener('dblclick', double);
      viewport.removeEventListener('keydown', key);
      viewport.removeEventListener('gesturestart', gestureStart);
      viewport.removeEventListener('gesturechange', gestureChange);
      window.removeEventListener('blur', resetPointers);
    };
  }, [view, art]);
  return {
    fit: () => actions.current.fit(),
    zoom: (factor: number) => actions.current.zoom(factor),
  };
}
