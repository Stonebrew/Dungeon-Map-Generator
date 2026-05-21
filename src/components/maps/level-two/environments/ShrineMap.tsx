import { shrineTheme } from '../themes';
import { LevelTwoConnectionApron, LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoMoss, LevelTwoRoomNumbers, LevelTwoRoomShell, LevelTwoRubble, LevelTwoRubbleChips, LevelTwoWater } from '../shared';
import type { LevelTwoRendererProps } from '../types';

function LevelTwoStairs({ x, y, w = 58, h = 34 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g opacity="0.82">
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#9f875f" opacity="0.34" />
      {Array.from({ length: 5 }).map((_, index) => (
        <path key={index} d={`M${x + 7} ${y + 6 + index * 5} H${x + w - 7}`} stroke="#4f3d2e" strokeWidth="1.6" opacity="0.65" />
      ))}
    </g>
  );
}

function LevelTwoPillar({ x, y }: { x: number; y: number }) {
  return (
    <g filter="url(#markerInk)">
      <circle cx={x} cy={y} r="13" fill="#c6b28a" stroke="#31271f" strokeWidth="4" />
      <circle cx={x} cy={y} r="5" fill="#efe1bd" opacity="0.72" />
    </g>
  );
}

function LevelTwoAltarMark({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.9">
      <rect x={x - 22} y={y - 12} width="44" height="24" rx="4" fill="#8a6740" stroke="#3a2b20" strokeWidth="2.5" />
      <path d={`M${x} ${y - 18} V${y + 18} M${x - 15} ${y} H${x + 15}`} stroke="#e8d18e" strokeWidth="2.2" opacity="0.7" />
      <circle cx={x} cy={y} r="20" fill="none" stroke="#a77d3c" strokeWidth="1.6" opacity="0.58" />
    </g>
  );
}

