/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Named inline vector drawing; clickable HTML room regions are supplied by the map interface. */
import { PLAN_ANGLE } from './plan';

function Wall({ d }: { d: string }) {
  return (
    <g className="masonry">
      <path d={d} className="wall-edge" />
      <path d={d} className="wall-core" />
      <path d={d} className="wall-hatch" />
    </g>
  );
}
function Steps({
  x,
  y,
  w,
  h,
  count = 12,
  turn = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  count?: number;
  turn?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`} className="steps">
      <path d={`M0 0V${h}M${w} 0V${h}`} />
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M0 ${(((i + 1) * h) / (count + 1)).toFixed(2)}H${w}`}
        />
      ))}
    </g>
  );
}
function Label({
  x,
  y,
  title,
  small = false,
  latin,
}: {
  x: number;
  y: number;
  title: string;
  small?: boolean;
  latin?: string;
}) {
  return (
    <g
      transform={`rotate(${-PLAN_ANGLE} ${x} ${y})`}
      textAnchor="middle"
      className="room-label"
    >
      {latin && (
        <text x={x} y={y - 24} className="latin-label">
          {latin}
        </text>
      )}
      <text x={x} y={y + 4} fontSize={small ? 17 : 29}>
        {title}
      </text>
    </g>
  );
}
const point = (r: number, a: number) => [
  +(284 + r * Math.cos((a * Math.PI) / 180)).toFixed(2),
  +(234 + r * Math.sin((a * Math.PI) / 180)).toFixed(2),
];
const towerStairs = [
  [-151, -119, 10],
  [-40, -12, 8],
  [87, 116, 9],
];

