'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- This map application supports keyboard pan and zoom. */
/* oxlint-disable next/no-img-element -- The zoomable illustration uses its full source resolution; resizing to the initial viewport would blur zoomed detail. */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Scan, X, ArrowLeft } from 'lucide-react';
import { useCamera } from '../research/use-camera';
import { ART_WIDTH, ART_HEIGHT } from '../research/camera';
import './concept.css';

const views = {
  original: {
    label: 'Original',
    src: '/art/concept-original.webp',
    height: 1600 / 3,
  },
  restored: {
    label: 'Restored',
    src: '/art/concept-restored.webp',
    height: 1600 / 3,
  },
  detail: {
    label: 'Castle detail',
    src: '/art/concept-castle-detail.webp',
    height: (1600 * 2) / 3,
  },
};
type View = keyof typeof views;
const places = [
  {
    name: 'The Dark Forest',
    x: 8,
    y: 34,
    w: 19,
    h: 33,
    text: 'An untamed edge to the estate, with branching paths and dense pools of ink.',
  },
  {
    name: 'Research Tower',
    x: 40,
    y: 9,
    w: 7,
    h: 18,
    text: 'A circular home for research interests and investigations, connected to the Great Hall.',
  },
  {
    name: 'The Great Hall',
    x: 45,
    y: 20,
    w: 11,
    h: 28,
    text: 'The heart of the castle: a place to introduce Sriraam and find the surrounding rooms.',
  },
  {
    name: 'The Library',
    x: 62,
    y: 13,
    w: 10,
    h: 24,
    text: 'A curved wing for writing and reading, with smaller chambers that can grow as the collection grows.',
  },
  {
    name: 'The Workshop',
    x: 62,
    y: 52,
    w: 6,
    h: 18,
    text: 'A working wing for projects and experiments, with room to extend around its courtyard.',
  },
  {
    name: 'The Common Room',
    x: 53,
    y: 65,
    w: 7,
    h: 15,
    text: 'A quieter room for personal interests, stories, and the things between projects.',
  },
  {
    name: 'The Owlery',
    x: 70,
    y: 47,
    w: 5,
    h: 11,
    text: 'A small pair of turrets for finding Sriraam elsewhere and getting in touch.',
  },
  {
    name: 'The Garden',
    x: 80,
    y: 49,
    w: 14,
    h: 27,
    text: 'An open garden of paths, varied planting beds, and quieter places beyond the castle.',
  },
];

export default function ConceptExperience() {
  const viewport = useRef<HTMLDivElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const camera = useCamera(viewport, artwork);
  const [view, setView] = useState<View>('original');
  const [selected, setSelected] = useState<(typeof places)[number] | null>(
    null,
  );
  const image = views[view];
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const changeView = (next: View) => {
    setView(next);
    setSelected(null);
    camera.fit();
  };
  return (
    <main className="concept-experience">
      <header className="concept-header">
        <Link
          href="/"
          className="concept-back"
          aria-label="Back to drawn castle"
        >
          <ArrowLeft size={18} />
          <span>Drawn castle</span>
        </Link>
        <div className="concept-title">
          The illustrated estate<span>Concept version</span>
        </div>
        <a
          className="concept-download"
          href={image.src.replace('.webp', '.png')}
          download
        >
          Save image
        </a>
      </header>
      <nav className="concept-tabs" aria-label="Compare concept images">
        {(Object.keys(views) as View[]).map((key) => (
          <button
            key={key}
            aria-pressed={view === key}
            onClick={() => changeView(key)}
          >
            {views[key].label}
          </button>
        ))}
      </nav>
      <div
        className="concept-viewport"
        ref={viewport}
        role="application"
        tabIndex={0}
        aria-label="Illustrated estate. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan, zero fits. Tap a named region to explore."
      >
        <div
          className="concept-layer"
          ref={artwork}
          style={{ width: ART_WIDTH, height: ART_HEIGHT }}
        >
          <div
            className="concept-sheet"
            style={{
              top: (ART_HEIGHT - image.height) / 2,
              width: ART_WIDTH,
              height: image.height,
            }}
          >
            <img
              src={image.src}
              width={1600}
              height={image.height}
              alt={
                view === 'detail'
                  ? 'Detailed illustrated castle with Research Tower, Great Hall, Library, Workshop, Common Room, and Owlery.'
                  : 'Wide parchment estate: dark forest to the left, an angled castle with circular towers in the middle, garden to the right, and a river along the bottom.'
              }
              draggable={false}
            />
            {view !== 'detail' &&
              places.map((place) => (
                <button
                  key={place.name}
                  className="concept-region"
                  aria-label={`Explore ${place.name}`}
                  aria-pressed={selected?.name === place.name}
                  style={{
                    left: `${place.x}%`,
                    top: `${place.y}%`,
                    width: `${place.w}%`,
                    height: `${place.h}%`,
                  }}
                  onClick={() => {
                    setSelected(place);
                    camera.focus(
                      {
                        x: (place.x + place.w / 2) * 16,
                        y:
                          (ART_HEIGHT - image.height) / 2 +
                          ((place.y + place.h / 2) * image.height) / 100,
                      },
                      Math.max(place.w * 16, 260),
                    );
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      {selected && (
        <aside className="concept-note" aria-label={selected.name}>
          <button
            className="concept-close"
            aria-label="Close region"
            onClick={() => setSelected(null)}
          >
            <X size={20} />
          </button>
          <span>A place on the map</span>
          <h1>{selected.name}</h1>
          <p>{selected.text}</p>
        </aside>
      )}
      <footer className="concept-footer">
        <p>
          {view === 'original'
            ? 'The original illustration · 2172 × 724'
            : view === 'restored'
              ? 'AI-restored ink · 2172 × 724'
              : 'AI-enlarged castle study · 1536 × 1024'}
          <span>
            {view === 'detail'
              ? 'Fine details are reinterpreted; compare with Original.'
              : 'Drag to wander · pinch to zoom'}
          </span>
        </p>
        <nav aria-label="Concept zoom">
          <button aria-label="Zoom out" onClick={() => camera.zoom(1 / 1.4)}>
            <Minus size={19} />
          </button>
          <button
            aria-label="Fit concept"
            onClick={() => {
              setSelected(null);
              camera.fit();
            }}
          >
            <Scan size={18} />
            <span>Fit</span>
          </button>
          <button aria-label="Zoom in" onClick={() => camera.zoom(1.4)}>
            <Plus size={19} />
          </button>
        </nav>
      </footer>
    </main>
  );
}
