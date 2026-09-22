// The plan and its content share room IDs. Extend a room's footprint or add an
// adjoining room here; drawing and hit areas stay independently editable.
export const PLAN_ANGLE = -14;
export const PLAN_ORIGIN = { x: 800, y: 600 };
export function mapPoint(x: number, y: number) {
  const a = (PLAN_ANGLE * Math.PI) / 180;
  return {
    x:
      PLAN_ORIGIN.x +
      (x - PLAN_ORIGIN.x) * Math.cos(a) -
      (y - PLAN_ORIGIN.y) * Math.sin(a),
    y:
      PLAN_ORIGIN.y +
      (x - PLAN_ORIGIN.x) * Math.sin(a) +
      (y - PLAN_ORIGIN.y) * Math.cos(a),
  };
}
export const rooms = [
  {
    id: 'hall',
    name: 'The Great Hall',
    kind: 'About Sriraam',
    x: 522,
    y: 302,
    w: 382,
    h: 318,
    center: [712, 455],
    span: 440,
    shape: 'polygon(0 0,89% 0,100% 15%,100% 86%,90% 100%,0 100%)',
    body: 'I’m Sriraam, an applied researcher working on how people and AI systems learn. I build reinforcement-learning environments, training tasks, and benchmarks for knowledge work.',
    detail:
      'My time studying Learning Science at Harvard shapes how I approach research: almost every problem is a learning problem.',
    link: 'https://www.sriraam.me/',
    linkLabel: 'Visit my profile',
  },
  {
    id: 'research',
    name: 'Research Tower',
    kind: 'Questions worth following',
    x: 140,
    y: 60,
    w: 285,
    h: 285,
    center: [283, 202],
    span: 350,
    shape: 'circle(50%)',
    body: 'Sample efficiency, continual learning, human simulation, mechanistic interpretability and reinforcement learning.',
    detail:
      'World models, neural RL environments, sycophancy, and adaptive reasoning are also questions I keep returning to.',
    link: 'https://www.sriraam.me/',
    linkLabel: 'Research interests',
  },
  {
    id: 'library',
    name: 'The Library',
    kind: 'Writing & field notes',
    x: 972,
    y: 124,
    w: 376,
    h: 376,
    center: [1160, 312],
    span: 435,
    shape: 'circle(50%)',
    body: 'A place for field notes, unfinished questions, and writing—including my first Vibe RL experience.',
    detail:
      'Human learning is a recurring source of inspiration for my research. These are some of the ideas I return to.',
    link: 'https://www.sriraam.me/',
    linkLabel: 'Read my writing',
  },
  {
    id: 'workshop',
    name: 'The Workshop',
    kind: 'Work & experiments',
    x: 988,
    y: 655,
    w: 288,
    h: 264,
    center: [1135, 790],
    span: 350,
    shape: 'polygon(0 0,89% 0,100% 11%,100% 86%,87% 100%,8% 100%,0 92%)',
    body: 'At Chakra Labs, I work on the post-training team, building RL environments, tasks, and internal benchmarks for foundation labs.',
    detail:
      'Reinforcement learning, training tasks, and experiments in how models reason and learn.',
    link: 'https://www.chakra.dev/',
    linkLabel: 'Chakra Labs',
  },
  {
    id: 'common',
    name: 'The Common Room',
    kind: 'Beyond the work',
    x: 663,
    y: 750,
    w: 256,
    h: 242,
    center: [790, 870],
    span: 335,
    shape: 'polygon(0 0,100% 0,100% 90%,87% 100%,11% 100%,0 90%)',
    body: 'Hogwarts, anime, K-dramas—and the things that make room for curiosity outside work.',
    detail: 'A quieter corner of the castle, away from the experiments.',
    link: 'https://www.sriraam.me/',
    linkLabel: 'More about me',
  },
  {
    id: 'owlery',
    name: 'The Owlery',
    kind: 'Correspondence',
    x: 1254,
    y: 579,
    w: 143,
    h: 75,
    center: [1330, 608],
    span: 240,
    shape: 'polygon(9% 0,100% 0,100% 61%,80% 100%,21% 100%,0 58%)',
    body: 'Find me online and follow what I’m working on.',
    detail: 'The way out from this little pair of towers leads to my GitHub.',
    link: 'https://github.com/13point5',
    linkLabel: 'Find me on GitHub',
  },
  {
    id: 'entrance',
    name: 'Entrance Court',
    kind: 'Welcome',
    x: 407,
    y: 830,
    w: 170,
    h: 137,
    center: [490, 900],
    span: 280,
    shape:
      'polygon(14% 0,85% 0,100% 22%,100% 78%,82% 100%,14% 100%,0 80%,0 20%)',
    body: 'A place to arrive, look around, and find me elsewhere.',
    detail:
      'The Great Hall introduces my work; the Library holds my writing; the Workshop is where the experiments happen.',
    link: 'https://github.com/13point5',
    linkLabel: 'Find me on GitHub',
  },
] as const;
export type Room = (typeof rooms)[number];
