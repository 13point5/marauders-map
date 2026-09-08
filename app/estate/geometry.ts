import metrics from './letter-metrics.json' with { type: 'json' };
export type Point = readonly [number, number];
export const WIDTH = 2400,
  HEIGHT = 800;
export function arc(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
): Point[] {
  return Array.from(
    { length: Math.ceil(Math.abs(end - start) / 3) + 1 },
    (_, i) => {
      const count = Math.ceil(Math.abs(end - start) / 3),
        t = ((start + ((end - start) * i) / count) * Math.PI) / 180;
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as Point;
    },
  );
}
export function length(points: readonly Point[]) {
  return points
    .slice(1)
    .reduce(
      (n, p, i) => n + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]),
      0,
    );
}
export function path(points: readonly Point[]) {
  return points
    .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(' ');
}
export function rounded(points: readonly Point[], radius = 7): Point[] {
  if (points.length < 3) return [...points];
  const result: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1],
      b = points[i],
      c = points[i + 1];
    const da = Math.hypot(b[0] - a[0], b[1] - a[1]),
      dc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const r = Math.min(radius, da / 3, dc / 3);
    const p: Point = [
        b[0] + ((a[0] - b[0]) * r) / da,
        b[1] + ((a[1] - b[1]) * r) / da,
      ],
      q: Point = [
        b[0] + ((c[0] - b[0]) * r) / dc,
        b[1] + ((c[1] - b[1]) * r) / dc,
      ];
    result.push(p);
    for (let j = 1; j <= 6; j++) {
      const t = j / 6;
      result.push([
        (1 - t) ** 2 * p[0] + 2 * (1 - t) * t * b[0] + t * t * q[0],
        (1 - t) ** 2 * p[1] + 2 * (1 - t) * t * b[1] + t * t * q[1],
      ]);
    }
  }
  result.push(points[points.length - 1]);
  return result;
}
const phrases = [
  'AVDERE EST FACERE • MIRABILIA QVAERERE • ',
  'PER AMBAGES AD LVCEM • COGITATIO ET ARS • ',
  'INVENIRE DISCERE EXPLORARE • ',
  'MEMORIA SCIENTIA CVRIOSITAS • ',
];
const scripts = [
  'quaerere et invenire · per silentium discimus · ',
  'vestigia mentis et mirabilia rerum · ',
  'in angulis latent quaestiones · ',
];
export function fittedLetters(
  distance: number,
  size: number,
  italic = false,
  seed = 0,
) {
  const m = (italic ? metrics.italic : metrics.regular) as Record<
    string,
    number
  >;
  const phrase = (italic ? scripts : phrases)[
    seed % (italic ? scripts : phrases).length
  ];
  let text = '',
    used = 0,
    index = 0;
  // Reserve the first and last ink bearings; never cut a character at a path end.
  while (index < 4000) {
    const char = phrase[index % phrase.length],
      advance = (m[char] ?? 0.5) * size;
    if (used + advance > distance - 8) break;
    text += char;
    used += advance;
    index++;
  }
  return text.trimEnd();
}
export const places = [
  {
    id: 'research',
    name: 'Research Tower',
    subtitle: 'Questions worth following',
    x: 1050,
    y: 213,
    hit: 'M905 220a145 145 0 1 0 290 0a145 145 0 1 0-290 0',
    body: 'Sample efficiency, continual learning, human simulation, and the ways models learn to reason.',
  },
  {
    id: 'workshop',
    name: 'The Workshop',
    subtitle: 'Work & experiments',
    x: 1506,
    y: 537,
    hit: 'M1300 430L1480 410L1720 468L1740 620L1450 674L1300 600Z',
    body: 'Applied research at Chakra Labs: reinforcement-learning environments, tasks, and internal benchmarks for knowledge work.',
  },
  {
    id: 'hall',
    name: 'The Great Hall',
    subtitle: 'About Sriraam',
    x: 1080,
    y: 531,
    hit: 'M822 464L1244 396L1292 580L865 650Z',
    body: 'I’m Sriraam. I studied Learning Science at Harvard; now I work on how people and AI systems learn.',
  },
  {
    id: 'library',
    name: 'The Library',
    subtitle: 'Writing & field notes',
    x: 697,
    y: 317,
    hit: 'M832 74A225 225 0 0 0 774 510L802 434A145 145 0 0 1 838 155Z',
    body: 'A place for field notes, unfinished questions, and writing—including my first Vibe RL experience.',
  },
  {
    id: 'owlery',
    name: 'The Owlery',
    subtitle: 'Correspondence',
    x: 1665,
    y: 208,
    hit: 'M1615 218a50 50 0 1 0 100 0a50 50 0 1 0-100 0M1698 251a27 27 0 1 0 54 0a27 27 0 1 0-54 0',
    body: 'Find me online and send a note.',
    links: [
      { name: 'GitHub', href: 'https://github.com/13point5' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/13point5' },
      { name: 'X', href: 'https://x.com/27upon2' },
    ],
  },
  {
    id: 'common',
    name: 'The Common Room',
    subtitle: 'Beyond the work',
    x: 695,
    y: 650,
    hit: 'M580 612Q565 690 653 711Q750 739 799 671L787 602L685 572Z',
    body: 'Hogwarts, anime, K-dramas—and the things that make room for curiosity outside work.',
  },
  {
    id: 'forest',
    name: 'The Dark Forest',
    subtitle: 'Uncharted questions',
    x: 310,
    y: 462,
    hit: 'M74 105L456 92L555 325L520 566L95 639Z',
    body: 'A little room for wandering. Not every interesting path needs a destination.',
  },
  {
    id: 'garden',
    name: 'The Garden',
    subtitle: 'Room to think',
    x: 2070,
    y: 384,
    hit: 'M1890 138Q2110 84 2260 205L2310 518L2020 604L1850 473Z',
    body: 'A quieter corner of the map: open paths, a reading bench, and room for ideas to grow.',
  },
] as const;
export type Place = (typeof places)[number];
