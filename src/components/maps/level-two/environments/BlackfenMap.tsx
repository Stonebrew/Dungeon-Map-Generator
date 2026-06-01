import { blackfenTheme } from '../themes';
import { LevelTwoConnectionApron, LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoMoss, LevelTwoRoomNumbers, LevelTwoRoomShell, LevelTwoRubble, LevelTwoWater } from '../shared';
import type { LevelTwoMapTheme, LevelTwoRendererProps } from '../types';

function LevelTwoDampPatch({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.62">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.2} ${y - h * 0.36} ${x + w * 0.72} ${y - h * 0.18} ${x + w} ${y + h / 2} C${x + w * 0.68} ${y + h * 1.18} ${x + w * 0.28} ${y + h * 1.05} ${x} ${y + h / 2} Z`} fill={theme.water} opacity="0.38" />
      <path d={`M${x + 8} ${y + h / 2} C${x + w * 0.32} ${y + 3} ${x + w * 0.66} ${y + h - 3} ${x + w - 8} ${y + h / 2}`} stroke="#b8d8cf" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.3" />
    </g>
  );
}

function LevelTwoThresholdStones({ x, y, w = 64, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      {Array.from({ length: 4 }).map((_, index) => (
        <rect key={index} x={index * (w / 4)} y="-5" width={w / 4 - 2} height="10" rx="2" fill={theme.wallMid} stroke={theme.wallStroke} strokeWidth="1" />
      ))}
      <path d={`M4 -1 H${w - 6}`} stroke={theme.wallHighlight} strokeWidth="1.1" opacity="0.48" />
    </g>
  );
}

function LevelTwoOldShrineMark({ x, y, theme }: { x: number; y: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.72">
      <circle cx={x} cy={y} r="19" fill="none" stroke={theme.brass} strokeWidth="2" opacity="0.48" />
      <path d={`M${x} ${y - 15} V${y + 15} M${x - 12} ${y - 1} H${x + 12}`} stroke={theme.brass} strokeWidth="2" opacity="0.52" />
      <path d={`M${x - 20} ${y + 14} C${x - 5} ${y + 4} ${x + 8} ${y + 28} ${x + 22} ${y + 12}`} stroke={theme.water} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.28" />
    </g>
  );
}

function LevelTwoBarrierMark({ x, y, w = 48, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.75">
      <rect x="-4" y="-14" width="8" height="28" rx="2" fill={theme.metal} stroke="#171b18" strokeWidth="1.4" />
      <rect x={w - 4} y="-14" width="8" height="28" rx="2" fill={theme.metal} stroke="#171b18" strokeWidth="1.4" />
      <path d={`M0 -5 H${w} M0 6 H${w}`} stroke={theme.brass} strokeWidth="4" strokeLinecap="round" />
      <path d={`M6 -5 l12 11 M26 -5 l12 11`} stroke="#4a3826" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

export function LevelTwoBlackfenRenderer({ connections, secretStroke, isPlayer, presentation = 'screen', showLabels = true }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 130, y: 130, label: '1' },
    { x: 306, y: 122, label: '2' },
    { x: 149, y: 268, label: '3' },
    { x: 290, y: 265, label: '4' },
    { x: 457, y: 242, label: '5' },
    { x: 487, y: 99, label: '6' },
    { x: 147, y: 386, label: '7' },
    { x: 435, y: 378, label: '8' },
    { x: 606, y: 279, label: '9' },
  ];
  const footprintPath = 'M50 74 H212 V136 H292 V82 H424 V172 H548 V214 H672 V352 H520 V426 H360 V414 H226 V438 H70 V328 H48 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-blackfen-footprint" path={footprintPath} theme={blackfenTheme} presentation={presentation}>
        <path d="M70 308 C154 282 242 310 314 288 S464 248 554 278" stroke={blackfenTheme.water} strokeWidth="26" strokeLinecap="round" fill="none" opacity="0.13" />
        <path d="M92 158 C132 146 168 156 204 142 M392 102 C440 82 490 92 526 76 M86 408 C138 428 184 420 224 396" stroke={blackfenTheme.moss} strokeWidth="10" strokeDasharray="2 14" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M52 76 H204 M244 80 H424 M438 58 H536 M82 350 H214 M374 340 H496 M558 220 H652" stroke="#111612" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.1" strokeDasharray="38 20" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={blackfenTheme} presentation={presentation} />
      <LevelTwoDampPatch x={86} y={136} w={82} h={22} theme={blackfenTheme} />
      <LevelTwoDampPatch x={98} y={394} w={70} h={18} theme={blackfenTheme} />
      <LevelTwoDampPatch x={408} y={268} w={82} h={24} theme={blackfenTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={70} y={88} w={120} h={84} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={246} y={78} w={120} h={88} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={84} y={222} w={130} h={92} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={238} y={224} w={104} h={82} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={386} y={186} w={142} h={112} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={438} y={58} w={98} h={82} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={84} y={350} w={126} h={72} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={374} y={340} w={122} h={76} theme={blackfenTheme} variant="blackfen" presentation={presentation} />
      <LevelTwoRoomShell x={560} y={220} w={92} h={118} theme={blackfenTheme} final variant="blackfen" presentation={presentation} />
      <g>
        <LevelTwoWater x={88} y={140} w={78} h={16} theme={blackfenTheme} />
        <LevelTwoWater x={100} y={394} w={64} h={12} theme={blackfenTheme} />
        <LevelTwoMoss x={262} y={134} scale={0.75} theme={blackfenTheme} />
        <LevelTwoMoss x={396} y={278} scale={0.52} theme={blackfenTheme} />
        <LevelTwoOldShrineMark x={456} y={244} theme={blackfenTheme} />
        <LevelTwoBarrierMark x={92} y={118} w={56} theme={blackfenTheme} />
        <LevelTwoThresholdStones x={238} y={265} w={46} theme={blackfenTheme} />
        <LevelTwoThresholdStones x={374} y={386} w={54} theme={blackfenTheme} />
        <LevelTwoRubble x={396} y={386} scale={0.54} theme={blackfenTheme} />
        <LevelTwoRubble x={584} y={260} scale={0.5} theme={blackfenTheme} />
        <LevelTwoDebris x={112} y={392} fill="#4e5948" />
        <LevelTwoDebris x={474} y={96} fill="#4e5948" />
        <LevelTwoCrack x={584} y={260} scale={0.72} stroke="#26352e" />
        <LevelTwoCrack x={414} y={386} scale={0.68} stroke="#26352e" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={174} y={106} label="T" presentation={presentation} />
          <LevelTwoMarker x={508} y={202} label="H" presentation={presentation} />
          <LevelTwoMarker x={633} y={238} label="B" presentation={presentation} />
        </>
      )}
      {showLabels && <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />}
    </>
  );
}

