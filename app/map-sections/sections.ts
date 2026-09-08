import tower from './reference-section.json';
import halls from './clock-halls.json';
import stairs from './stairwell.json';
export const sections = [
 {id:'reference-section',label:'Tower & passage',source:tower},
 {id:'clock-halls',label:'Clock Tower & halls',source:halls},
 {id:'stairwell',label:'Stairwell & turret',source:stairs},
] as const;
export const fullMapBox=[185,335,1145,1360] as const;
