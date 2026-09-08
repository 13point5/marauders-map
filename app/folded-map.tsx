'use client';
import type { CSSProperties } from 'react';
import { hingeAngle, LEAVES, sheetIndex } from './fold-geometry';

function Face({ index }: { index: number }) {
  return (
    <div className="paper-face paper-front vector-front">
      <svg viewBox={`${index * 200} 0 200 800`} preserveAspectRatio="none">
        <use href="#estate-vector" width="2400" height="800" />
      </svg>
      <span className="crease-shade" />
    </div>
  );
}
function Wing({
  side,
  depth,
  step,
}: {
  side: 'left' | 'right';
  depth: number;
  step: number;
}) {
  return (
    <div
      className={`paper-leaf leaf-${side}`}
      style={{ transform: `rotateY(${hingeAngle(side, depth, step)}deg)` }}
    >
      <Face index={sheetIndex(side, depth)} />
      <div
        className={`paper-face paper-back ${depth === LEAVES ? `cover-half cover-${side}` : ''}`}
      >
        <span className="crease-shade" />
      </div>
      {depth < LEAVES && <Wing side={side} depth={depth + 1} step={step} />}
    </div>
  );
}
export function FoldedMap({
  left,
  right,
  width,
  scale,
  center,
}: {
  left: number;
  right: number;
  width: number;
  scale: number;
  center: number;
}) {
  const style = {
    '--leaf': `${width}px`,
    '--paper-height': `${width * 4}px`,
    '--camera-scale': scale,
    '--camera-x': `${-center * width}px`,
  } as CSSProperties;
  return (
    <div className="fold-camera" style={style} aria-hidden="true">
      <div className="fold-position">
        <div className="fold-sheet">
          <div className="center-strip">
            <Face index={5} />
          </div>
          <div className="center-strip second-strip">
            <Face index={6} />
          </div>
          <Wing side="left" depth={1} step={left} />
          <Wing side="right" depth={1} step={right} />
        </div>
      </div>
    </div>
  );
}
