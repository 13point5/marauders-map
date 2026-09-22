// Browser regression check. Start the local app and open it with agent-browser,
// then pass the URL from agent-browser get cdp-url. No extra dependencies.
import assert from 'node:assert/strict';
const ws = new WebSocket(process.argv[2]);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0,
  sessionId;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p.reject(m.error) : p.resolve(m.result);
  }
});
function send(method, params = {}, session = sessionId) {
  return new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, { resolve, reject });
    ws.send(
      JSON.stringify({
        id: n,
        method,
        params,
        ...(session ? { sessionId: session } : {}),
      }),
    );
  });
}
if (!process.argv[2]) throw Error('Pass the browser CDP websocket URL.');
const { targetInfos } = await send('Target.getTargets');
const page = targetInfos.find(
  (t) => t.type === 'page' && t.url.startsWith('http://localhost:3000'),
);
({ sessionId } = await send('Target.attachToTarget', {
  targetId: page.targetId,
  flatten: true,
}));
const ev = async (expression) => {
  const r = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails) throw Error(r.exceptionDetails.text);
  return r.result.value;
};
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
const settle = () =>
  ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
const transform = () =>
  ev('document.querySelector(".tower-layer").style.transform');
const click = async (name) => {
  await ev(`document.querySelector('[aria-label="${name}"]').click()`);
  await settle();
};
await click('Fit castle');
for (const room of [
  'The Great Hall',
  'Research Tower',
  'The Library',
  'The Common Room',
  'The Owlery',
  'The Workshop',
  'Entrance Court',
]) {
  await click('Explore ' + room);
  assert.equal(
    await ev('document.querySelector("aside h1").textContent'),
    room,
  );
  assert.equal(
    await ev('document.documentElement.scrollWidth > innerWidth'),
    false,
  );
  await click('Fit castle');
}
console.log(
  'All seven room links open the matching note. No phone page overflow.',
);
await send('Emulation.setTouchEmulationEnabled', {
  enabled: true,
  maxTouchPoints: 2,
});
const touch = async (type, points) => {
  await send('Input.dispatchTouchEvent', {
    type,
    touchPoints: points.map(([x, y, id]) => ({
      x,
      y,
      id,
      radiusX: 2,
      radiusY: 2,
      force: 1,
    })),
  });
  await settle();
};
let before = await transform();
await touch('touchStart', [
  [150, 290, 1],
  [240, 290, 2],
]);
await touch('touchMove', [
  [110, 290, 1],
  [280, 290, 2],
]);
await touch('touchEnd', []);
let after = await transform();
assert.notEqual(before, after);
console.log('Two-finger touch pinch changes scale:', before, '=>', after);
await click('Fit castle');
const box = await ev(
  `(()=>{const b=document.querySelector('[aria-label="Explore The Great Hall"]').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`,
);
before = await transform();
await touch('touchStart', [[box.x, box.y, 1]]);
for (let i = 1; i <= 12; i++)
  await touch('touchMove', [[box.x + i * 7, box.y + i * 4, 1]]);
await touch('touchEnd', []);
const delta = await ev(
  'document.querySelector(".tower-layer").style.transform',
);
const offsets = (value) =>
  [...value.matchAll(/-?[\d.]+/g)].map((m) => Number(m[0]));
const [bx, by] = offsets(before),
  [ax, ay] = offsets(delta);
assert.ok(
  Math.abs(ax - bx - 84) < 0.1,
  `Drag must follow all 84 pixels, got ${ax - bx}`,
);
assert.ok(
  Math.abs(ay - by - 48) < 0.1,
  `Drag must follow all 48 pixels, got ${ay - by}`,
);
assert.equal(await ev('!!document.querySelector("aside")'), false);
console.log('Touch drag beginning on a room pans without opening it.');
await click('Fit castle');
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await click('Zoom in');
before = await transform();
await ev('document.querySelector(".tower-viewport").focus()');
await send('Input.dispatchKeyEvent', {
  type: 'keyDown',
  key: 'ArrowLeft',
  code: 'ArrowLeft',
  windowsVirtualKeyCode: 37,
});
await settle();
assert.notEqual(before, await transform());
console.log('Zoom controls and keyboard panning work.');
await click('Fit castle');
// Empty paper also begins touch capture on a descendant of the viewport.
await send('Emulation.setTouchEmulationEnabled', {
  enabled: true,
  maxTouchPoints: 2,
});
before = await transform();
await touch('touchStart', [[100, 160, 1]]);
for (let i = 1; i <= 10; i++)
  await touch('touchMove', [[100 + i * 6, 160 + i * 5, 1]]);
await touch('touchEnd', []);
const [ex, ey] = offsets(before),
  [fx, fy] = offsets(await transform());
assert.ok(Math.abs(fx - ex - 60) < 0.1 && Math.abs(fy - ey - 50) < 0.1);
console.log(
  'Continuous touch drag on empty paper follows the complete gesture.',
);
await click('Fit castle');
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
before = await transform();
await send('Input.dispatchMouseEvent', {
  type: 'mousePressed',
  x: 150,
  y: 300,
  button: 'left',
  clickCount: 1,
});
for (let i = 1; i <= 10; i++)
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 150 + i * 6,
    y: 300 + i * 4,
    buttons: 1,
  });
await send('Input.dispatchMouseEvent', {
  type: 'mouseReleased',
  x: 210,
  y: 340,
  button: 'left',
  clickCount: 1,
});
await settle();
const [mx, my] = offsets(before),
  [nx, ny] = offsets(await transform());
assert.ok(Math.abs(nx - mx - 60) < 0.1 && Math.abs(ny - my - 40) < 0.1);
console.log('Mouse drag follows the complete gesture.');
await click('Fit castle');
ws.close();
