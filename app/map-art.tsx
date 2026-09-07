'use client';
import { useId, useEffect, useRef, useState } from 'react';
import { fitInscription } from './fit-inscription';
export type Room = 'about' | 'research' | 'writing' | 'contact' | 'beyond';
type Point = [number, number];

// A wall owns its inscription. Measure complete words after the local font loads;
// never wrap a repeated string around a sharp corner or let it overrun the wall.
function Inscription({x,y,length,words,size=11,angle=0,script=false}:{x:number;y:number;length:number;words:string;size?:number;angle?:number;script?:boolean}) {
 const [fitted,setFitted]=useState<{text:string;width:number}|null>(null);
 useEffect(()=>{let active=true;const font=`${script?'italic ':''}${size}px "IM Fell English"`;
  void document.fonts.load(font).then(()=>{if(active)setFitted(fitInscription(words,font,length))});
  return()=>{active=false}
 },[words,length,size,script]);
 if(!fitted?.text)return null;
 return <text transform={`translate(${x} ${y}) rotate(${angle})`} className={script?'wall-inscription script-inscription':'wall-inscription'} fontSize={size} textLength={fitted.width} lengthAdjust="spacingAndGlyphs" data-wall-capacity={length} data-layout-engine="pretext">{fitted.text}</text>;
}

