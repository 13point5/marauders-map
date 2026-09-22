/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Named inline vector architecture. The map interface supplies accessible HTML room buttons. */
import { PLAN_ANGLE, PLAN_ORIGIN } from './plan';
import { TowerDrawing } from '../research/tower';

function Label({
  x,
  y,
  title,
  note,
  size = 23,
}: {
  x: number;
  y: number;
  title: string;
  note?: string;
  size?: number;
}) {
  return (
    <g textAnchor="middle" className="castle-label">
      <text x={x} y={y} fontSize={size}>
        {title}
      </text>
      {note && (
        <text x={x} y={y + 25} className="script-note">
          {note}
        </text>
      )}
    </g>
  );
}

export function CastleDrawing() {
  return (
    <svg
      className="castle-drawing"
      viewBox="0 0 1600 1200"
      role="img"
      aria-label="A connected quill-letter castle: Research Tower northwest, Great Hall at its heart, curved Library northeast, Common Room and Workshop below, and a small paired Owlery to the east."
    >
      <g transform={`rotate(${PLAN_ANGLE} ${PLAN_ORIGIN.x} ${PLAN_ORIGIN.y})`}>
        <g transform="translate(60 -5) scale(.67)">
          <TowerDrawing />
        </g>
        <image href="/art/castle-ink.svg" width="1600" height="1200" />
        <Label
          x={712}
          y={466}
          title="The Great Hall"
          note="learning, work & a little curiosity"
          size={28}
        />
        <Label
          x={1160}
          y={307}
          title="The Library"
          note="notes from the margins"
        />
        <Label x={1135} y={779} title="The Workshop" note="facere & discere" />
        <Label
          x={790}
          y={875}
          title="The Common Room"
          note="beyond the work"
          size={21}
        />
        <Label x={1329} y={623} title="The Owlery" size={16} />
        <Label
          x={489}
          y={900}
          title="Entrance Court"
          note="a question begins here"
          size={19}
        />
        <g className="map-marginalia">
          <text
            x="405"
            y="559"
            textAnchor="middle"
            fontStyle="italic"
            fontSize="12"
          >
            the study
          </text>
          <text
            x="384"
            y="671"
            textAnchor="middle"
            fontStyle="italic"
            fontSize="12"
          >
            quiet thoughts
          </text>
          <text x="579" y="683" fontSize="9" letterSpacing="1.5">
            AMBVLATORIVM
          </text>
          <text x="1083" y="675" fontSize="8">
            I
          </text>
          <text x="1226" y="882" fontSize="8">
            II
          </text>
          <text x="681" y="264" fontSize="12" fontStyle="italic">
            per ambages ad lucem
          </text>
        </g>
      </g>
      <g className="compass" transform="translate(1448 148)">
        <path d="M0-23V23M-23 0H23M0-18l4 18-4 18-4-18Z" />
        <circle r="10" />
        <text y="-35" textAnchor="middle">
          N
        </text>
      </g>
      <g className="map-colophon" textAnchor="middle">
        <text x="800" y="1122">
          THE CASTLE &amp; ITS CHAMBERS
        </text>
        <text x="800" y="1147" className="script-note">
          Sriraam’s map
        </text>
      </g>
    </svg>
  );
}
