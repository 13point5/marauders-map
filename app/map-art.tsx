'use client';
import { useId, useEffect, useRef } from 'react';

export type Room = 'about'|'research'|'writing'|'contact'|'beyond';
const motto='OMNIBVS MARAVDENTIBVS BONVM AVDERE EST MARAVDERE · ';
function Ink({d,words=motto,size=10,script=false,opacity=1}:{d:string;words?:string;size?:number;script?:boolean;opacity?:number}){
 const id=useId().replaceAll(':','');
 return <g opacity={opacity}><defs><path id={id} d={d}/></defs><text className={script?'ink-script':'ink'} fontSize={size}><textPath href={`#${id}`}>{words.repeat(18)}</textPath></text></g>;
}
function Rectangle({x,y,w,h,words=motto}:{x:number;y:number;w:number;h:number;words?:string}){return <g>{[0,12].map(n=><Ink key={n} d={`M${x+n} ${y+n}H${x+w-n}V${y+h-n}H${x+n}Z`} words={words} size={10}/>)}</g>}
function Tower({x,y,r,words=motto}:{x:number;y:number;r:number;words?:string}){return <g>{[0,14,27].map((n)=><Ink key={n} d={`M${x-r+n} ${y}a${r-n} ${r-n} 0 1 1 ${2*(r-n)} 0a${r-n} ${r-n} 0 1 1 ${-2*(r-n)} 0`} words={words} size={n===14?8:11} script={n===14}/>)}{Array.from({length:12},(_,i)=><text key={i} transform={`translate(${x} ${y}) rotate(${i*30})`} x={r-48} y={0} className="ink" fontSize="8">IIIII</text>)}</g>}
function RoomLabel({x,y,title,subtitle,room,onVisit}:{x:number;y:number;title:string;subtitle:string;room:Room;onVisit:(r:Room)=>void}){return <g className="room-link" role="button" tabIndex={0} aria-label={`Visit ${title}: ${subtitle}`} onClick={()=>onVisit(room)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onVisit(room)}}}>
 <rect className="room-hit" x={x-100} y={y-44} width="200" height="96" rx="45"/>
 <text x={x} y={y-9} className="room-title" textAnchor="middle">{title}</text><text x={x} y={y+17} className="room-subtitle" textAnchor="middle">{subtitle} ↗</text><text x={x} y={y+38} textAnchor="middle" className="room-star">✧</text>
 </g>}
const routes=[
 {name:'Sriraam',room:'about' as Room,path:'M460 425 L570 425 Q595 425 595 455 L595 580 Q595 610 630 610 L940 610 Q980 610 980 565 L980 345 Q980 310 945 310 L580 310 Q550 310 550 345 L550 395 Q550 425 515 425 Z',duration:62},
 {name:'Hermione Granger',room:'writing' as Room,path:'M1130 470 L1020 470 L1020 280 Q1020 250 980 250 L800 250 Q775 250 775 280 L775 300 L980 300 Q1020 300 1020 340 L1020 490 L1130 490 Z',duration:48},
 {name:'Harry Potter',room:'research' as Room,path:'M600 650 L600 710 Q600 740 635 740 L925 740 Q970 740 970 690 L970 660 L1150 660 L1150 640 L940 640 L940 690 Q940 720 910 720 L640 720 Q620 720 620 690 L620 650 Z',duration:55},
 {name:'Luna Lovegood',room:'beyond' as Room,path:'M380 500 L300 500 Q250 500 250 540 L250 640 Q250 680 300 680 L450 680 L450 660 L300 660 Q275 660 275 630 L275 550 Q275 525 315 525 L380 525 Z',duration:45},
];
function Wanderer({person,index,onVisit}:{person:typeof routes[number];index:number;onVisit:(r:Room)=>void}){return <g className="wanderer">
 {Array.from({length:9},(_,i)=><g key={i} opacity={(9-i)/15}><animateMotion dur={`${person.duration}s`} repeatCount="indefinite" path={person.path} rotate="auto" begin={`${-index*8+i*.6-7}s`}/><g transform={`translate(0 ${i%2?5:-5}) rotate(90)`}><ellipse cy="-2" rx="2" ry="4"/><ellipse cy="4" rx="1.8" ry="1.5"/></g></g>)}
 <g className="person-marker" role="button" tabIndex={0} aria-label={`Follow ${person.name}`} onClick={()=>onVisit(person.room)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onVisit(person.room)}}}>
 <animateMotion dur={`${person.duration}s`} repeatCount="indefinite" path={person.path} begin={`${-index*8-7}s`}/><rect x="-64" y="-31" width="128" height="25"/><text y="-14" textAnchor="middle">{person.name}</text><path d="M-4 -6 0 0 4 -6" fill="none" stroke="currentColor"/>
 </g></g>}