function Wall({from,to,words,door=false,thickness=15,script=false}:{from:Point;to:Point;words:string;door?:boolean;thickness?:number;script?:boolean}){
 const dx=to[0]-from[0],dy=to[1]-from[1],length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;
 const gap=38,sections=door?[[0,(length-gap)/2],[(length+gap)/2,length]]:[[0,length]];
 return <g transform={`translate(${from[0]} ${from[1]}) rotate(${angle})`} className="architectural-wall">
 {sections.map(([a,b],i)=><g key={i}><path d={`M${a} 0H${b}M${a} ${thickness}H${b}`} className="wall-outline"/><Inscription x={a+6} y={thickness-3} length={Math.max(8,b-a-12)} words={i?(words.split(' ').slice(Math.ceil(words.split(' ').length/2)).join(' ')||words):words} size={thickness-3.5} script={script}/></g>)}
 {door&&<path d={`M${(length-gap)/2} 0v${thickness}m${gap} ${-thickness}v${thickness}`} className="wall-outline"/>}
 </g>;
}
function Chamber({x,y,w,h,words,doors=[],buttresses=false}:{x:number;y:number;w:number;h:number;words:[string,string,string,string];doors?:string[];buttresses?:boolean}){
 return <g><Wall from={[x,y]} to={[x+w,y]} words={words[0]} door={doors.includes('n')}/><Wall from={[x+w,y]} to={[x+w,y+h]} words={words[1]} door={doors.includes('e')}/><Wall from={[x+w,y+h]} to={[x,y+h]} words={words[2]} door={doors.includes('s')}/><Wall from={[x,y+h]} to={[x,y]} words={words[3]} door={doors.includes('w')}/>
 {buttresses&&[.18,.37,.63,.82].map(v=><g key={v} className="wall-outline"><path d={`M${x} ${y+h*v-5}h-9v10h9M${x+w} ${y+h*v-5}h9v10h-9`}/></g>)}</g>
}
function Passage({points,words,width=40}:{points:Point[];words:string;width?:number}){
 // The polygon edges meet at mitred bends; writing stops before each bend.
 const directions=points.slice(1).map((p,i)=>{const l=Math.hypot(p[0]-points[i][0],p[1]-points[i][1]);return [(p[0]-points[i][0])/l,(p[1]-points[i][1])/l] as Point});
 const side=(sign:number)=>points.map((p,i)=>{const a=directions[Math.max(0,i-1)],b=directions[Math.min(i,directions.length-1)];const nx=-a[1]-b[1],ny=a[0]+b[0],den=1+a[0]*b[0]+a[1]*b[1];return [p[0]+sign*width/2*nx/den,p[1]+sign*width/2*ny/den] as Point});
 const left=side(1),right=side(-1);
 return <g>{[left,right].map((s,k)=><g key={k}><path d={'M'+s.map(p=>p.join(' ')).join('L')} className="passage-outline"/>{s.slice(1).map((p,i)=>{const a=s[i],length=Math.hypot(p[0]-a[0],p[1]-a[1]);const angle=Math.atan2(p[1]-a[1],p[0]-a[0])*180/Math.PI;return <g key={i} transform={`translate(${a[0]} ${a[1]}) rotate(${angle})`}><Inscription x={8} y={k?13:-3} length={length-16} words={words} size={9.5} script={k===0}/></g>})}</g>)}</g>
}
const polar=(x:number,y:number,r:number,a:number):Point=>[x+r*Math.cos(a*Math.PI/180),y+r*Math.sin(a*Math.PI/180)];
function arc(x:number,y:number,r:number,a:number,b:number){const p=polar(x,y,r,a),q=polar(x,y,r,b);return `M${p[0]} ${p[1]}A${r} ${r} 0 ${b-a>180?1:0} 1 ${q[0]} ${q[1]}`}
function CurvedInscription({x,y,r,a,b,words,size=12}:{x:number;y:number;r:number;a:number;b:number;words:string;size?:number}){
 const id=useId().replaceAll(':','');const length=(b-a)*Math.PI/180*r;
 return <g><defs><path id={id} d={arc(x,y,r,a,b)}/></defs><text className="wall-inscription" fontSize={size} textLength={length} lengthAdjust="spacingAndGlyphs"><textPath href={`#${id}`}>{words}</textPath></text></g>
}
function Tower({x,y,r,words,small=false}:{x:number;y:number;r:number;words:string;small?:boolean}){
 const inner=r-(small?18:33);
 return <g><path d={`${arc(x,y,r,104,436)} ${arc(x,y,inner,110,430)}`} className="wall-outline"/>
 <CurvedInscription x={x} y={y} r={r-4} a={118} b={416} words={words} size={small?9:12}/>
 {!small&&Array.from({length:42},(_,i)=>{const a=132+i*6.2,p=polar(x,y,r-14,a),q=polar(x,y,inner,a);return <path key={i} d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} className="stair-tread"/>})}
 <path d={`M${polar(x,y,r,104).join(' ')}L${polar(x,y,inner,110).join(' ')}M${polar(x,y,r,436).join(' ')}L${polar(x,y,inner,430).join(' ')}`} className="wall-outline"/>
 </g>
}
function Stair({x,y,w,h}:{x:number;y:number;w:number;h:number}){return <g className="stairs"><path d={`M${x} ${y+h}V${y}H${x+w}V${y+h}`} className="wall-outline"/>{Array.from({length:Math.floor(h/5)},(_,i)=><path key={i} d={`M${x} ${y+i*5}h${w}`} className="stair-tread"/>)}</g>}
function Label({x,y,title,subtitle,room,onVisit,width=160}:{x:number;y:number;title:string;subtitle:string;room:Room;onVisit:(r:Room)=>void;width?:number}){
 return <g className="room-link" role="button" tabIndex={0} aria-label={`Visit ${title}: ${subtitle}`} onClick={()=>onVisit(room)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onVisit(room)}}}><rect className="room-hit" x={x-width/2} y={y-32} width={width} height={74} rx="3"/><text x={x} y={y-6} className="room-title" textAnchor="middle">{title}</text><text x={x} y={y+17} className="room-subtitle" textAnchor="middle">{subtitle} ↗</text><text x={x} y={y+35} className="room-star" textAnchor="middle">✧</text></g>
}
const routes=[
 {name:'Sriraam',room:'about' as Room,path:'M594 485L594 347L906 347L906 622L594 622L594 485Z',duration:66},
 {name:'Hermione Granger',room:'writing' as Room,path:'M1020 420L1020 540L1064 540L1020 540L1020 420Z',duration:40},
 {name:'Harry Potter',room:'research' as Room,path:'M1210 362L1210 385L1020 385L1020 418L1020 385L1210 385L1210 362Z',duration:46},
 {name:'Luna Lovegood',room:'beyond' as Room,path:'M335 690L585 690L585 755L651 755L585 755L585 690L335 690Z',duration:48},
];
function Wanderer({person,index,onVisit}:{person:typeof routes[number];index:number;onVisit:(r:Room)=>void}){return <g className="wanderer">
 {Array.from({length:9},(_,i)=><g key={i} opacity={(9-i)/15} aria-hidden="true"><animateMotion dur={`${person.duration}s`} repeatCount="indefinite" path={person.path} rotate="auto" begin={`${-index*8+i*.6-7}s`}/><g transform={`translate(0 ${i%2?5:-5}) rotate(90)`}><ellipse cy="-2" rx="2" ry="4"/><ellipse cy="4" rx="1.8" ry="1.5"/></g></g>)}
 <g className="person-marker" role="button" tabIndex={0} aria-label={`Follow ${person.name}`} onClick={()=>onVisit(person.room)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onVisit(person.room)}}}><animateMotion dur={`${person.duration}s`} repeatCount="indefinite" path={person.path} begin={`${-index*8-7}s`}/><rect x="-64" y="-31" width="128" height="25"/><text y="-14" textAnchor="middle">{person.name}</text><path d="M-4 -6 0 0 4 -6" fill="none" stroke="currentColor"/></g></g>}
