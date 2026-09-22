// The plan and its content share room IDs. Extend a room's footprint or add an
// adjoining room here; drawing and hit areas stay independently editable.
export const PLAN_ANGLE = -14;
export function mapPoint(x: number, y: number) {
  const a = (PLAN_ANGLE * Math.PI) / 180;
  return {
    x: 600 + (x - 600) * Math.cos(a) - (y - 450) * Math.sin(a),
    y: 450 + (x - 600) * Math.sin(a) + (y - 450) * Math.cos(a),
  };
}
export const rooms = [
  {
    id: 'hall',
    name: 'The Great Hall',
    kind: 'About Sriraam',
    x: 468,
    y: 250,
    w: 369,
    h: 286,
    center: [650, 395],
    span: 440,
    shape: 'polygon(0 0,90% 0,100% 13%,100% 86%,89% 100%,0 100%)',
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
    x: 117,
    y: 14,
    w: 230,
    h: 230,
    center: [232, 129],
    span: 310,
    shape: 'circle(50%)',
    body: 'Sample efficiency, continual learning, human simulation, mechanistic interpretability and reinforcement learning.',
    detail:
      'World models, neural RL environments, sycophancy, and adaptive reasoning are also questions I keep returning to.',
    link: 'https://www.sriraam.me/',
    linkLabel: 'Research interests',
  },
  {
    id: 'study',
    name: 'The Study',
    kind: 'Learning & ideas',
    x: 285,
    y: 372,
    w: 126,
    h: 115,
    center: [348, 429],
    span: 240,
    shape: 'polygon(14% 0,100% 0,100% 100%,0 100%,0 17%)',
    body: 'Human learning is a recurring source of inspiration for my reinforcement-learning work.',
    detail: 'This room gathers the learning-science thread of the castle.',
    link: 'https://www.gse.harvard.edu/',
    linkLabel: 'Harvard Graduate School of Education',
  },
  {
    id: 'notes',
    name: 'Field Notes',
    kind: 'Writing',
    x: 287,
    y: 521,
    w: 123,
    h: 122,
    center: [348, 581],
    span: 240,
    shape: 'polygon(0 0,100% 0,100% 83%,83% 100%,0 100%)',
    body: 'My first Vibe RL experience.',
    detail:
      'A first piece of writing from my personal site. The notes room can grow into a larger library as more writing is added.',
    link: 'https://www.sriraam.me/',
    linkLabel: 'Read on my website',
  },
  {
    id: 'workshop',
    name: 'The Workshop',
    kind: 'Work & experiments',
    x: 884,
    y: 330,
    w: 137,
    h: 152,
    center: [949, 404],
    span: 260,
    shape: 'polygon(0 0,80% 0,100% 18%,100% 100%,0 100%)',
    body: 'At Chakra Labs, I work on the post-training team, building RL environments, tasks, and internal benchmarks for foundation labs.',
    detail:
      'This is the first workshop room. New projects can have their own adjoining rooms as this wing grows.',
    link: 'https://www.chakra.dev/',
    linkLabel: 'Chakra Labs',
  },
  {
    id: 'entrance',
    name: 'Entrance Court',
    kind: 'Elsewhere',
    x: 605,
    y: 606,
    w: 153,
    h: 143,
    center: [682, 674],
    span: 270,
    shape:
      'polygon(22% 0,77% 0,100% 24%,100% 73%,74% 100%,22% 100%,0 73%,0 25%)',
    body: 'A place to arrive, look around, and find me elsewhere.',
    detail: 'Outside research: Hogwarts, anime, and K-dramas.',
    link: 'https://github.com/13point5',
    linkLabel: 'Find me on GitHub',
  },
] as const;
export type Room = (typeof rooms)[number];
