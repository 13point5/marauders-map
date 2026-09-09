'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The map application accepts keyboard panning and zoom. */
import { useRef, useState, type ReactNode } from 'react';
import { Minus, Plus, Scan, X } from 'lucide-react';
import { useCamera } from './use-camera';
import './research.css';
export default function MapExperience({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null),
    artwork = useRef<HTMLDivElement>(null);
  const camera = useCamera(viewport, artwork);
  const [open, setOpen] = useState(false);
  return (
    <main className="tower-experience">
      <header className="tower-header">
        <span className="site-name">Sriraam’s Map</span>
        <span className="chapter">I · The Research Tower</span>
      </header>
      <div
        className="tower-viewport"
        ref={viewport}
        role="application"
        tabIndex={0}
        aria-label="Research Tower map. Drag to pan; pinch or Control-scroll to zoom. Arrow keys pan. Zero fits the drawing."
      >
        <div className="tower-layer" ref={artwork}>
          {children}
          <button
            className="tower-hotspot"
            onClick={() => setOpen(true)}
            aria-label="Read about the Research Tower"
          />
        </div>
      </div>
      {open && (
        <aside className="research-note" aria-label="Research Tower">
          <button
            className="close-note"
            onClick={() => setOpen(false)}
            aria-label="Close research note"
          >
            <X size={20} />
          </button>
          <span>Questions worth following</span>
          <h1>The Research Tower</h1>
          <p>
            Sample efficiency, continual learning, human simulation, and the
            ways models learn to reason.
          </p>
        </aside>
      )}
      <footer className="tower-footer">
        <p>Drag to wander · pinch to look closer</p>
        <nav aria-label="Map zoom">
          <button onClick={() => camera.zoom(1 / 1.4)} aria-label="Zoom out">
            <Minus size={19} />
          </button>
          <button
            className="fit-button"
            onClick={camera.fit}
            aria-label="Fit tower"
          >
            <Scan size={17} />
            <span>Fit</span>
          </button>
          <button onClick={() => camera.zoom(1.4)} aria-label="Zoom in">
            <Plus size={19} />
          </button>
        </nav>
      </footer>
    </main>
  );
}