export default function MapArt({onVisit,paused}:{onVisit:(r:Room)=>void;paused:boolean}){
 const ref=useRef<SVGSVGElement>(null);useEffect(()=>{if(paused)ref.current?.pauseAnimations();else ref.current?.unpauseAnimations()},[paused]);
 return <svg ref={ref} viewBox="0 0 1500 900" className="map-art" aria-label="A map of Sriraam’s world, with rooms and corridors formed from letters">
 <g className="map-lines" aria-hidden="true">
 <path d="M42 53H1458V852H42Z" className="map-rule"/><path d="M42 53H1458V852H42Z" className="map-rule-dashes"/>
 <Inscription x={62} y={77} length={1375} words="OMNIBVS MARAVDENTIBVS BONVM AVDERE EST MARAVDERE · MESSRS MOONY, WORMTAIL, PADFOOT & PRONGS" size={14}/>
 <Inscription x={1438} y={832} length={1375} angle={180} words="ITINERARIVM MARAVDENTIVM · HOGWARTS SCHOOL OF WITCHCRAFT & WIZARDRY · DRACO DORMIENS NVNQVAM TITILLANDVS" size={13}/>
 <text className="cartouche-small" x="750" y="118" textAnchor="middle">MESSRS MOONY, WORMTAIL, PADFOOT & PRONGS</text><text className="map-heading" x="750" y="160" textAnchor="middle">The Marauder’s Map</text><text className="ink-script" x="750" y="186" textAnchor="middle" fontSize="16">a rather curious guide to the world of Sriraam</text>
 <Passage points={[[185,346],[185,485],[340,485]]} words="Via epistolarum · passage to the Great Hall"/>
 <Passage points={[[437.5,212],[437.5,347]]} words="PORTICVS OCCIDENTALIS · in pursuit of knowledge" width={36}/>
 <Passage points={[[530,485],[565,485]]} words="VIA" width={38}/>
 <Passage points={[[945,485],[1020,485],[1020,540],[1080,540]]} words="Lower chambers corridor · North East" width={42}/>
 <Passage points={[[1020,485],[1020,385],[1210,385],[1210,350]]} words="AD ASTRA · the way to the Astronomy Tower" width={36}/>
 <Passage points={[[190,645],[190,690],[585,690],[585,755],[675,755]]} words="Serpentine corridor · keep an eye out for ghosts" width={40}/>
 <Passage points={[[755,655],[755,702]]} words="VIA" width={38}/>
 <Passage points={[[1210,620],[1210,680]]} words="VIA" width={40}/>
 <Passage points={[[835,755],[1140,755]]} words="Passage to the Clock Tower · tempus fugit" width={38}/>
 <Tower x={185} y={250} r={96} words="THE OWLERY · EPISTOLAE · CORRESPONDENCE · PER NOCTEM AD LVCEM"/>
 <Chamber x={340} y={347} w={190} h={276} words={['HOGWARTS GREAT HALL','SCIENTIA POTENTIA EST · SEMPER DISCERE','A HISTORY OF HUMAN LEARNING','CURIOSITAS · IMAGINATIO · EXPERIMENTVM']} doors={['n','e','w']} buttresses/>
 <Stair x={397} y={583} w={76} h={27}/>
 <Chamber x={100} y={520} w={180} h={125} words={['SECTIO RESTRICTA','ARCANA · MYSTERIA','BOOKS BEST LEFT UNOPENED','SILENTIVM EST AVREVM']} doors={['s']}/>
 <Chamber x={350} y={112} w={175} h={100} words={['REQUIREMENT','APPAREO','WHAT YOU SEEK MAY FIND YOU','VENI']} doors={['s']}/>
 <text x="437" y="155" textAnchor="middle" className="ink-script" fontSize="15">Room of</text><text x="437" y="176" textAnchor="middle" className="minor-room">REQUIREMENT</text>
 <text x="190" y="567" textAnchor="middle" className="ink-script" fontSize="16">The Restricted</text><text x="190" y="589" textAnchor="middle" className="minor-room">SECTION</text>
 <Chamber x={565} y={315} w={380} h={340} words={['OMNIBVS MARAVDENTIBVS BONVM AVDERE EST MARAVDERE','HOGWARTS · LEARNING IS A LIFELONG ADVENTURE','BONVM AVDERE EST MARAVDERE · MEMENTO VIVERE','DISCOVERY BEGINS WITH A QUESTION']} doors={['e','w','s']}/>
 <Chamber x={622} y={382} w={266} h={212} words={['AVDERE EST FACERE · SCIENTIA','SEMPER DISCERE · SEMPER CREARE','THE WORLD REWARDS A CURIOUS MIND','COGITO ERGO SVM · QVAERE']} />
 <Inscription x={594} y={356} length={316} words="Omnibus Maraudentibus Bonum Audere est" size={13} script/>
 <Inscription x={907} y={625} length={310} angle={180} words="A little mischief, a lifetime of learning" size={12} script/>
 <rect x="647" y="411" width="215" height="153" fill="#713425"/>
 <text className="personal-name" x="755" y="464" textAnchor="middle">SRIRAAM</text><text className="personal-caption" x="755" y="491" textAnchor="middle">RESEARCHER</text><text className="personal-caption" x="755" y="515" textAnchor="middle">& PERPETUAL LEARNER</text><text x="755" y="543" textAnchor="middle" fill="#ebd7ac" fontSize="20">✧</text>
 <Tower x={1210} y={235} r={115} words="ASTRONOMIA · MUNDI EXEMPLARIA · PER ASPERA AD ASTRA · SCIENTIA ET EXPERIMENTVM"/>
 <Passage points={[[1370,412],[1370,432],[1220,432],[1220,460]]} words="Observatorium · watch the stars" width={24}/>
 <Tower x={1370} y={373} r={39} words="OBSERVATORIVM · STELLAE" small/>
 <Chamber x={1080} y={460} w={280} h={160} words={['BIBLIOTHECA · VERBA VOLANT SCRIPTA MANENT','DE EXPERIMENTIS','NOTES FROM THE EXPERIMENTS · MEMORIA','SCRIPTORIVM']} doors={['w','s','n']} buttresses/>
 <Stair x={1304} y={501} w={27} h={70}/>
 <Chamber x={1140} y={680} w={220} h={117} words={['CLOCK TOWER','TEMPVS FVGIT','EVERY MOMENT IS A NEW BEGINNING','HOROLOGIVM']} doors={['n','w']}/>
 <text x="1247" y="723" textAnchor="middle" className="minor-room">CLOCK TOWER</text><Stair x={1200} y={745} w={90} h={34}/>
 <Chamber x={675} y={702} w={160} h={106} words={["A ROOM OF ONE’S OWN","REST · READ · WONDER","CURIOSITY NEVER SLEEPS","WELCOME HOME"]} doors={["n","e","w"]}/>
 <Chamber x={355} y={731} w={144} h={70} words={['ARITHMANCY','NUMERI','THE BEAUTY OF PATTERNS','ARS']} doors={['n']}/><text x="427" y="773" textAnchor="middle" className="minor-room">ARITHMANCY</text>
 <Chamber x={670} y={242} w={160} h={50} words={['THE PENSIEVE','M','MEMORIES WORTH KEEPING','P']}/><text x="750" y="272" className="minor-room" textAnchor="middle">PENSIEVE</text>
 <text x="1390" y="160" textAnchor="middle" className="compass">N</text><path d="M1390 173v72m-35-36h70m-58-23 46 46m-46 0 46-46" className="stair-tread"/>
 <text x="370" y="660" className="map-note" transform="rotate(-4 370 660)">You are not lost. Just curious.</text>
 <text x="89" y="454" className="map-note">Owl post, this way</text><text x="914" y="698" className="map-note">Beware moving staircases</text>
 <text x="88" y="117" className="folio-number">291</text><text x="1387" y="817" className="folio-number">294</text>
 </g>
 <Label x={185} y={248} title="The Owlery" subtitle="LET’S TALK" room="contact" onVisit={onVisit} width={119}/>
 <Label x={435} y={465} title="The Great Hall" subtitle="MY STORY" room="about" onVisit={onVisit}/>
 <Label x={1210} y={230} title="Astronomy Tower" subtitle="RESEARCH" room="research" onVisit={onVisit} width={166}/>
 <Label x={1200} y={535} title="The Library" subtitle="NOTES & WRITING" room="writing" onVisit={onVisit} width={172}/>
 <Label x={755} y={750} title="Common Room" subtitle="BEYOND THE WORK" room="beyond" onVisit={onVisit} width={117}/>
 {routes.map((p,i)=><Wanderer key={p.name} person={p} index={i} onVisit={onVisit}/>)}
 </svg>
}
