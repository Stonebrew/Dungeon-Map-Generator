import type { MapConnection } from '../../../../types';
import { forestRuinTheme } from '../themes';
import { LevelTwoConnectionApron, LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoMoss, LevelTwoRoomNumbers, LevelTwoRoomShell, LevelTwoRubble, LevelTwoWater } from '../shared';

function RootTendril({ x, y, w = 80, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 C${w * 0.22} -18 ${w * 0.55} 20 ${w} 0`} stroke="#4a2e1e" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d={`M${w * 0.35} 2 C${w * 0.46} 10 ${w * 0.58} 16 ${w * 0.72} 20`} stroke="#5b3a24" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={`M${w * 0.22} -3 C${w * 0.3} -12 ${w * 0.42} -17 ${w * 0.52} -20`} stroke="#5b3a24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}

function FeyLight({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return (
    <g opacity="0.82">
      <circle cx={x} cy={y} r={r + 9} fill="#98e49a" opacity="0.11" />
      <circle cx={x} cy={y} r={r} fill="#ccffb8" opacity="0.2" />
      <circle cx={x} cy={y} r="2.5" fill="#efffdc" opacity="0.88" />
    </g>
  );
}

function MushroomCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.82">
      {[0, 10, 21].map((offset, index) => (
        <g key={offset}>
          <path d={`M${offset + 4} 16 V8`} stroke="#d8d0b1" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={offset + 4} cy="7" rx={index === 1 ? 6 : 4.5} ry="3.2" fill={index === 1 ? forestRuinTheme.runeGlow : '#c68fd0'} opacity="0.68" />
        </g>
      ))}
    </g>
  );
}

function VineMark({ x, y, w = 70, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.72">
      <path d={`M0 0 C${w * 0.22} -12 ${w * 0.48} 12 ${w} 0`} stroke={forestRuinTheme.moss} strokeWidth="3" strokeLinecap="round" fill="none" />
      {[12, 28, 46, 60].map((offset) => (
        <path key={offset} d={`M${offset} 0 c6 -8 12 -8 17 -2 c-6 6 -12 8 -17 2 Z`} fill="#5f9147" opacity="0.62" />
      ))}
    </g>
  );
}

function StandingStone({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84">
      <path d="M-13 18 L-9 -14 L4 -22 L14 -10 L11 19 Z" fill={forestRuinTheme.wallMid} stroke={forestRuinTheme.wallStroke} strokeWidth="2" />
      <path d="M-5 -8 h10 M-2 5 h8" stroke={forestRuinTheme.runeGlow} strokeWidth="1.5" opacity="0.45" />
    </g>
  );
}

function LeafScatter({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.62">
      <path d={`M${x} ${y} c8 -8 15 -6 19 2 c-8 6 -14 6 -19 -2 Z M${x + 22} ${y + 10} c7 -6 13 -3 15 3 c-7 5 -11 4 -15 -3 Z M${x + 8} ${y + 20} c8 -7 14 -4 17 3 c-7 5 -13 4 -17 -3 Z`} fill="#66853d" />
    </g>
  );
}

export function LevelTwoForestRuinRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 126, y: 246, label: '1' },
    { x: 292, y: 190, label: '2' },
    { x: 476, y: 190, label: '3' },
    { x: 536, y: 347, label: '4' },
    { x: 335, y: 349, label: '5' },
    { x: 166, y: 358, label: '6' },
  ];
  const footprintPath =
    'M48 210 C94 118 194 138 248 122 C330 72 438 110 520 136 C608 166 644 270 606 356 C562 456 430 430 352 426 C268 468 132 442 78 372 C28 306 30 250 48 210 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-forest-ruin-footprint" path={footprintPath} theme={forestRuinTheme}>
        <path d="M72 220 C150 154 218 160 290 150 S446 128 540 176 M82 382 C164 430 252 402 334 384 S506 414 584 340" stroke={forestRuinTheme.moss} strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M100 284 C178 248 240 288 310 260 S458 220 548 270" stroke={forestRuinTheme.water} strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.09" />
        <path d="M78 206 C144 156 222 150 300 134 M420 134 C506 142 574 196 598 278 M96 382 C178 420 258 410 340 386" stroke="#172011" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.13" strokeDasharray="34 22 12 18" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={forestRuinTheme} />
      <path d="M98 206 C166 164 232 172 304 154 C386 136 474 156 546 196 C572 260 548 320 576 358 C496 402 424 386 350 398 C260 418 172 398 108 350 C76 298 78 248 98 206 Z" fill="#41592f" opacity="0.1" />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={forestRuinTheme} />
      <LevelTwoRoomShell x={70} y={202} w={112} h={88} theme={forestRuinTheme} />
      <LevelTwoRoomShell x={232} y={146} w={120} h={88} theme={forestRuinTheme} />
      <LevelTwoRoomShell x={420} y={148} w={112} h={84} theme={forestRuinTheme} />
      <LevelTwoRoomShell x={476} y={306} w={120} h={82} theme={forestRuinTheme} final />
      <LevelTwoRoomShell x={276} y={308} w={118} h={82} theme={forestRuinTheme} />
      <LevelTwoRoomShell x={112} y={322} w={108} h={72} theme={forestRuinTheme} />
      <g>
        <RootTendril x={92} y={226} w={92} rotate={8} />
        <RootTendril x={250} y={218} w={104} rotate={-18} />
        <RootTendril x={448} y={216} w={86} rotate={18} />
        <RootTendril x={300} y={370} w={92} rotate={-6} />
        <VineMark x={118} y={280} w={60} rotate={-10} />
        <VineMark x={430} y={170} w={66} rotate={6} />
        <VineMark x={490} y={366} w={70} rotate={-8} />
        <LevelTwoMoss x={74} y={258} scale={0.62} theme={forestRuinTheme} />
        <LevelTwoMoss x={318} y={168} scale={0.52} theme={forestRuinTheme} />
        <LevelTwoMoss x={506} y={326} scale={0.58} theme={forestRuinTheme} />
        <LevelTwoRubble x={232} y={176} scale={0.58} theme={forestRuinTheme} />
        <LevelTwoRubble x={536} y={370} scale={0.52} theme={forestRuinTheme} />
        <LevelTwoWater x={118} y={372} w={58} h={11} theme={forestRuinTheme} />
        <StandingStone x={476} y={190} rotate={-8} />
        <StandingStone x={172} y={352} rotate={11} />
        <FeyLight x={292} y={190} r={11} />
        <FeyLight x={532} y={346} r={12} />
        <MushroomCluster x={508} y={218} scale={0.72} />
        <MushroomCluster x={142} y={376} scale={0.62} />
        <LeafScatter x={86} y={194} />
        <LeafScatter x={386} y={392} />
        <LevelTwoDebris x={238} y={334} fill="#576843" />
        <LevelTwoDebris x={532} y={174} fill="#576843" />
        <LevelTwoCrack x={262} y={164} scale={0.72} stroke="#34462e" />
        <LevelTwoCrack x={504} y={330} scale={0.7} stroke="#34462e" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={330} y={164} label="H" />
          <LevelTwoMarker x={520} y={326} label="T" />
          <LevelTwoMarker x={188} y={340} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}
