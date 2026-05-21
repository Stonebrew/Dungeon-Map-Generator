import type { MapConnection } from '../../../../types';
import { cryptTheme } from '../themes';
import { LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoDebris, LevelTwoDust, LevelTwoFoundation, LevelTwoMarker, LevelTwoRoomNumbers, LevelTwoRoomShell, LevelTwoRubble } from '../shared';

function LevelTwoSarcophagus({ x, y, w = 56, h = 24 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g filter="url(#markerInk)" opacity="0.9">
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#8b8270" stroke="#2a2520" strokeWidth="2.2" />
      <rect x={x + 7} y={y + 5} width={w - 14} height={h - 10} rx="3" fill="#b3a589" opacity="0.42" />
      <path d={`M${x + w / 2} ${y + 5} V${y + h - 5} M${x + 12} ${y + h / 2} H${x + w - 12}`} stroke="#463a30" strokeWidth="1.7" opacity="0.58" />
    </g>
  );
}

function LevelTwoCarvedLine({ x, y, w, vertical = false }: { x: number; y: number; w: number; vertical?: boolean }) {
  return (
    <g opacity="0.55">
      <path d={vertical ? `M${x} ${y} V${y + w}` : `M${x} ${y} H${x + w}`} stroke="#514538" strokeWidth="5" strokeLinecap="round" />
      <path d={vertical ? `M${x} ${y + 5} V${y + w - 5}` : `M${x + 5} ${y} H${x + w - 5}`} stroke="#c3b493" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" strokeDasharray="8 8" />
    </g>
  );
}

function LevelTwoBurialAlcoves({ x, y, count = 4, vertical = false }: { x: number; y: number; count?: number; vertical?: boolean }) {
  return (
    <g opacity="0.78">
      {Array.from({ length: count }).map((_, index) => {
        const px = vertical ? x : x + index * 28;
        const py = vertical ? y + index * 24 : y;
        return (
          <g key={index}>
            <rect x={px} y={py} width={vertical ? 18 : 22} height={vertical ? 18 : 16} rx="3" fill="#53483c" stroke="#1d1915" strokeWidth="1.8" />
            <path d={`M${px + 4} ${py + 5} H${px + (vertical ? 14 : 18)}`} stroke="#c3b493" strokeWidth="1" opacity="0.42" />
          </g>
        );
      })}
    </g>
  );
}

function LevelTwoPinchedPassage({ path }: { path: string }) {
  return (
    <g opacity="0.78">
      <path d={path} stroke="#120f0d" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d={path} stroke="#5f5549" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d={path} stroke="#c3b493" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" strokeDasharray="6 8" />
    </g>
  );
}

export function LevelTwoCryptRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 360, y: 89, label: '1' },
    { x: 360, y: 215, label: '2' },
    { x: 149, y: 217, label: '3' },
    { x: 571, y: 217, label: '4' },
    { x: 206, y: 365, label: '5' },
    { x: 514, y: 365, label: '6' },
  ];
  const footprintPath = 'M252 38 H468 V148 H646 V286 H594 V424 H420 V398 H300 V424 H126 V286 H74 V148 H252 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-crypt-footprint" path={footprintPath} theme={cryptTheme}>
        <path d="M360 44 V416 M82 216 H638 M196 216 V408 M524 216 V408" stroke="#2c2520" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M360 58 V398 M104 216 H616 M206 224 V392 M514 224 V392" stroke="#b9aa8d" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.2" strokeDasharray="18 14" />
        <path d="M120 132 H600 M120 300 H600" stroke="#211b17" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.08" strokeDasharray="48 24" />
      </LevelTwoFoundation>
      <LevelTwoDust x={114} y={128} w={500} h={24} theme={cryptTheme} />
      <LevelTwoDust x={120} y={302} w={486} h={20} theme={cryptTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={cryptTheme} variant="crypt" />
      <LevelTwoPinchedPassage path="M360 128 V170" />
      <LevelTwoPinchedPassage path="M210 216 H256" />
      <LevelTwoPinchedPassage path="M464 216 H510" />
      <LevelTwoPinchedPassage path="M206 260 V326" />
      <LevelTwoPinchedPassage path="M514 260 V326" />
      <LevelTwoRoomShell x={296} y={50} w={128} h={78} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={256} y={170} w={208} h={90} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={88} y={174} w={122} h={86} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={510} y={174} w={122} h={86} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={136} y={326} w={140} h={78} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={444} y={326} w={140} h={78} theme={cryptTheme} final variant="crypt" />
      <g>
        <LevelTwoSarcophagus x={332} y={103} w={56} h={20} />
        <LevelTwoSarcophagus x={288} y={230} w={52} h={18} />
        <LevelTwoSarcophagus x={380} y={230} w={52} h={18} />
        <LevelTwoSarcophagus x={168} y={378} w={58} h={18} />
        <LevelTwoSarcophagus x={486} y={378} w={58} h={18} />
        <LevelTwoBurialAlcoves x={104} y={184} vertical count={3} />
        <LevelTwoBurialAlcoves x={598} y={184} vertical count={3} />
        <LevelTwoBurialAlcoves x={148} y={334} count={4} />
        <LevelTwoBurialAlcoves x={456} y={334} count={4} />
        <LevelTwoCarvedLine x={310} y={205} w={100} />
        <LevelTwoCarvedLine x={360} y={70} w={46} vertical />
        <LevelTwoCarvedLine x={206} y={336} w={44} vertical />
        <LevelTwoCarvedLine x={514} y={336} w={44} vertical />
        <LevelTwoDust x={280} y={250} w={160} h={14} theme={cryptTheme} />
        <LevelTwoRubble x={116} y={222} scale={0.64} theme={cryptTheme} />
        <LevelTwoRubble x={542} y={204} scale={0.66} theme={cryptTheme} />
        <LevelTwoDebris x={190} y={348} />
        <LevelTwoDebris x={556} y={382} />
        <LevelTwoCrack x={330} y={188} scale={0.82} stroke="#4f463c" />
        <LevelTwoCrack x={528} y={222} scale={0.72} stroke="#4f463c" />
        <LevelTwoCrack x={154} y={224} scale={0.68} stroke="#4f463c" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={190} y={192} label="H" />
          <LevelTwoMarker x={258} y={346} label="T" />
          <LevelTwoMarker x={566} y={346} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}