function LevelTwoBrokenWallSegment({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.86">
      <rect x="-18" y="-5" width="16" height="10" rx="2" fill="#29231e" />
      <rect x="2" y="-7" width="20" height="13" rx="2" fill="#332b24" />
      <path d="M-12 -1 h7 M7 -2 h10" stroke="#86705a" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

function LevelTwoOpenRuinArea({ path, final = false }: { path: string; final?: boolean }) {
  return (
    <g>
      <path d={path} fill="#221a14" opacity="0.22" transform="translate(4 7)" />
      <path d={path} fill={final ? '#bda477' : '#d3bd91'} opacity="0.82" />
      <path d={path} fill="none" stroke="#31251c" strokeWidth="5" strokeLinejoin="round" opacity="0.42" strokeDasharray="34 18 8 14" />
      <path d={path} fill="none" stroke="#f6ead1" strokeWidth="2" strokeLinejoin="round" opacity="0.28" strokeDasharray="28 20" />
    </g>
  );
}

export function LevelTwoShrineRenderer({ connections, secretStroke, isPlayer, presentation = 'screen' }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 154, y: 216, label: '1' },
    { x: 324, y: 204, label: '2' },
    { x: 480, y: 211, label: '3' },
    { x: 490, y: 348, label: '4' },
    { x: 329, y: 344, label: '5' },
    { x: 167, y: 354, label: '6' },
  ];
  const footprintPath =
    'M70 158 C112 108 206 116 268 128 C342 92 448 116 558 158 C606 206 584 268 554 306 C604 360 562 428 488 444 C396 464 330 426 274 422 C202 452 112 426 72 374 C36 326 50 224 70 158 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-ruin-footprint" path={footprintPath} theme={shrineTheme} presentation={presentation}>
        <path d="M92 172 C156 142 218 150 278 148 M392 140 C470 148 528 174 558 220 M90 378 C150 410 220 400 270 382 M410 420 C478 420 536 398 552 350" stroke="#425f35" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.1" />
        <path d="M106 286 C176 258 238 292 304 270 S438 250 524 286" stroke={shrineTheme.water} strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.1" />
        <path d="M126 154 C210 124 330 132 420 138 C486 144 536 168 566 218 M82 326 C142 404 238 414 314 390 C390 430 500 414 552 342" stroke="#241c16" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.14" strokeDasharray="42 20 16 24" />
        <path d="M142 160 C222 140 332 146 420 152 M108 342 C178 390 250 392 316 366 M412 404 C474 404 524 380 540 338" stroke="#d6bf8d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.14" strokeDasharray="34 28" />
      </LevelTwoFoundation>
      <LevelTwoRubbleChips chips={[{ x: 94, y: 150, r: 7 }, { x: 236, y: 128 }, { x: 540, y: 176, r: 6 }, { x: 566, y: 392 }, { x: 92, y: 414, r: 5 }, { x: 346, y: 430, r: 7 }]} />
      <LevelTwoConnectionApron connections={connections} theme={shrineTheme} presentation={presentation} />
      <path d="M120 148 C184 126 218 152 268 142 C350 120 432 136 526 166 C552 218 528 272 540 318 C548 366 514 408 440 414 C366 424 322 392 264 402 C204 412 144 398 106 360 C82 304 98 224 120 148 Z" fill="#80633e" opacity="0.1" />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={shrineTheme} presentation={presentation} />
      <LevelTwoOpenRuinArea path="M88 178 C126 160 188 166 218 194 L210 252 C170 268 116 260 88 230 Z" />
      <LevelTwoRoomShell x={260} y={150} w={128} h={108} theme={shrineTheme} presentation={presentation} />
      <LevelTwoOpenRuinArea path="M426 176 C456 160 510 168 536 194 L526 248 C492 260 446 250 424 222 Z" />
      <LevelTwoOpenRuinArea path="M436 314 C468 300 528 306 550 334 L534 382 C494 394 450 382 432 354 Z" />
      <LevelTwoRoomShell x={270} y={302} w={118} h={84} theme={shrineTheme} presentation={presentation} />
      <LevelTwoOpenRuinArea path="M118 326 C146 312 198 318 220 346 L204 390 C168 400 128 384 116 356 Z" final />
      <g>
        <LevelTwoAltarMark x={326} y={205} />
        <LevelTwoPillar x={292} y={184} />
        <LevelTwoPillar x={358} y={184} />
        <LevelTwoStairs x={442} y={222} w={62} h={28} />
        <LevelTwoMoss x={102} y={226} scale={0.78} theme={shrineTheme} />
        <LevelTwoMoss x={504} y={356} scale={0.62} theme={shrineTheme} />
        <LevelTwoRubble x={132} y={184} scale={0.82} theme={shrineTheme} />
        <LevelTwoRubble x={292} y={354} scale={0.7} theme={shrineTheme} />
        <LevelTwoBrokenWallSegment x={214} y={318} rotate={-14} />
        <LevelTwoBrokenWallSegment x={424} y={166} rotate={8} />
        <LevelTwoBrokenWallSegment x={96} y={184} rotate={18} />
        <LevelTwoBrokenWallSegment x={536} y={250} rotate={-18} />
        <LevelTwoBrokenWallSegment x={438} y={382} rotate={9} />
        <LevelTwoBrokenWallSegment x={132} y={390} rotate={-8} />
        <LevelTwoWater x={446} y={366} w={72} h={12} theme={shrineTheme} />
        <LevelTwoMoss x={224} y={246} scale={0.52} theme={shrineTheme} />
        <LevelTwoMoss x={386} y={254} scale={0.48} theme={shrineTheme} />
        <LevelTwoRubble x={222} y={294} scale={0.55} theme={shrineTheme} />
        <LevelTwoRubble x={392} y={288} scale={0.5} theme={shrineTheme} />
        <LevelTwoDebris x={162} y={356} />
        <LevelTwoDebris x={512} y={196} />
        <LevelTwoDebris x={240} y={236} />
        <LevelTwoDebris x={402} y={240} />
        <LevelTwoCrack x={282} y={178} scale={0.9} />
        <LevelTwoCrack x={454} y={336} scale={0.78} />
        <LevelTwoCrack x={142} y={374} scale={0.72} />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={366} y={172} label="H" presentation={presentation} />
          <LevelTwoMarker x={528} y={326} label="T" presentation={presentation} />
          <LevelTwoMarker x={202} y={334} label="B" presentation={presentation} />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />
    </>
  );
}
