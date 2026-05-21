import { sewerTheme } from '../themes';
import { LevelTwoConnectionApron, LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoMoss, LevelTwoRoomNumbers, LevelTwoRoomShell, LevelTwoRubble } from '../shared';
import type { LevelTwoMapTheme, LevelTwoRendererProps } from '../types';

function LevelTwoDrainGrate({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.86" filter="url(#markerInk)">
      <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#1d2422" stroke="#0c1110" strokeWidth="2" />
      {[-10, -4, 2, 8].map((offset) => (
        <path key={offset} d={`M${offset} -7 V7`} stroke="#66706a" strokeWidth="1.5" opacity="0.75" />
      ))}
      <path d="M-14 -4 H14 M-14 4 H14" stroke="#0d1110" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

function LevelTwoPipeSegment({ x, y, w = 70, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 H${w}`} stroke={theme.metal} strokeWidth="10" strokeLinecap="round" />
      <path d={`M5 -3 H${w - 5}`} stroke="#7a817d" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
      {[16, w - 18].map((offset) => (
        <rect key={offset} x={offset - 3} y="-7" width="6" height="14" rx="2" fill="#202625" stroke="#101514" strokeWidth="1" />
      ))}
    </g>
  );
}

function LevelTwoSludgeStain({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.58">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.22} ${y - h * 0.35} ${x + w * 0.72} ${y + h * 1.35} ${x + w} ${y + h / 2} C${x + w * 0.72} ${y + h * 0.9} ${x + w * 0.24} ${y + h * 0.86} ${x} ${y + h / 2} Z`} fill={theme.sludge} opacity="0.45" />
      <path d={`M${x + 9} ${y + h / 2} C${x + w * 0.38} ${y + 2} ${x + w * 0.62} ${y + h - 2} ${x + w - 9} ${y + h / 2}`} stroke="#8b8f54" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.36" />
    </g>
  );
}

function LevelTwoRunoffMarks({ x, y, w, vertical = false, theme }: { x: number; y: number; w: number; vertical?: boolean; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.46">
      {[0, 11, 22].map((offset) => (
        <path key={offset} d={vertical ? `M${x + offset} ${y} C${x + offset - 4} ${y + w * 0.36} ${x + offset + 5} ${y + w * 0.66} ${x + offset} ${y + w}` : `M${x} ${y + offset} C${x + w * 0.36} ${y + offset - 4} ${x + w * 0.66} ${y + offset + 5} ${x + w} ${y + offset}`} stroke={theme.water} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
}

export function LevelTwoSewerRenderer({ connections, secretStroke, isPlayer, presentation = 'screen' }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 112, y: 238, label: '1' },
    { x: 280, y: 238, label: '2' },
    { x: 156, y: 112, label: '3' },
    { x: 416, y: 238, label: '4' },
    { x: 536, y: 371, label: '5' },
    { x: 626, y: 235, label: '6' },
  ];
  const footprintPath = 'M34 184 H226 V62 H230 V184 H484 V168 H696 V304 H636 V424 H456 V310 H344 V292 H204 V300 H42 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-sewer-footprint" path={footprintPath} theme={sewerTheme} presentation={presentation}>
        <path d="M52 240 H674 M156 84 V286 M280 204 V386 M416 170 V286 M536 254 V410" stroke={sewerTheme.water} strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M56 220 H672 M156 88 V274 M280 214 V374 M416 180 V280 M536 264 V398" stroke="#92a077" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.22" strokeDasharray="18 16" />
        <path d="M44 186 H230 M230 202 H482 M482 184 H682 M458 312 H634 M42 290 H344" stroke="#151d1a" strokeWidth="6" strokeLinecap="round" opacity="0.12" strokeDasharray="52 26" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={sewerTheme} presentation={presentation} />
      <LevelTwoSludgeStain x={78} y={248} w={70} h={24} theme={sewerTheme} />
      <LevelTwoSludgeStain x={236} y={250} w={84} h={22} theme={sewerTheme} />
      <LevelTwoSludgeStain x={468} y={374} w={88} h={24} theme={sewerTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={sewerTheme} variant="sewer" presentation={presentation} />
      <LevelTwoRoomShell x={58} y={196} w={108} h={84} theme={sewerTheme} variant="sewer" presentation={presentation} />
      <LevelTwoRoomShell x={220} y={196} w={120} h={84} theme={sewerTheme} variant="sewer" presentation={presentation} />
      <LevelTwoRoomShell x={96} y={74} w={120} h={76} theme={sewerTheme} variant="sewer" presentation={presentation} />
      <LevelTwoRoomShell x={358} y={194} w={116} h={88} theme={sewerTheme} variant="sewer" presentation={presentation} />
      <LevelTwoRoomShell x={468} y={330} w={136} h={82} theme={sewerTheme} variant="sewer" presentation={presentation} />
      <LevelTwoRoomShell x={570} y={178} w={112} h={114} theme={sewerTheme} final variant="sewer" presentation={presentation} />
      <g>
        <LevelTwoPipeSegment x={78} y={214} w={62} theme={sewerTheme} />
        <LevelTwoPipeSegment x={242} y={210} w={74} theme={sewerTheme} />
        <LevelTwoPipeSegment x={598} y={270} w={58} rotate={90} theme={sewerTheme} />
        <LevelTwoDrainGrate x={386} y={258} />
        <LevelTwoDrainGrate x={624} y={244} rotate={90} />
        <LevelTwoDrainGrate x={536} y={378} />
        <LevelTwoRunoffMarks x={78} y={252} w={66} theme={sewerTheme} />
        <LevelTwoRunoffMarks x={494} y={346} w={52} vertical theme={sewerTheme} />
        <LevelTwoMoss x={130} y={132} scale={0.52} theme={sewerTheme} />
        <LevelTwoMoss x={478} y={258} scale={0.46} theme={sewerTheme} />
        <LevelTwoRubble x={354} y={218} scale={0.52} theme={sewerTheme} />
        <LevelTwoDebris x={246} y={264} fill="#43493f" />
        <LevelTwoDebris x={584} y={206} fill="#43493f" />
        <LevelTwoCrack x={112} y={224} scale={0.68} stroke="#26332d" />
        <LevelTwoCrack x={506} y={356} scale={0.72} stroke="#26332d" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={324} y={214} label="H" presentation={presentation} />
          <LevelTwoMarker x={458} y={216} label="T" presentation={presentation} />
          <LevelTwoMarker x={660} y={202} label="B" presentation={presentation} />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />
    </>
  );
}
