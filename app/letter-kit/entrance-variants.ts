import type {Glyph} from './layout';
import {letterBox} from './clearance.ts';
import type {Piece} from './reconstruction';
export type EntranceVariant='quiet'|'lettered'|'stepped';
export const entranceOptions=[
 {id:'quiet' as const,label:'Quiet returns',description:'Recommended: restrained lettering, long pen strokes, small rounded turns.'},
 {id:'lettered' as const,label:'Lettered jambs',description:'More of the entrance is formed by capitals, with shorter connecting strokes.'},
 {id:'stepped' as const,label:'Stepped passage',description:'A deeper folded passage, with capitals marking each return.'}
];
type XY={x:number;y:number};
// A broad nib following straight runs and small, deliberate corner turns.
// Variation is in ink width, not a wobbly/sinusoidal centreline.
export function quillLine(points:number[][],weight=1):string{
 const p=points.map(([x,y])=>({x,y})),samples:XY[]=[];
 const line=(a:XY,b:XY)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/1.5));for(let j=0;j<n;j++){const t=j/n;samples.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t})}};
 let last=p[0];
 for(let i=1;i<p.length-1;i++){
  const a=p[i-1],b=p[i],c=p[i+1],ab=Math.hypot(b.x-a.x,b.y-a.y),bc=Math.hypot(c.x-b.x,c.y-b.y),r=Math.min(6,ab*.18,bc*.18);
  const entry={x:b.x+(a.x-b.x)*r/ab,y:b.y+(a.y-b.y)*r/ab},exit={x:b.x+(c.x-b.x)*r/bc,y:b.y+(c.y-b.y)*r/bc};line(last,entry);
  for(let j=0;j<10;j++){const t=j/10;samples.push({x:(1-t)**2*entry.x+2*(1-t)*t*b.x+t*t*exit.x,y:(1-t)**2*entry.y+2*(1-t)*t*b.y+t*t*exit.y})}last=exit;
 }
 line(last,p.at(-1)!);samples.push(p.at(-1)!);
 const left:XY[]=[],right:XY[]=[];
 samples.forEach((s,i)=>{const a=samples[Math.max(0,i-1)],b=samples[Math.min(samples.length-1,i+1)],length=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;
  const nib=1.2+1.35*Math.abs(nx*.82-ny*.57),pressure=(.92+.08*Math.sin(i/samples.length*Math.PI))*(i===0||i===samples.length-1?.76:1),half=nib*pressure*weight;
  left.push({x:s.x+nx*half,y:s.y+ny*half});right.push({x:s.x-nx*half,y:s.y-ny*half});
 });
 const edge=[...left,...right.reverse()];return edge.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join('')+'Z';
}
type Letter=[id:string,x:number,y:number,angle:number,height:number];
export const designs:Record<EntranceVariant,{letters:Letter[];lines:number[][][]}>= {
 "quiet": {
  "letters": [
   [
    "S",
    642,
    1011,
    55,
    40
   ],
   [
    "M",
    951,
    985,
    -113,
    40
   ],
   [
    "M",
    899,
    984,
    67,
    37
   ]
  ],
  "lines": [
   [
    [
     613,
     972
    ],
    [
     667,
     938
    ],
    [
     706,
     1000
    ],
    [
     657,
     1016
    ]
   ],
   [
    [
     804,
     864
    ],
    [
     771,
     885
    ],
    [
     810,
     950
    ],
    [
     865,
     915
    ],
    [
     887,
     961
    ]
   ],
   [
    [
     913,
     856
    ],
    [
     943,
     909
    ],
    [
     962,
     963
    ]
   ],
   [
    [
     949,
     1009
    ],
    [
     963,
     1035
    ],
    [
     916,
     1062
    ],
    [
     894,
     1012
    ]
   ]
  ]
 },
 "lettered": {
  "letters": [
   [
    "S",
    642,
    1011,
    55,
    40
   ],
   [
    "T",
    688,
    969,
    55,
    40
   ],
   [
    "R",
    916,
    883,
    -113,
    40
   ],
   [
    "A",
    940,
    930,
    -113,
    40
   ],
   [
    "M",
    951,
    990,
    -113,
    40
   ],
   [
    "M",
    899,
    986,
    67,
    37
   ]
  ],
  "lines": [
   [
    [
     613,
     972
    ],
    [
     683,
     953
    ]
   ],
   [
    [
     684,
     986
    ],
    [
     706,
     1000
    ],
    [
     657,
     1016
    ]
   ],
   [
    [
     804,
     864
    ],
    [
     775,
     883
    ],
    [
     812,
     944
    ],
    [
     863,
     914
    ],
    [
     888,
     963
    ]
   ],
   [
    [
     953,
     1014
    ],
    [
     966,
     1040
    ],
    [
     917,
     1067
    ],
    [
     894,
     1014
    ]
   ]
  ]
 },
 "stepped": {
  "letters": [
   [
    "S",
    658,
    1032,
    55,
    40
   ],
   [
    "R",
    936,
    883,
    -113,
    40
   ],
   [
    "M",
    986,
    1021,
    -113,
    40
   ],
   [
    "M",
    939,
    1025,
    67,
    37
   ]
  ],
  "lines": [
   [
    [
     613,
     972
    ],
    [
     655,
     945
    ],
    [
     678,
     981
    ],
    [
     721,
     954
    ],
    [
     759,
     1014
    ],
    [
     673,
     1037
    ]
   ],
   [
    [
     804,
     864
    ],
    [
     776,
     881
    ],
    [
     809,
     935
    ],
    [
     850,
     910
    ],
    [
     877,
     954
    ],
    [
     914,
     931
    ],
    [
     941,
     1002
    ]
   ],
   [
    [
     956,
     896
    ],
    [
     979,
     954
    ],
    [
     998,
     1001
    ]
   ],
   [
    [
     996,
     1045
    ],
    [
     1003,
     1060
    ],
    [
     962,
     1085
    ],
    [
     938,
     1051
    ]
   ]
  ]
 }
};

export function buildEntrance(kit:Glyph[],variant:EntranceVariant):Piece[]{
 const design=designs[variant];
 const letters:Piece[]=design.letters.map(([id,x,y,angle,height])=>{const g=kit.find(g=>g.id===id)!,scale=height/100;return {kind:'doorway',glyph:id,d:g.d,bounds:letterBox(x,y,g.width*scale,height,angle*Math.PI/180,6),transform:`translate(${x} ${y}) rotate(${angle}) scale(${scale}) translate(${-g.width/2} -50)`}});
 return [...design.lines.map(points=>({kind:'doorway' as const,d:quillLine(points)})),...letters];
}
