'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The map application supports keyboard pan and zoom. */
/* oxlint-disable next/no-img-element -- Use the illustration's full resolution rather than an image optimized for the small initial viewport. */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Scan, X, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useCamera } from '../research/use-camera';
import { ART_WIDTH, ART_HEIGHT } from '../research/camera';
import { rooms } from '../castle/plan';
import './concept.css';

const views = {
  clean: { label: 'Clean ink', src: '/art/concept-castle-clean.webp' },
  original: {
    label: 'Earlier drawing',
    src: '/art/concept-castle-detail.webp',
  },
};
type View = keyof typeof views;
const IMAGE_HEIGHT = (ART_WIDTH * 2) / 3;
// Percentages in the dedicated castle illustration, not the earlier estate.
const places = [
  { id: 'research', x: 12, y: 5, w: 18, h: 23 },
  { id: 'hall', x: 28, y: 27, w: 20, h: 22 },
  { id: 'library', x: 57, y: 11, w: 29, h: 24 },
  { id: 'workshop', x: 61, y: 59, w: 15, h: 19 },
  { id: 'common', x: 41, y: 72, w: 14, h: 14 },
  { id: 'owlery', x: 80, y: 48, w: 13, h: 18 },
].map((place) => ({
  ...place,
  room: rooms.find((room) => room.id === place.id)!,
}));
type Place = (typeof places)[number];

export default function ConceptExperience() {
  const viewport = useRef<HTMLDivElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const camera = useCamera(viewport, artwork);
  const [view, setView] = useState<View>('clean');
  const [selected, setSelected] = useState<Place | null>(null);
  const image = views[view];
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const openRoom = (place: Place) => {
    setSelected(place);
    camera.focus(
      {
        x: ((place.x + place.w / 2) * ART_WIDTH) / 100,
        y:
          (ART_HEIGHT - IMAGE_HEIGHT) / 2 +
          ((place.y + place.h / 2) * IMAGE_HEIGHT) / 100,
      },
      Math.max((place.w * ART_WIDTH) / 100, 280),
    );
  };
  return (
    <main className="concept-experience">
      <header className="concept-header">
        <Link
          href="/"
          className="concept-back"
          aria-label="Back to quill-letter castle"
        >
          <ArrowLeft size={18} />
          <span>Quill version</span>
        </Link>
        <div className="concept-title">
          Sriraam’s Castle<span>Drag · pinch · explore</span>
        </div>
        <a
          className="concept-download"
          href={image.src.replace('.webp', '.png')}
          download
        >
          Save drawing
        </a>
      </header>
      <nav className="concept-tabs" aria-label="Compare castle drawings">
        {(Object.keys(views) as View[]).map((key) => (
          <button
            key={key}
            aria-pressed={view === key}
            onClick={() => setView(key)}
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
        aria-label="Castle. Drag to pan, pinch or Control-scroll to zoom. Arrow keys pan, zero fits. Tap a room to explore."
      >
        <div
          className="concept-layer"
          ref={artwork}
          style={{ width: ART_WIDTH, height: ART_HEIGHT }}
        >
          <div
            className="concept-sheet"
            style={{
              top: (ART_HEIGHT - IMAGE_HEIGHT) / 2,
              width: ART_WIDTH,
              height: IMAGE_HEIGHT,
            }}
          >
            <img
              src={image.src}
              width={1536}
              height={1024}
              alt="The complete castle: Research Tower northwest, Great Hall in the middle, Library northeast, Owlery east, Workshop southeast and Common Room south."
              draggable={false}
              fetchPriority="high"
            />
            {places.map((place) => (
              <button
                key={place.id}
                className="concept-region"
                aria-label={`Explore ${place.room.name}`}
                aria-pressed={selected?.id === place.id}
                style={{
                  left: `${place.x}%`,
                  top: `${place.y}%`,
                  width: `${place.w}%`,
                  height: `${place.h}%`,
                }}
                onClick={() => openRoom(place)}
              />
            ))}
          </div>
        </div>
      </div>
      {selected && (
        <aside className="concept-note" aria-label={selected.room.name}>
          <button
            className="concept-close"
            aria-label="Close room"
            onClick={() => setSelected(null)}
          >
            <X size={20} />
          </button>
          <span>{selected.room.kind}</span>
          <h1>{selected.room.name}</h1>
          <p>{selected.room.body}</p>
          <a href={selected.room.link} target="_blank" rel="noreferrer">
            {selected.room.linkLabel}
            <ArrowUpRight size={16} />
          </a>
        </aside>
      )}
      <footer className="concept-footer">
        <label className="concept-room-picker">
          <span className="concept-sr-only">Go to a castle room</span>
          <select
            value={selected?.id ?? ''}
            onChange={(event) => {
              const place = places.find(
                (place) => place.id === event.target.value,
              );
              if (place) openRoom(place);
              else {
                setSelected(null);
                camera.fit();
              }
            }}
          >
            <option value="">Explore a room</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.room.name}
              </option>
            ))}
          </select>
        </label>
        <nav aria-label="Castle zoom">
          <button aria-label="Zoom out" onClick={() => camera.zoom(1 / 1.4)}>
            <Minus size={19} />
          </button>
          <button
            aria-label="Fit castle"
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