export default function MapArt({onVisit,paused}:{onVisit:(r:Room)=>void;paused:boolean}){
 const ref=useRef<SVGSVGElement>(null);
 useEffect(()=>{if(paused)ref.current?.pauseAnimations();else ref.current?.unpauseAnimations()},[paused]);
 return <svg ref={ref} viewBox="0 0 1500 900" className="map-art" aria-label="A map of Sriraam’s world, with rooms and corridors formed from letters">
 <g className="map-lines">
 <Ink d="M45 35H1455V860H45Z" words="MESSRS MOONY WORMTAIL PADFOOT & PRONGS ARE PROUD TO PRESENT · " size={13}/>
 <Ink d="M60 51H1440V845H60Z" size={8}/>
 <text className="cartouche-small" x="750" y="92" textAnchor="middle">MESSRS MOONY, WORMTAIL, PADFOOT & PRONGS</text>
 <text className="map-heading" x="750" y="135" textAnchor="middle">The Marauder’s Map</text>
 <text className="ink-script" x="750" y="162" textAnchor="middle" fontSize="16">a rather curious guide to the world of Sriraam</text>
 <Ink d="M395 270H680V215H880V300H1090V430H1400" words="Passage to the unknown · Follow your curiosity · " size={13} script/>
 <Ink d="M395 293H655V239H856V324H1067V452H1400" size={9}/>
 <Ink d="M340 440H565V575H930V360H1070" words="Omnibus Maraudentibus Bonum · " size={13} script/>
 <Ink d="M340 464H540V600H955V335H1070" size={10}/>
 <Ink d="M150 370V484H325V600H480V800H600" size={11}/>
 <Ink d="M174 370V460H350V576H505V775H600" words="Curiositas · Scientia · Magia · " size={12} script/>
 <Ink d="M90 714H370V735H555V674H1010V786H1385V660H1290" size={12}/>
 <Ink d="M90 738H345V759H578V698H986V810H1410V636H1290" words="Beware of moving staircases · " size={12} script/>
 <Ink d="M1000 550H1080V597H1320V735" size={12}/>
 <Ink d="M1000 575H1055V622H1295V735" size={10}/>
 <Ink d="M305 150H390V240H475" size={10}/><Ink d="M305 175H365V263H475" size={10}/>
 <Tower x={195} y={222} r={119} words="THE OWLERY · CORRESPONDENCE · "/>
 <Tower x={1170} y={233} r={135} words="ASTRONOMIA · MUNDI EXEMPLARIA · SCIENTIA · "/>
 <Tower x={760} y={747} r={82} words="A ROOM OF ONE’S OWN · "/>
 <Rectangle x={380} y={335} w={165} h={190} words="HOGWARTS GREAT HALL · LEARNING · "/>
 <Rectangle x={1090} y={445} w={240} h={154} words="BIBLIOTHECA · VERBA VOLANT SCRIPTA MANENT · "/>
 <Rectangle x={115} y={520} w={150} h={140} words="MYSTERIVM · "/>
 <Rectangle x={380} y={95} w={140} h={112}/>
 <Rectangle x={1350} y={285} w={62} h={110}/>
 <Rectangle x={72} y={360} w={80} h={86}/>
 <Rectangle x={605} y={210} w={48} h={62}/>
 <Rectangle x={875} y={180} w={80} h={95}/>
 <Rectangle x={1010} y={730} w={110} h={56}/>
 {Array.from({length:5},(_,i)=><Rectangle key={i} x={590+i*79} y={620} w={65} h={36} words="MEMORIA · "/>)}
 {Array.from({length:4},(_,i)=><Rectangle key={i} x={1337} y={458+i*39} w={69} h={30} words="LIBRI · "/>)}
 {Array.from({length:6},(_,i)=><Ink key={i} d={`M590 ${340+i*12}H900`} words="Omnibus Maraudentibus Bonum · " size={12} script/>)}
 {Array.from({length:4},(_,i)=><Ink key={i} d={`M590 ${542+i*11}H900`} words="Bonum A udere est Maraudere · " size={11} script/>)}
 <Rectangle x={616} y={400} w={280} h={135} words="AVDERE EST FACERE · "/>
 <rect x="643" y="425" width="226" height="83" fill="#713425"/>
 <text className="personal-name" x="756" y="461" textAnchor="middle">SRIRAAM</text><text className="personal-caption" x="756" y="487" textAnchor="middle">RESEARCHER & PERPETUAL LEARNER</text>
 <text x="446" y="150" textAnchor="middle" className="ink-script" fontSize="14">Room of</text><text x="446" y="170" textAnchor="middle" className="ink" fontSize="13">REQUIREMENT</text>
 <text transform="translate(93 646) rotate(-90)" className="map-note">Keep an eye out for ghosts</text>
 <text x="950" y="845" className="map-note">Beware moving staircases</text>
 <text x="390" y="567" className="map-note" transform="rotate(-7 390 567)">You are not lost. Just curious.</text>
 <text x="187" y="580" className="ink-script" textAnchor="middle" fontSize="14">The Restricted</text><text x="187" y="600" className="ink" textAnchor="middle" fontSize="14">Section</text>
 <RoomLabel x={195} y={222} title="The Owlery" subtitle="LET’S TALK" room="contact" onVisit={onVisit}/>
 <RoomLabel x={463} y={423} title="The Great Hall" subtitle="MY STORY" room="about" onVisit={onVisit}/>
 <RoomLabel x={1170} y={233} title="Astronomy Tower" subtitle="RESEARCH" room="research" onVisit={onVisit}/>
 <RoomLabel x={1210} y={519} title="The Library" subtitle="NOTES & WRITING" room="writing" onVisit={onVisit}/>
 <RoomLabel x={760} y={749} title="Common Room" subtitle="BEYOND THE WORK" room="beyond" onVisit={onVisit}/>
 <text x="1330" y="99" className="compass" textAnchor="middle">N</text><path d="M1330 110v90m-42-45h84m-64-23 44 44m-44 0 44-44" stroke="currentColor" strokeWidth=".7" fill="none"/><text x="1330" y="171" textAnchor="middle" className="compass" fontSize="37">✧</text>
 </g>
 {routes.map((p,i)=><Wanderer key={p.name} person={p} index={i} onVisit={onVisit}/>)}
 </svg>
}
