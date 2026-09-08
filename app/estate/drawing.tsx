/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG place outlines need SVG groups with keyboard button semantics; HTML buttons cannot describe these irregular hit regions. */
import {
  arc,
  fittedLetters,
  length,
  path,
  rounded,
  places,
  type Point,
} from './geometry';

type WallProps = {
  id: string;
  points: readonly Point[];
  size?: number;
  script?: boolean;
  seed?: number;
  round?: boolean;
};
function Wall({
  id,
  points,
  size = 13,
  script = false,
  seed = 0,
  round = true,
}: WallProps) {
  const inkSize = size * 0.8;
  // Keep glyphs off sharp corners. Quill returns carry the continuous joint.
  const breaks = [0];
  if (round)
    for (let i = 1; i < points.length - 1; i++) {
      const a = points[i - 1],
        b = points[i],
        c = points[i + 1];
      const dot = (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]);
      const mag =
        Math.hypot(b[0] - a[0], b[1] - a[1]) *
        Math.hypot(c[0] - b[0], c[1] - b[1]);
      if (mag && dot / mag < 0.86) breaks.push(i);
    }
  breaks.push(points.length - 1);
  const runs = breaks
    .slice(1)
    .map((end, j) => points.slice(breaks[j], end + 1));
  return (
    <g className={script ? 'script-wall' : 'capital-wall'}>
      {runs.map((run, j) => {
        const distance = length(run),
          wallId = `wall-${id}-${j}`,
          inset = round ? Math.min(6, distance / 5) : 4;
        if (distance < inkSize * 2.5)
          return (
            <path key={j} d={path(rounded(run, 4))} className="quill-return" />
          );
        const letters = fittedLetters(
          distance - inset * 2 + 8,
          inkSize,
          script,
          seed + j,
        );
        return (
          <g key={j}>
            <path id={wallId} d={path(run)} fill="none" stroke="none" />
            <text
              fontSize={inkSize}
              textLength={(distance - inset * 2).toFixed(2)}
              lengthAdjust="spacing"
            >
              <textPath href={`#${wallId}`} startOffset={inset}>
                {letters}
              </textPath>
            </text>
            {!script && distance > 40 && (
              <text
                className="wall-underwriting"
                dy="7"
                fontSize="6.5"
                textLength={(distance - inset * 2).toFixed(2)}
                lengthAdjust="spacing"
              >
                <textPath href={`#${wallId}`} startOffset={inset}>
                  {fittedLetters(
                    distance - inset * 2 + 8,
                    6.5,
                    true,
                    seed + j + 1,
                  )}
                </textPath>
              </text>
            )}
            {round && (
              <path
                d={path(run)}
                className="quill-return"
                strokeDasharray={`${inset + 1} ${Math.max(0, distance - 2 * inset - 2)} ${inset + 1}`}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
function Rule({
  points,
  width = 1.3,
}: {
  points: readonly Point[];
  width?: number;
}) {
  return (
    <path
      d={path(rounded(points, 5))}
      className="quill-rule"
      strokeWidth={width}
    />
  );
}
function Stairs({
  cx,
  cy,
  inner,
  outer,
  start,
  end,
  count,
}: {
  cx: number;
  cy: number;
  inner: number;
  outer: number;
  start: number;
  end: number;
  count: number;
}) {
  return (
    <g className="stairs">
      {Array.from({ length: count }, (_, i) => {
        const a = ((start + ((end - start) * i) / (count - 1)) * Math.PI) / 180;
        return (
          <path
            key={i}
            d={path([
              [cx + inner * Math.cos(a), cy + inner * Math.sin(a)],
              [cx + outer * Math.cos(a), cy + outer * Math.sin(a)],
            ])}
          />
        );
      })}
    </g>
  );
}
function Label({
  x,
  y,
  name,
  subtitle,
  rotate = 0,
  small = false,
}: {
  x: number;
  y: number;
  name: string;
  subtitle?: string;
  rotate?: number;
  small?: boolean;
}) {
  return (
    <g
      className="room-label"
      transform={`translate(${x} ${y}) rotate(${rotate})`}
    >
      <text textAnchor="middle" fontSize={small ? 19 : 26}>
        {name}
      </text>
      {subtitle && (
        <text
          className="room-subtitle"
          textAnchor="middle"
          y="24"
          fontSize="12"
        >
          {subtitle}
        </text>
      )}
    </g>
  );
}
const forestShapes = [
  'M78 379L92 342L69 328L92 308L84 282L113 269L98 246L135 220L130 199L173 180L184 143L209 159L244 126L271 169L299 161L318 191L347 188L361 229L403 226L386 255L432 286L403 304L428 332L397 361L352 352L319 380L283 350L254 376L212 369L168 392L124 368Z',
  'M305 297L310 264L289 244L323 221L309 198L343 179L330 164L365 153L362 119L390 130L413 100L429 137L458 137L448 171L483 189L472 214L505 236L483 254L514 283L475 301L468 333L428 320L402 339L376 306Z',
  'M89 573L104 544L76 530L108 506L94 480L126 469L118 438L152 443L172 398L199 427L220 412L232 448L273 431L281 465L315 480L306 505L341 529L321 548L345 572L308 574L287 603L248 579L229 604L199 579L163 602L145 573Z',
];
const trunks = [
  [
    [224, 515],
    [224, 431],
    [241, 343],
    [239, 262],
    [219, 207],
  ],
  [
    [226, 399],
    [181, 350],
    [141, 301],
    [135, 249],
  ],
  [
    [241, 345],
    [294, 295],
    [326, 227],
    [329, 182],
  ],
  [
    [179, 347],
    [120, 327],
    [98, 297],
  ],
  [
    [287, 302],
    [357, 305],
    [395, 277],
  ],
  [
    [239, 266],
    [189, 241],
    [161, 204],
  ],
  [
    [438, 441],
    [420, 372],
    [429, 280],
    [410, 209],
    [396, 150],
  ],
  [
    [426, 292],
    [478, 241],
    [478, 186],
  ],
  [
    [418, 370],
    [377, 341],
    [345, 319],
  ],
  [
    [187, 674],
    [175, 601],
    [185, 540],
    [170, 476],
  ],
  [
    [182, 555],
    [135, 523],
    [121, 480],
  ],
  [
    [181, 598],
    [238, 550],
    [276, 490],
  ],
] as const;
function Forest() {
  return (
    <g className="forest">
      <defs>
        <clipPath id="forest-ink-mask">
          {forestShapes.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
        {forestShapes.map((d, i) => (
          <clipPath key={i} id={`canopy-${i}`}>
            <path d={d} />
          </clipPath>
        ))}
      </defs>
      {forestShapes.map((d, i) => (
        <g key={i}>
          <path
            d={d}
            fill={i === 1 ? '#624332' : '#493127'}
            opacity={i === 2 ? 0.84 : 0.94}
          />
          <g clipPath={`url(#canopy-${i})`} className="forest-canopy-letters">
            {Array.from({ length: 60 }, (_, j) => (
              <text
                key={j}
                x={45 + (j % 3) * 7}
                y={102 + j * 8.2}
                transform={`rotate(${i === 1 ? -13 : 7} 290 300)`}
              >
                {[
                  'SILVA • MEMORIA • VESTIGIA • NOCTIS • ',
                  'per umbras quaerimus · silentia rerum · ',
                  'ARBORVM SECRETA • VIA INCERTA • ',
                ][(j + i) % 3].repeat(5)}
              </text>
            ))}
          </g>
        </g>
      ))}
      {trunks.map((p, i) => (
        <g key={i}>
          <path
            className="tree-trunk"
            d={path(rounded(p, 14))}
            strokeWidth={i % 3 === 0 ? 7 : 3.5}
          />
          <path
            clipPath="url(#forest-ink-mask)"
            d={path(rounded(p, 14))}
            fill="none"
            stroke="#dfc9a4"
            strokeWidth={i % 3 === 0 ? 6 : 3}
            strokeLinecap="round"
          />
          <Wall
            id={`branch-${i}`}
            points={p}
            size={10}
            script={i % 2 === 1}
            seed={i}
          />
        </g>
      ))}
      <path
        className="forest-trail"
        d="M60 681Q294 725 336 593T501 449Q541 389 558 300"
      />
      <Label
        x={391}
        y={578}
        name="The Dark Forest"
        subtitle="Uncharted questions"
      />
      <text x="120" y="722" className="marginal-note">
        Some paths prefer to remain unnamed.
      </text>
    </g>
  );
}
function Research() {
  return (
    <g>
      <Wall
        id="research-out-a"
        points={arc(1050, 220, 145, 10, 80)}
        round={false}
        size={15}
      />
      <Wall
        id="research-out-b"
        points={arc(1050, 220, 145, 100, 350)}
        round={false}
        size={15}
        seed={1}
      />
      <Wall
        id="research-in-a"
        points={arc(1050, 220, 111, 10, 80)}
        round={false}
        size={10}
        script
      />
      <Wall
        id="research-in-b"
        points={arc(1050, 220, 111, 100, 350)}
        round={false}
        size={10}
        script
        seed={2}
      />
      <Stairs
        cx={1050}
        cy={220}
        inner={119}
        outer={131}
        start={150}
        end={337}
        count={41}
      />
      {[10, 80, 100, 350].map((a) => (
        <Rule
          key={a}
          points={[
            arc(1050, 220, 112, a, a + 1)[0],
            arc(1050, 220, 143, a, a + 1)[0],
          ]}
          width={1.5}
        />
      ))}
      <Wall
        id="research-south-west"
        points={[
          [1025, 362],
          [1017, 391],
          [1033, 429],
        ]}
        seed={1}
      />
      <Wall
        id="research-south-east"
        points={[
          [1075, 362],
          [1067, 390],
          [1083, 421],
        ]}
        seed={2}
      />
      <Label
        x={1050}
        y={213}
        name="Research Tower"
        subtitle="Questions worth following"
      />
      <text x="1050" y="260" textAnchor="middle" className="room-index">
        I
      </text>
    </g>
  );
}
function Library() {
  return (
    <g>
      <Wall
        id="library-out"
        points={arc(850, 300, 225, 110, 265)}
        round={false}
        size={15}
        seed={1}
      />
      <Wall
        id="library-in"
        points={arc(850, 300, 145, 110, 265)}
        round={false}
        size={11}
        script
      />
      <Wall
        id="library-top"
        points={[
          [830, 76],
          [847, 101],
          [839, 121],
          [837, 155],
        ]}
        size={13}
      />
      <Wall
        id="library-door-left"
        points={[
          [773, 511],
          [811, 540],
          [849, 534],
        ]}
        size={14}
      />
      <Wall
        id="library-door-right"
        points={[
          [800, 436],
          [827, 472],
          [840, 482],
        ]}
        size={13}
      />
      {[137, 184, 232].map((a, i) => (
        <g key={a}>
          <Wall
            id={`library-rib-${i}`}
            points={[
              arc(850, 300, 155, a, a + 1)[0],
              arc(850, 300, 215, a, a + 1)[0],
            ]}
            size={10}
            script
            seed={i}
          />
        </g>
      ))}
      <Label x={680} y={310} name="The Library" rotate={-82} small />
      <text
        x="744"
        y="238"
        className="marginal-note"
        transform="rotate(-68 744 238)"
      >
        Reading cloister
      </text>
      <Rule points={arc(850, 300, 170, 117, 128)} width={2} />
      <Rule points={arc(850, 300, 180, 117, 128)} />
    </g>
  );
}
function GreatHall() {
  const top: Point[] = [
    [840, 482],
    [827, 456],
    [868, 449],
    [865, 432],
    [887, 429],
    [890, 446],
    [959, 435],
    [956, 417],
    [978, 414],
    [981, 431],
    [1033, 423],
  ];
  const east: Point[] = [
    [1082, 415],
    [1130, 407],
    [1127, 390],
    [1149, 387],
    [1152, 404],
    [1226, 392],
    [1244, 404],
    [1263, 469],
    [1250, 475],
    [1256, 499],
  ];
  const bottom: Point[] = [
    [1269, 542],
    [1285, 593],
    [1269, 607],
    [1198, 619],
    [1202, 637],
    [1180, 640],
    [1176, 623],
    [1108, 634],
    [1111, 651],
    [1089, 654],
    [1086, 638],
    [1018, 649],
    [1021, 666],
    [999, 669],
    [996, 653],
    [915, 667],
    [909, 650],
    [867, 657],
    [849, 597],
    [859, 591],
    [849, 534],
  ];
  return (
    <g>
      <Wall id="hall-top" points={top} size={15} />
      <Wall id="hall-east" points={east} size={15} seed={1} />
      <Wall id="hall-bottom" points={bottom} size={15} seed={2} />
      <Wall
        id="hall-inner-n"
        points={[
          [869, 471],
          [1023, 444],
        ]}
        size={10}
        script
      />
      <Wall
        id="hall-inner-e"
        points={[
          [1104, 431],
          [1228, 412],
          [1250, 470],
        ]}
        size={10}
        script
        seed={1}
      />
      <Wall
        id="hall-inner-s"
        points={[
          [1250, 576],
          [888, 637],
          [869, 574],
        ]}
        size={10}
        script
        seed={2}
      />
      <Label
        x={1073}
        y={532}
        name="The Great Hall"
        subtitle="About Sriraam"
        rotate={-9}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${925 + i * 61} ${492 - i * 10})`}>
          <path d="M-3-5L3-5L5-3L5 3L3 5L-3 5L-5 3L-5-3Z" className="column" />
        </g>
      ))}
      <Wall
        id="hall-workshop-n"
        points={[
          [1256, 499],
          [1290, 486],
          [1324, 491],
        ]}
        size={13}
      />
      <Wall
        id="hall-workshop-s"
        points={[
          [1269, 542],
          [1300, 529],
          [1323, 531],
        ]}
        size={13}
        seed={1}
      />
    </g>
  );
}
function Workshop() {
  return (
    <g>
      <Wall
        id="workshop-shell"
        points={[
          [1324, 491],
          [1307, 444],
          [1352, 414],
          [1395, 443],
          [1450, 420],
          [1516, 431],
          [1540, 414],
          [1591, 434],
          [1616, 421],
          [1701, 465],
          [1726, 511],
          [1705, 552],
          [1740, 592],
          [1680, 644],
          [1572, 626],
          [1524, 672],
          [1440, 643],
          [1395, 665],
          [1314, 605],
          [1323, 531],
        ]}
        size={15}
        seed={2}
      />
      <Wall
        id="workshop-bay-one"
        points={[
          [1331, 459],
          [1361, 437],
          [1403, 469],
          [1385, 510],
        ]}
        size={11}
        script
      />
      <Wall
        id="workshop-bay-two"
        points={[
          [1463, 443],
          [1432, 481],
          [1539, 495],
          [1561, 454],
        ]}
        size={11}
        script
        seed={1}
      />
      <Wall
        id="workshop-bay-three"
        points={[
          [1644, 455],
          [1596, 500],
          [1625, 537],
          ...arc(1641, 564, 48, 233, 30),
        ]}
        size={11}
        script
        seed={2}
      />
      <Wall
        id="workshop-bay-four"
        points={[
          [1340, 570],
          [1400, 548],
          [1450, 602],
          [1410, 638],
        ]}
        size={11}
        script
      />
      <Wall
        id="workshop-bay-five"
        points={[
          [1496, 610],
          [1535, 632],
          [1571, 602],
          [1634, 617],
        ]}
        size={11}
        script
        seed={1}
      />
      <Label
        x={1515}
        y={554}
        name="The Workshop"
        subtitle="Build · test · reconsider"
      />
      {Array.from({ length: 7 }, (_, i) => (
        <Rule
          key={i}
          points={[
            [1352 + i * 4, 460 + i * 3],
            [1372 + i * 4, 441 + i * 3],
          ]}
          width={0.9}
        />
      ))}
    </g>
  );
}
function EastPassage() {
  return (
    <g>
      <Wall
        id="east-pass-n"
        points={[
          [1193, 195],
          [1275, 243],
          [1393, 224],
          [1450, 243],
          [1591, 258],
          [1619, 240],
        ]}
        size={13}
        seed={1}
      />
      <Wall
        id="east-pass-s"
        points={[
          [1193, 245],
          [1267, 287],
          [1400, 266],
          [1447, 284],
          [1574, 298],
          [1620, 259],
        ]}
        size={12}
        script
      />
      <Wall
        id="workshop-passage-w"
        points={[
          [1470, 287],
          [1468, 344],
          [1516, 376],
          [1516, 431],
        ]}
        size={12}
      />
      <Wall
        id="workshop-passage-e"
        points={[
          [1510, 291],
          [1508, 325],
          [1558, 355],
          [1558, 421],
        ]}
        size={12}
        seed={2}
      />
      <text
        className="passage-name"
        x="1287"
        y="252"
        transform="rotate(-8 1287 252)"
      >
        Passage of questions
      </text>
    </g>
  );
}
function Owlery() {
  return (
    <g>
      <Wall
        id="owlery-out"
        points={arc(1665, 218, 50, 164, 505)}
        round={false}
        size={11}
      />
      <Wall
        id="owlery-in"
        points={arc(1665, 218, 37, 166, 500)}
        round={false}
        size={7}
        script
      />
      <Wall
        id="owlery-small"
        points={arc(1725, 251, 26, 192, 530)}
        round={false}
        size={9}
        seed={2}
      />
      <Rule
        points={[
          [1708, 243],
          [1704, 245],
        ]}
      />
      <Rule
        points={[
          [1698, 259],
          [1701, 261],
        ]}
      />
      <Label x={1665} y={212} name="Owlery" small />
      <text x="1670" y="315" textAnchor="middle" className="marginal-note">
        Letters find their way.
      </text>
    </g>
  );
}
function CommonRoom() {
  return (
    <g>
      <Wall
        id="common-shell"
        points={[
          [786, 604],
          [759, 594],
          [733, 574],
          [686, 582],
          [650, 569],
          [600, 593],
          [579, 625],
          [586, 669],
          [625, 696],
          [681, 711],
          [734, 701],
          [780, 678],
          [800, 649],
        ]}
        size={13}
        seed={3}
      />
      <Wall
        id="common-inner"
        points={[
          [754, 614],
          [707, 597],
          [637, 596],
          [609, 623],
          [614, 663],
          [666, 685],
          [725, 682],
          [769, 659],
        ]}
        script
        size={10}
      />
      <Wall
        id="common-link-n"
        points={[
          [786, 604],
          [817, 591],
          [849, 597],
        ]}
        size={12}
      />
      <Wall
        id="common-link-s"
        points={[
          [800, 649],
          [831, 636],
          [862, 641],
        ]}
        size={12}
        seed={1}
      />
      <Label x={690} y={643} name="Common Room" small />
      <text x="690" y="663" textAnchor="middle" className="room-subtitle">
        Beyond the work
      </text>
    </g>
  );
}
const gardenBeds: Point[][] = [
  [
    [1909, 198],
    [1970, 171],
    [2011, 202],
    [1969, 259],
    [1917, 247],
    [1909, 198],
  ],
  [
    [2051, 160],
    [2139, 178],
    [2161, 230],
    [2089, 252],
    [2043, 216],
    [2051, 160],
  ],
  [
    [2185, 270],
    [2250, 278],
    [2277, 351],
    [2214, 351],
    [2185, 270],
  ],
  [
    [1962, 404],
    [2000, 449],
    [1959, 508],
    [1892, 456],
    [1912, 418],
    [1962, 404],
  ],
  [
    [2111, 456],
    [2174, 422],
    [2252, 471],
    [2236, 532],
    [2144, 557],
    [2111, 456],
  ],
];
function Garden() {
  return (
    <g>
      <Wall
        id="garden-wall"
        points={[
          [1852, 360],
          [1857, 277],
          [1890, 187],
          [1943, 143],
          [2033, 122],
          [2154, 152],
          [2242, 215],
          [2283, 310],
          [2308, 411],
          [2291, 511],
          [2231, 562],
          [2122, 592],
          [2021, 576],
          [1911, 518],
          [1864, 466],
          [1852, 399],
        ]}
        size={10}
        script
        seed={1}
      />
      {gardenBeds.map((p, i) => (
        <g key={i}>
          <Rule points={p} width={1.6} />
          {i === 0 ? (
            Array.from({ length: 7 }, (_, j) => (
              <path
                key={j}
                d={`M${1924 + j * 8} ${231 - j * 4}q-8-15 2-22m-2 15q10-5 10-14`}
                className="herb"
              />
            ))
          ) : i === 1 ? (
            Array.from({ length: 5 }, (_, j) => (
              <path
                key={j}
                d={`M${2065 + j * 15} 203l9-27m-6 17l-6-8m8 1l8-6`}
                className="herb"
              />
            ))
          ) : i === 2 ? (
            Array.from({ length: 4 }, (_, j) => (
              <path
                key={j}
                d={`M${2204 + j * 13} ${298 + j * 7}q-6-9 0-13q7 4 0 13q-5 9 2 15`}
                className="herb"
              />
            ))
          ) : (
            <g>
              <Wall
                id={`garden-bed-${i}`}
                points={p}
                size={7}
                script
                seed={i}
              />
              {i === 3
                ? [
                    [1935, 442],
                    [1958, 458],
                    [1935, 472],
                    [1970, 440],
                  ].map(([x, y], j) => (
                    <g key={j} transform={`translate(${x} ${y})`}>
                      <path
                        d="M0 11V2m0 5q-10 1-10-7m10 3q8 1 9-6M0 0q-7-8-10-2q-7 7 2 10q4 6 9 0q10 0 8-7q-1-8-9-1Z"
                        className="herb"
                      />
                      <path d="M0 0q5 0 3 4q-6 3-5-2" className="herb" />
                    </g>
                  ))
                : Array.from({ length: 7 }, (_, j) => (
                    <g
                      key={j}
                      transform={`translate(${2150 + j * 12} ${473 + j * 3}) rotate(18)`}
                    >
                      <path
                        d="M0-12Q-9-4 0 0Q9-4 0-12M0 4Q-9 12 0 16Q9 12 0 4M0 20Q-9 28 0 32Q9 28 0 20"
                        className="herb"
                      />
                    </g>
                  ))}
            </g>
          )}
        </g>
      ))}
      <path
        d="M1860 380Q1980 347 2048 377T2219 397M2070 380Q2029 308 2031 221M2069 390Q2059 457 2098 546"
        className="garden-walk"
      />
      <g transform="translate(1880 555) rotate(18)">
        <path
          d="M0 0L93 0L93 44L0 44ZM0 0L47-20L93 0M47-20V44M23-10V44M70-10V44M0 22H93"
          className="glasshouse"
        />
        <text x="45" y="66" textAnchor="middle" className="marginal-note">
          Glasshouse
        </text>
      </g>
      <Label x={2070} y={384} name="The Garden" subtitle="Room to think" />
      <Rule
        points={[
          [2135, 326],
          [2161, 323],
        ]}
        width={3}
      />
      <Rule
        points={[
          [2135, 331],
          [2161, 328],
        ]}
      />
      <path
        d="M1740 592Q1800 619 1860 569M1725 607Q1790 649 1845 584"
        className="garden-walk"
      />
    </g>
  );
}
function Grounds() {
  return (
    <g>
      <path
        d="M1146 768Q1260 714 1440 739T1735 698Q1838 632 1950 664T2170 677Q2290 649 2355 597M1199 778Q1288 746 1446 760T1750 720Q1843 665 1949 690T2175 701Q2303 678 2365 625"
        className="river-bank"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${1470 + i * 35} ${746 + i * 3}q52 12 98 1M${1928 + i * 43} ${675 + i * 3}q27 13 53 4`}
          className="water-mark"
        />
      ))}
      <path
        d="M1077 664L1096 719Q1100 735 1120 740L1240 768M1108 658L1125 706Q1128 718 1140 718L1260 743"
        className="approach"
      />
      <g transform="translate(1240 749) rotate(30)">
        <path d="M0-8V39M37-8V39M-5-3H42M-5 33H42" className="bridge" />
        {[0, 6, 12, 18, 24, 30].map((y) => (
          <path key={y} d={`M2 ${y}H35`} className="water-mark" />
        ))}
      </g>
      <text x="1460" y="701" className="marginal-note">
        The long way home
      </text>
      <path d="M559 190Q585 320 559 452T534 672" className="forest-edge" />
    </g>
  );
}
export function EstateDrawing() {
  return (
    <g className="estate-ink">
      <rect width="2400" height="800" fill="#e8dfc9" />
      <path
        d="M35 72L35 34L340 34M2070 34H2366V72M35 727V766H320M2110 766H2366V725"
        className="folio-corner"
      />
      <Forest />
      <Grounds />
      <Library />
      <Research />
      <EastPassage />
      <GreatHall />
      <Workshop />
      <Owlery />
      <CommonRoom />
      <Garden />
      <text x="70" y="55" className="folio-note">
        SRIRAAM · A CHART OF WORK & WONDER
      </text>
      <text x="2337" y="747" textAnchor="end" className="folio-note">
        BONVM AVDERE EST
      </text>
    </g>
  );
}
export function EstateDefinitions() {
  return (
    <svg className="estate-definitions" width="0" height="0" aria-hidden="true">
      <defs>
        <symbol id="estate-vector" viewBox="0 0 2400 800">
          <EstateDrawing />
        </symbol>
      </defs>
    </svg>
  );
}
export function EstateMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <svg
      className="estate-art vector-map"
      viewBox="0 0 2400 800"
      role="group"
      aria-label="Interactive castle and grounds"
    >
      <use href="#estate-vector" width="2400" height="800" />
      {places.map((p) => (
        <g
          key={p.id}
          role="button"
          tabIndex={0}
          aria-label={`Explore ${p.name}`}
          aria-pressed={selected === p.id}
          className={`place-target ${selected === p.id ? 'selected' : ''}`}
          onClick={() => onSelect(p.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(p.id);
            }
          }}
        >
          <title>{`${p.name} — ${p.subtitle}`}</title>
          <path d={p.hit} />
        </g>
      ))}
      <g className="wandering-trail" aria-hidden="true">
        <path
          id="wander-route"
          d="M832 507Q1000 550 1136 530Q1230 508 1330 513Q1400 490 1490 540"
          fill="none"
          stroke="none"
        />
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} opacity={(i + 1) / 10}>
            <animateMotion
              dur="24s"
              repeatCount="indefinite"
              begin={`${-i * 0.7}s`}
              rotate="auto"
            >
              <mpath href="#wander-route" />
            </animateMotion>
            <path d="M-3-5q-3-2-4 0l-1 4q1 3 3 1Z M3 3q-3-2-4 0l-1 4q1 3 3 1Z" />
          </g>
        ))}
        <g>
          <animateMotion dur="24s" repeatCount="indefinite" rotate="auto">
            <mpath href="#wander-route" />
          </animateMotion>
          <text x="10" y="-12" fontSize="12">
            Sriraam
          </text>
        </g>
      </g>
    </svg>
  );
}
