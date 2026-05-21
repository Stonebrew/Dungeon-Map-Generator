import { laboratoryTheme } from '../themes';
import { LevelTwoConnectionApron, LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoRoomNumbers, LevelTwoRoomShell, LevelTwoRubble } from '../shared';
import type { LevelTwoMapTheme, LevelTwoRendererProps } from '../types';

function LevelTwoArcaneCircle({ x, y, r = 26, theme }: { x: number; y: number; r?: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.82">
      <circle cx={x} cy={y} r={r} fill="none" stroke={theme.runeGlow} strokeWidth="2.2" opacity="0.55" />
      <circle cx={x} cy={y} r={r * 0.58} fill="none" stroke="#ead9ff" strokeWidth="1.4" opacity="0.35" />
      <path d={`M${x - r * 0.72} ${y + r * 0.42} L${x} ${y - r * 0.68} L${x + r * 0.72} ${y + r * 0.42} Z`} stroke={theme.runeGlow} strokeWidth="1.4" fill="none" opacity="0.46" />
      <path d={`M${x - r} ${y} H${x + r} M${x} ${y - r} V${y + r}`} stroke="#f1ddff" strokeWidth="1" opacity="0.22" />
    </g>
  );
}

function LevelTwoWorkbench({ x, y, w = 58, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84" filter="url(#markerInk)">
      <rect x="0" y="0" width={w} height="18" rx="3" fill="#5a3928" stroke="#241912" strokeWidth="2" />
      <path d={`M8 6 H${w - 8} M12 18 V28 M${w - 12} 18 V28`} stroke="#2c1d15" strokeWidth="2" opacity="0.62" />
      <path d={`M${w * 0.35} 3 h10 M${w * 0.62} 13 h8`} stroke={theme.brass} strokeWidth="1.5" opacity="0.62" />
    </g>
  );
}

function LevelTwoGearMark({ x, y, r = 15, theme }: { x: number; y: number; r?: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.72">
      <circle cx={x} cy={y} r={r} fill="none" stroke={theme.metal} strokeWidth="2.6" />
      <circle cx={x} cy={y} r={r * 0.36} fill={theme.metal} opacity="0.38" />
      {[0, 45, 90, 135].map((angle) => (
        <path key={angle} d={`M${x} ${y - r - 7} V${y - r}`} stroke={theme.metal} strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${angle} ${x} ${y})`} />
      ))}
    </g>
  );
}

function LevelTwoScorchStain({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.56">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.18} ${y - h * 0.5} ${x + w * 0.78} ${y - h * 0.2} ${x + w} ${y + h / 2} C${x + w * 0.72} ${y + h * 1.2} ${x + w * 0.24} ${y + h * 1.1} ${x} ${y + h / 2} Z`} fill={theme.scorch} opacity="0.48" />
      <path d={`M${x + 10} ${y + h / 2} C${x + w * 0.38} ${y + 2} ${x + w * 0.64} ${y + h - 2} ${x + w - 8} ${y + h / 2}`} stroke={theme.residue} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.36" />
    </g>
  );
}

function LevelTwoConduit({ x, y, w = 80, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 H${w}`} stroke={theme.metal} strokeWidth="8" strokeLinecap="round" />
      <path d={`M4 -2 H${w - 4}`} stroke={theme.brass} strokeWidth="2" strokeLinecap="round" opacity="0.64" />
      <path d={`M12 2 H${w - 12}`} stroke={theme.runeGlow} strokeWidth="1.4" strokeLinecap="round" opacity="0.44" strokeDasharray="3 9" />
    </g>
  );
}

function LevelTwoBrokenApparatus({ x, y, theme, rotate = 0 }: { x: number; y: number; theme: LevelTwoMapTheme; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.82">
      <rect x="-18" y="-8" width="24" height="16" rx="3" fill={theme.metal} stroke="#171412" strokeWidth="1.8" />
      <circle cx="14" cy="-2" r="8" fill="none" stroke={theme.brass} strokeWidth="2" />
      <path d="M-12 0 h11 M9 8 l12 8 M9 -8 l14 -9" stroke="#191513" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 -2 l8 -4" stroke={theme.runeGlow} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

function LevelTwoWorkZoneRail({ path, theme }: { path: string; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.74">
      <path d={path} stroke="#171414" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={path} stroke={theme.metal} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={path} stroke={theme.brass} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.62" strokeDasharray="8 9" />
    </g>
  );
}

function LevelTwoContainmentCell({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.78">
      <rect x={x} y={y} width={w} height={h} rx="8" fill="none" stroke={theme.runeGlow} strokeWidth="2.2" opacity="0.48" strokeDasharray="10 7" />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx="5" fill="none" stroke={theme.metal} strokeWidth="2.2" opacity="0.55" />
      <path d={`M${x + w / 2} ${y + 8} V${y + h - 8} M${x + 8} ${y + h / 2} H${x + w - 8}`} stroke={theme.brass} strokeWidth="1.4" opacity="0.46" />
    </g>
  );
}

export function LevelTwoLaboratoryRenderer({ connections, secretStroke, isPlayer, presentation = 'screen' }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 145, y: 133, label: '1' },
    { x: 350, y: 109, label: '2' },
    { x: 569, y: 151, label: '3' },
    { x: 160, y: 332, label: '4' },
    { x: 370, y: 348, label: '5' },
    { x: 586, y: 344, label: '6' },
  ];
  const footprintPath = 'M58 84 H244 V48 H450 V82 H646 V222 H604 V428 H292 V394 H76 V260 H58 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-laboratory-footprint" path={footprintPath} theme={laboratoryTheme} presentation={presentation}>
        <path d="M110 112 H430 M350 72 V394 M510 120 H628 M98 356 H626" stroke={laboratoryTheme.brass} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.12" strokeDasharray="28 18" />
        <path d="M240 94 C310 58 404 66 484 106 M244 376 C334 414 442 404 536 368" stroke={laboratoryTheme.runeGlow} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.16" strokeDasharray="5 18" />
        <path d="M72 246 H238 M430 252 H642 M246 180 V390" stroke="#171414" strokeWidth="7" strokeLinecap="round" opacity="0.1" strokeDasharray="42 24" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={laboratoryTheme} presentation={presentation} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={laboratoryTheme} variant="laboratory" presentation={presentation} />
      <LevelTwoWorkZoneRail path="M146 132 H350 H570" theme={laboratoryTheme} />
      <LevelTwoWorkZoneRail path="M160 332 H370 H586" theme={laboratoryTheme} />
      <LevelTwoWorkZoneRail path="M350 158 C326 226 340 282 370 302" theme={laboratoryTheme} />
      <LevelTwoRoomShell x={74} y={92} w={142} h={82} theme={laboratoryTheme} variant="laboratory" presentation={presentation} />
      <LevelTwoRoomShell x={274} y={60} w={152} h={98} theme={laboratoryTheme} variant="laboratory" presentation={presentation} />
      <LevelTwoRoomShell x={506} y={96} w={126} h={110} theme={laboratoryTheme} variant="laboratory" presentation={presentation} />
      <LevelTwoRoomShell x={92} y={284} w={136} h={96} theme={laboratoryTheme} variant="laboratory" presentation={presentation} />
      <LevelTwoRoomShell x={306} y={302} w={128} h={92} theme={laboratoryTheme} variant="laboratory" presentation={presentation} />
      <LevelTwoRoomShell x={520} y={286} w={132} h={116} theme={laboratoryTheme} final variant="laboratory" presentation={presentation} />
      <g>
        <LevelTwoWorkbench x={98} y={108} theme={laboratoryTheme} />
        <LevelTwoWorkbench x={106} y={354} w={64} theme={laboratoryTheme} />
        <LevelTwoArcaneCircle x={350} y={110} r={29} theme={laboratoryTheme} />
        <LevelTwoArcaneCircle x={586} y={344} r={31} theme={laboratoryTheme} />
        <LevelTwoContainmentCell x={530} y={112} w={78} h={74} theme={laboratoryTheme} />
        <LevelTwoContainmentCell x={546} y={306} w={80} h={72} theme={laboratoryTheme} />
        <LevelTwoGearMark x={582} y={154} theme={laboratoryTheme} />
        <LevelTwoGearMark x={372} y={348} r={13} theme={laboratoryTheme} />
        <LevelTwoConduit x={300} y={82} w={96} theme={laboratoryTheme} />
        <LevelTwoConduit x={536} y={318} w={76} rotate={90} theme={laboratoryTheme} />
        <LevelTwoScorchStain x={324} y={132} w={62} h={22} theme={laboratoryTheme} />
        <LevelTwoScorchStain x={544} y={354} w={68} h={26} theme={laboratoryTheme} />
        <LevelTwoBrokenApparatus x={410} y={330} theme={laboratoryTheme} rotate={-10} />
        <LevelTwoDebris x={122} y={142} fill="#4d4337" />
        <LevelTwoDebris x={328} y={370} fill="#4d4337" />
        <LevelTwoRubble x={526} y={188} scale={0.48} theme={laboratoryTheme} />
        <LevelTwoCrack x={320} y={364} scale={0.72} stroke="#3a302a" />
        <LevelTwoCrack x={540} y={310} scale={0.7} stroke="#3a302a" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={410} y={82} label="H" presentation={presentation} />
          <LevelTwoMarker x={420} y={324} label="T" presentation={presentation} />
          <LevelTwoMarker x={636} y={314} label="B" presentation={presentation} />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />
    </>
  );
}
