import tower from './reference-section.json';
import halls from './clock-halls.json';
import stairs from './stairwell.json';
export const sections = [
 {id:'reference-section',label:'Tower & passage',source:tower},
 {id:'clock-halls',label:'Clock Tower & halls',source:halls},
 {id:'stairwell',label:'Stairwell & turret',source:stairs},
] as const;
export type SectionId='all'|typeof sections[number]['id'];
export type ViewMode='drawing'|'photo'|'overlay';
export type Focus={id:string;label:string;box:readonly number[]};
export const fullMapBox=[185,335,1145,1360] as const;
export const focuses:Record<SectionId,Focus[]>={
 all:[{id:'whole',label:'Whole map',box:fullMapBox}],
 'reference-section':[
  {id:'whole',label:'Whole section',box:[880,345,445,890]},
  {id:'tower',label:'Tower',box:[882,355,420,450]},
  {id:'entrance',label:'Entrance joins',box:[1060,653,260,245]},
  {id:'bend',label:'Passage bend',box:[1053,847,270,307]},
 ],
 'clock-halls':[
  {id:'whole',label:'Whole section',box:[195,735,870,955]},
  {id:'clock',label:'Clock Tower',box:[315,800,490,530]},
  {id:'hall',label:'Hesperus Hall',box:[635,748,414,480]},
  {id:'crossing',label:'Crossing & rooms',box:[450,1240,510,440]},
 ],
 stairwell:[
  {id:'whole',label:'Whole section',box:[917,1137,315,368]},
  {id:'upper',label:'Upper stair',box:[975,1150,250,150]},
  {id:'lower',label:'Open stair',box:[970,1280,225,211]},
 ],
};
