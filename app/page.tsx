'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The labeled map application intentionally accepts focus for arrow-key panning and +/- zoom; standard controls are outside it. */
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Scan,
  RotateCcw,
} from 'lucide-react';
import { useMapNavigation } from './use-map-navigation';
import { FoldedMap } from './folded-map';
import { foldBounds, FOLD_STEPS, MAP_RATIO } from './fold-geometry';
import './map-study.css';

export default function MapExperience() {
  const [fold, setFold] = useState({ left: 0, right: 0 });
  const [busy, setBusy] = useState(false),
    [auto, setAuto] = useState(false),
    [explore, setExplore] = useState(false);
  const [zoom, setZoom] = useState(1),
    [mapWidth, setMapWidth] = useState(600);
  const [size, setSize] = useState({ width: 390, height: 600 });
  const surface = useRef<HTMLDivElement>(null),
    viewport = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closed = fold.left === 0 && fold.right === 0;
  const finished = fold.left === FOLD_STEPS && fold.right === FOLD_STEPS;
  const { zoomTo } = useMapNavigation(
    viewport,
    explore,
    zoom,
    setZoom,
    mapWidth,
    mapWidth / MAP_RATIO,
  );
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const measure = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
      setMapWidth(
        Math.min(el.clientWidth * 0.96, el.clientHeight * MAP_RATIO * 0.92),
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!busy) return;
    timer.current = setTimeout(() => {
      setBusy(false);
      if (finished) {
        setAuto(false);
        setZoom(size.width < 700 ? 3 : 1);
        setExplore(true);
      }
    }, 1050);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [busy, finished, size.width]);
  useEffect(() => {
    if (auto && !busy && !finished) {
      const frame = requestAnimationFrame(() => {
        setFold((f) => ({
          left: Math.min(3, f.left + 1),
          right: Math.min(3, f.right + 1),
        }));
        setBusy(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [auto, busy, finished]);
  useEffect(() => {
    if (!explore) return;
    const el = viewport.current;
    if (el) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }
  }, [explore, mapWidth]);
  const unfold = (side?: 'left' | 'right') => {
    if (busy) return;
    setFold((f) => ({
      left: Math.min(3, f.left + (!side || side === 'left' ? 1 : 0)),
      right: Math.min(3, f.right + (!side || side === 'right' ? 1 : 0)),
    }));
    setBusy(true);
  };
  const refold = () => {
    setAuto(false);
    setExplore(false);
    setZoom(1);
    setFold({ left: 3, right: 3 });
    setBusy(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setFold({ left: 0, right: 0 });
        setBusy(true);
      }),
    );
  };
  const bounds = foldBounds(fold.left, fold.right);
  const leaf = Math.min(size.height * 0.88, size.width * 1.85, 700) / 4;
  const scale = Math.min(1, (size.width * 0.84) / (bounds.width * leaf));
  return (
    <main className={`map-experience ${explore ? 'is-exploring' : ''}`}>
      <header className="map-header">
        <button
          className="map-title"
          onClick={() => {
            if (!closed) refold();
          }}
          aria-label="Sriraam’s Map, return to closed cover"
        >
          Sriraam’s Map
        </button>
        <span>
          {explore ? 'The castle & its grounds' : 'An invitation to wander'}
        </span>
      </header>
      <div className="map-surface" ref={surface}>
        {!explore && (
          <div className="fold-stage" aria-label="Folded parchment map">
            <FoldedMap
              left={fold.left}
              right={fold.right}
              width={leaf}
              scale={scale}
              center={bounds.center}
            />
            {closed && !busy && (
              <button
                className="cover-touch"
                onClick={() => unfold()}
                aria-label="Open the map cover"
                style={{ width: leaf * 2, height: leaf * 4 }}
              />
            )}
          </div>
        )}
        <div
          ref={viewport}
          hidden={!explore}
          className="map-viewport"
          role="application"
          tabIndex={explore ? 0 : -1}
          aria-label="Estate map. Drag to pan. Pinch, double-tap, or Control-scroll to zoom. Arrow keys pan; zero fits."
        >
          <div
            className="map-paper"
            style={{ width: mapWidth * zoom, aspectRatio: MAP_RATIO }}
          >
            <Image
              unoptimized
              width={2172}
              height={724}
              className="estate-art"
              src="/art/estate.webp"
              alt="Sriraam’s illustrated estate: letter-built castle wings, the Great Hall, Research Tower, Library, Workshop, Owlery and Common Room, with a word forest to the west and a walled garden to the east."
              draggable={false}
            />
          </div>
        </div>
      </div>
      <footer className="map-footer">
        <p className="map-hint" aria-live="polite">
          {explore
            ? 'Drag to wander · pinch to look closer'
            : closed
              ? 'A little mischief, a little curiosity.'
              : finished
                ? 'The whole estate awaits.'
                : 'Open either edge. There’s more beyond the crease.'}
        </p>
        {explore ? (
          <div className="explore-controls">
            <button className="text-control" onClick={refold}>
              <RotateCcw size={16} />
              Fold again
            </button>
            <div className="zoom-controls">
              <button
                onClick={() => zoomTo(zoom - 0.5)}
                disabled={zoom <= 1}
                aria-label="Zoom out"
              >
                <Minus size={19} />
              </button>
              <button onClick={() => zoomTo(1)} aria-label="Show the whole map">
                <Scan size={18} />
                <span>
                  {zoom === 1 ? 'Whole map' : `${Math.round(zoom * 100)}%`}
                </span>
              </button>
              <button
                onClick={() => zoomTo(zoom + 0.5)}
                disabled={zoom >= 5}
                aria-label="Zoom in"
              >
                <Plus size={19} />
              </button>
            </div>
          </div>
        ) : closed ? (
          <div className="closed-controls">
            <button
              className="spell-button"
              disabled={busy}
              onClick={() => unfold()}
            >
              Mischief Managed <ArrowRight size={17} />
            </button>
            <button
              className="subtle-control"
              disabled={busy}
              onClick={() => setAuto(true)}
            >
              Open fully
            </button>
          </div>
        ) : (
          <div className="unfold-controls">
            <div className="fold-actions">
              <button
                className="edge-control"
                onClick={() => unfold('left')}
                disabled={busy || fold.left === 3}
              >
                <ArrowLeft size={18} />
                <span>
                  Unfold left<small>{fold.left} / 3</small>
                </span>
              </button>
              <button
                className="edge-control"
                onClick={() => unfold('right')}
                disabled={busy || fold.right === 3}
              >
                <span>
                  Unfold right<small>{fold.right} / 3</small>
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
            <button
              className="subtle-control"
              onClick={() => setAuto(true)}
              disabled={auto || busy || finished}
            >
              {auto ? 'Unfolding…' : 'Open fully'}
            </button>
          </div>
        )}
      </footer>
    </main>
  );
}
