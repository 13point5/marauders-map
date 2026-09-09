export type Camera = { x: number; y: number; scale: number };
export type Point = { x: number; y: number };
export const ART_WIDTH = 730,
  ART_HEIGHT = 780;
export function fitCamera(width: number, height: number): Camera {
  const scale = Math.min(width / ART_WIDTH, height / ART_HEIGHT) * 0.96;
  return {
    x: (width - ART_WIDTH * scale) / 2,
    y: (height - ART_HEIGHT * scale) / 2,
    scale,
  };
}
export function zoomCamera(
  camera: Camera,
  scale: number,
  anchor: Point,
): Camera {
  const ratio = scale / camera.scale;
  return {
    scale,
    x: anchor.x - (anchor.x - camera.x) * ratio,
    y: anchor.y - (anchor.y - camera.y) * ratio,
  };
}
export function boundCamera(
  camera: Camera,
  width: number,
  height: number,
): Camera {
  const margin = 48;
  return {
    ...camera,
    x: Math.min(
      width - margin,
      Math.max(margin - ART_WIDTH * camera.scale, camera.x),
    ),
    y: Math.min(
      height - margin,
      Math.max(margin - ART_HEIGHT * camera.scale, camera.y),
    ),
  };
}
