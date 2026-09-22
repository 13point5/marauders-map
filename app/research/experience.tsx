'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The map application accepts keyboard panning and zoom. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Minus, Plus, Scan, X, ArrowUpRight } from 'lucide-react';
import { useCamera } from './use-camera';
import { ART_WIDTH, ART_HEIGHT } from './camera';
import {
  rooms,
  mapPoint,
  PLAN_ANGLE,
  PLAN_ORIGIN,
  type Room,
} from '../castle/plan';
import './research.css';
export default function MapExperience({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null),
    artwork = useRef<HTMLDivElement>(null);
  const camera = useCamera(viewport, artwork);
  const [selected, setSelected] = useState<Room | null>(null);
  const openRoom = (room: Room) => {
    setSelected(room);
    camera.focus(mapPoint(room.center[0], room.center[1]), room.span);
  };
  const closeRoom = () => {
    setSelected(null);
  };
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, []);
  return (
    <main className="tower-experience">
      <header className="tower-header">
        <div>
          <span className="site-name">Sriraam’s Map</span>
          <span className="chapter">
            <a href="/concept">Compare illustrated concept ↗</a>
          </span>
        </div>
        <label className="room-picker">
          <span className="sr-only">Go to a room</span>
          <select
            aria-label="Go to a room"
            value={selected?.id ?? ''}
            onChange={(e) => {
              const room = rooms.find((r) => r.id === e.target.value);
              if (room) openRoom(room);
              else {
                setSelected(null);
                camera.fit();
              }
            }}
          >
            <option value="">Explore the castle</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div
        className="tower-viewport"
        ref={viewport}
        role="application"
        tabIndex={0}
        aria-label="Castle map. Drag to pan. Pinch or Control-scroll to zoom. Arrow keys pan; zero fits. Tap a room to explore."
      >
        <div
          className="tower-layer"
          ref={artwork}
          style={{ width: ART_WIDTH, height: ART_HEIGHT }}
        >
          {children}
          <div
            className="room-regions"
            style={{
              transform: `rotate(${PLAN_ANGLE}deg)`,
              transformOrigin: `${PLAN_ORIGIN.x}px ${PLAN_ORIGIN.y}px`,
            }}
          >
            {rooms.map((room) => (
              <button
                key={room.id}
                className="room-hotspot"
                aria-label={`Explore ${room.name}`}
                aria-pressed={selected?.id === room.id}
                style={{
                  left: room.x,
                  top: room.y,
                  width: room.w,
                  height: room.h,
                  clipPath: room.shape,
                }}
                onClick={() => openRoom(room)}
              />
            ))}
          </div>
        </div>
      </div>
      {selected && (
        <aside className="research-note" aria-label={selected.name}>
          <button
            className="close-note"
            onClick={closeRoom}
            aria-label="Close room"
          >
            <X size={20} />
          </button>
          <span>{selected.kind}</span>
          <h1>{selected.name}</h1>
          <p>{selected.body}</p>
          <p className="note-detail">{selected.detail}</p>
          <a href={selected.link} target="_blank" rel="noreferrer">
            {selected.linkLabel}
            <ArrowUpRight size={16} />
          </a>
        </aside>
      )}
      <footer className="tower-footer">
        <p>Drag to wander · tap a room</p>
        <nav aria-label="Map zoom">
          <button onClick={() => camera.zoom(1 / 1.4)} aria-label="Zoom out">
            <Minus size={19} />
          </button>
          <button
            className="fit-button"
            onClick={() => {
              setSelected(null);
              camera.fit();
            }}
            aria-label="Fit castle"
          >
            <Scan size={17} />
            <span>Whole map</span>
          </button>
          <button onClick={() => camera.zoom(1.4)} aria-label="Zoom in">
            <Plus size={19} />
          </button>
        </nav>
      </footer>
    </main>
  );
}