export function CastleDrawing() {
  return (
    <svg
      className="castle-drawing"
      viewBox="0 0 1200 960"
      role="img"
      aria-label="A connected castle plan with a Great Hall, Research Tower, Study, Field Notes room, Workshop, and Entrance Court."
    >
      <defs>
        <pattern
          id="stone-hatching"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(26)"
        >
          <path
            d="M0 0V8"
            stroke="currentColor"
            strokeWidth=".7"
            opacity=".65"
          />
        </pattern>
        <pattern
          id="court-paving"
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path
            d="M0 0H26V26"
            fill="none"
            stroke="currentColor"
            strokeWidth=".45"
            opacity=".13"
          />
        </pattern>
      </defs>
      <g className="survey-lines">
        <path d="M145 645L1037 162M164 698L996 914M568 116L920 834" />
        <circle cx="1037" cy="162" r="4" />
        <path d="M1028 162h18m-9-9v18" />
      </g>
      <g transform={`rotate(${PLAN_ANGLE} 600 450)`}>
        {/* All building outlines end at authored door openings, not clipping masks. */}
        <g className="floor-wash">
          <path d="M465 245H800L845 290V497L800 545H465Z" />
          <path d="M300 367H416V492H280V388Z" />
          <path d="M282 516H416V628L390 651H282Z" />
          <path d="M879 325H993L1026 356V487H879Z" />
          <path
            d="M637 601H723L763 639V710L726 751H637L600 711V639Z"
            fill="url(#court-paving)"
          />
        </g>
        {/* Broad landings and three short flights; geometric tower walls. */}
        <Wall d="M385 264A105 105 0 1 0 364 302" />
        <path className="thin-rule" d="M378 262A98 98 0 1 0 360 296" />
        <path className="thin-rule" d="M354 257A74 74 0 1 0 337 286" />
        {towerStairs.flatMap(([a, b, n], j) =>
          Array.from({ length: n + 1 }, (_, i) => {
            const p = point(78, a + ((b - a) * i) / n),
              q = point(94, a + ((b - a) * i) / n);
            return (
              <path
                key={`${j}-${i}`}
                className="stair-stroke"
                d={`M${p.join(' ')}L${q.join(' ')}`}
              />
            );
          }),
        )}
        {[
          [-88, 21],
          [165, -8],
          [78, 13],
        ].map(([a, rot], i) => {
          const [x, y] = point(87, a);
          return (
            <text
              key={i}
              x={x}
              y={y}
              transform={`rotate(${a + 90 + rot} ${x} ${y})`}
              className="wall-glyph"
            >
              {['A', 'M', 'R'][i]}
            </text>
          );
        })}
        <Wall d="M385 264H437L465 264M364 302H437L465 302" />
        <path className="door-swing" d="M415 266v32q25 0 25-32" />
        <Label
          x={284}
          y={230}
          title="Research Tower"
          small
          latin="TVRRIS · I"
        />
        <text className="script-note" x="241" y="271">
          quaerere &amp; invenire
        </text>
        {/* Great Hall and its buttresses; unequal doorways connect actual rooms. */}
        <Wall d="M465 264V245H800L845 290V355M845 393V497L800 545H700M662 545H465V405M465 365V302" />
        <path
          className="thin-rule"
          d="M477 322V359M477 411V531H656M707 531H794L831 491V399M831 347V296L794 259H478V275"
        />
        {[502, 573, 744].map((x) => (
          <Wall key={x} d={`M${x} 247V230H${x + 12}V247`} />
        ))}
        {[337, 457].map((y) => (
          <Wall key={y} d={`M465 ${y}H450V${y + 12}H465`} />
        ))}
        {[322, 450].map((y) => (
          <Wall key={y} d={`M844 ${y}H858V${y + 12}H844`} />
        ))}
        {[510, 773].map((x) => (
          <Wall key={x} d={`M${x} 544V559H${x + 11}V544`} />
        ))}
        <g className="pillars">
          {[
            [505, 286],
            [582, 286],
            [730, 286],
            [790, 307],
            [505, 493],
            [581, 505],
            [746, 505],
            [799, 468],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="5.5" />
              <circle cx={x} cy={y} r="2" />
            </g>
          ))}
        </g>
        <path className="dais" d="M520 268V280H748V268M528 282v7h213v-7" />
        <Label
          x={648}
          y={386}
          title="The Great Hall"
          latin="AEDES · PRINCIPALIS"
        />
        <g transform={`rotate(${-PLAN_ANGLE} 648 420)`} textAnchor="middle">
          <text x="648" y="420" className="script-note">
            learning, work &amp; a little curiosity
          </text>
          <path className="fine-rule" d="M612 438h72" />
          <text x="648" y="460" className="room-number">
            II
          </text>
        </g>
        <path
          className="door-swing"
          d="M664 544v-34q32 0 32 34M466 367h34q0 34-34 34M845 357h-33q0 34 33 34"
        />
        {/* Western passage, with two different complete room footprints. */}
        <Wall d="M465 365H416V367H300L280 388V492H416M416 405H465" />
        <Wall d="M416 405V423M416 454V558M416 589V628L390 651H282V516H416" />
        <Wall d="M453 408V674H600M416 649V715H600" />
        <path
          className="thin-rule"
          d="M291 484V395L305 378H405V418M290 527H405V553M290 527V640H386L405 623V594"
        />
        <path
          className="door-swing"
          d="M416 425h-27q0 27 27 27M416 560h-27q0 27 27 27"
        />
        <Label x={348} y={430} title="The Study" small />
        <Label x={348} y={580} title="Field Notes" small />
        <text className="script-note" x="313" y="459">
          mens et memoria
        </text>
        <text className="script-note" x="310" y="610">
          in marginibus
        </text>
        <Steps x={286} y={393} w={15} h={60} count={9} />
        <path
          className="furniture"
          d="M323 387h61v8h-61zm-28 148h14v47h-14m5-44v38m-5-22h14m-14-9h14m-14 27h14"
        />
        <g transform="translate(435 589) rotate(-90)">
          <text className="corridor-label" textAnchor="middle">
            AMBVLATORIVM
          </text>
        </g>
        {/* Workshop begins as one chamber, with a projecting bench alcove. */}
        <Wall d="M845 355H879V325H993L1026 356V487H879V393H845" />
        <path className="thin-rule" d="M889 350V336H986L1015 360V476H889V401" />
        <Wall d="M1026 384H1041V420H1026" />
        <path
          className="furniture"
          d="M927 341h62v14h-62zM941 341v14m17-14v14m17-14v14"
        />
        <circle className="thin-rule" cx="993" cy="451" r="10" />
        <path className="fine-rule" d="M990 444l7 13m-10-8h13" />
        <Label x={945} y={393} title="The Workshop" small />
        <text className="script-note" x="914" y="430">
          facere &amp; discere
        </text>
        {/* Entrance court links to both the hall and western passage. */}
        <Wall d="M662 545V601H637L600 639V674M600 715L637 751H662M702 751H726L763 710V639L723 601H700V545" />
        <path
          className="thin-rule"
          d="M649 612h-8l-30 31v25M614 715l27 25h17M708 740h14l30-34v-62l-32-32h-10"
        />
        <Steps x={665} y={756} w={34} h={33} count={5} />
        <path
          className="approach"
          d="M649 795Q642 817 624 834M715 795Q712 819 700 839"
        />
        <Label x={681} y={679} title="Entrance Court" small />
        <g className="pillars">
          {[
            [623, 642],
            [740, 642],
            [623, 711],
            [740, 711],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
          ))}
        </g>
        {/* Windows are openings framed by small paired pen strokes. */}
        <g className="windows">
          {[320, 354, 386].map((x) => (
            <path key={x} d={`M${x} 365v7m-3-6v5m6-5v5`} />
          ))}
          {[534, 612, 758].map((x) => (
            <path key={x} d={`M${x} 241v8m-4-8v8m8-8v8`} />
          ))}
          <path d="M1019 446h11m-11 5h11M277 588h11m-11 5h11" />
        </g>
        <text
          className="script-note marginal"
          x="263"
          y="735"
          transform="rotate(-90 263 735)"
        >
          per ambages ad lucem
        </text>
        <text className="script-note marginal" x="759" y="208">
          a little room for what comes next
        </text>
      </g>
      <g className="compass" transform="translate(1010 160)">
        <path d="M0-27V27M-27 0H27M0-20l4 20-4 20-4-20Z" />
        <circle r="10" />
        <text y="-39" textAnchor="middle">
          N
        </text>
      </g>
      <g className="map-colophon" textAnchor="middle">
        <text x="600" y="888">
          THE CASTLE &amp; ITS CHAMBERS
        </text>
        <text x="600" y="912" className="script-note">
          Sriraam’s map · a work in progress
        </text>
      </g>
    </svg>
  );
}
