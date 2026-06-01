import type { MapConnection } from '../../../../types';
import { frozenRuinTheme } from '../themes';
import { LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoRoomNumbers, LevelTwoRubble, LevelTwoRubbleChips } from '../shared';
import type { LevelTwoRendererProps, MapPresentation } from '../types';

function SnowDrift({ path, opacity = 0.62 }: { path: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <path d={path} fill="#f7ffff" opacity="0.58" />
      <path d={path} fill="none" stroke="#bcdce5" strokeWidth="2" strokeLinejoin="round" opacity="0.42" strokeDasharray="10 11" />
    </g>
  );
}

function FrozenPool({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <path d={`M${cx - rx - 10} ${cy - 4} C${cx - rx * 0.72} ${cy - ry - 12} ${cx - rx * 0.12} ${cy - ry + 2} ${cx + rx * 0.22} ${cy - ry - 8} C${cx + rx * 0.78} ${cy - ry * 0.8} ${cx + rx + 14} ${cy - ry * 0.18} ${cx + rx + 4} ${cy + ry * 0.24} C${cx + rx * 0.56} ${cy + ry + 10} ${cx - rx * 0.2} ${cy + ry + 2} ${cx - rx * 0.82} ${cy + ry * 0.72} C${cx - rx - 18} ${cy + ry * 0.28} ${cx - rx - 10} ${cy - 4} ${cx - rx - 10} ${cy - 4} Z`} fill="#18313e" opacity="0.4" />
      <path d={`M${cx - rx} ${cy - 2} C${cx - rx * 0.68} ${cy - ry} ${cx - rx * 0.18} ${cy - ry * 0.72} ${cx + rx * 0.2} ${cy - ry * 0.86} C${cx + rx * 0.72} ${cy - ry * 0.66} ${cx + rx} ${cy - ry * 0.12} ${cx + rx * 0.9} ${cy + ry * 0.28} C${cx + rx * 0.48} ${cy + ry * 0.88} ${cx - rx * 0.08} ${cy + ry * 0.84} ${cx - rx * 0.7} ${cy + ry * 0.58} C${cx - rx * 0.96} ${cy + ry * 0.22} ${cx - rx} ${cy - 2} ${cx - rx} ${cy - 2} Z`} fill="#a8d9e7" opacity="0.62" />
      <path d={`M${cx - rx * 0.62} ${cy - 4} C${cx - rx * 0.22} ${cy - ry * 0.48} ${cx + rx * 0.26} ${cy - ry * 0.36} ${cx + rx * 0.52} ${cy - 6}`} stroke="#f8ffff" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.2" />
      <path d={`M${cx - rx * 0.7} ${cy} l22 -13 l14 19 l20 -9 l18 18 M${cx - rx * 0.2} ${cy - ry * 0.45} l16 10 l14 -9 l18 13`} stroke="#385f70" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.46" />
    </g>
  );
}

function Crevasse({ path, width = 20 }: { path: string; width?: number }) {
  return (
    <g>
      <path d={path} stroke="#02090d" strokeWidth={width + 12} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48" strokeDasharray="18 8 5 11" />
      <path d={path} stroke="#081922" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.82" />
      <path d={path} stroke="#214352" strokeWidth={width * 0.52} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48" />
      <path d={path} stroke="#a7edff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="8 14" />
      <path d={path} stroke="#f8ffff" strokeWidth={width + 18} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.12" strokeDasharray="5 22 14 18" />
    </g>
  );
}

function IceRouteLayer({ connections, secretStroke, isPlayer, presentation = 'screen' }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean; presentation?: MapPresentation }) {
  const isPrint = presentation === 'print';
  const normalConnections = connections.filter((connection) => connection.type === 'normal' && connection.path);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);

  return (
    <g>
      {normalConnections.map((connection) => {
        const path = connection.path as string;
        const isBridge = connection.routeStyle === 'bridge' || connection.routeStyle === 'causeway';
        const isHazardous = connection.routeDifficulty === 'hazardous' || connection.routeDifficulty === 'unstable';

        return (
          <g key={path}>
            <path d={path} stroke="#0d2029" strokeWidth={isBridge ? '30' : '38'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.2' : '0.28'} />
            <path d={path} stroke={isBridge ? '#9ab9c2' : '#d9edf0'} strokeWidth={isBridge ? '21' : '28'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '1' : '0.92'} />
            <path d={path} stroke={isBridge ? '#f8ffff' : '#9fc8d2'} strokeWidth={isBridge ? '4' : '6'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.38' : '0.54'} strokeDasharray={isBridge ? '12 10' : '18 13'} />
            {isHazardous && <path d={path} stroke="#315565" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.72" strokeDasharray="4 10" />}
          </g>
        );
      })}
      {!isPlayer &&
        secretPaths.map((path) => (
          <g key={path}>
            <path d={path} stroke="#0b2029" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.22" />
            <path d={path} stroke={secretStroke} strokeWidth={isPrint ? '6' : '4.5'} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={isPrint ? '12 7' : '8 8'} opacity={isPrint ? '0.96' : '0.86'} />
          </g>
        ))}
    </g>
  );
}

function IceArea({ path, final = false, exposed = false }: { path: string; final?: boolean; exposed?: boolean }) {
  return (
    <g>
      <path d={path} fill="#0e222b" opacity="0.24" transform="translate(5 8)" />
      <path d={path} fill={final ? '#b7e7f0' : exposed ? '#eaf7f7' : frozenRuinTheme.floorTiles[0]} stroke="#244653" strokeWidth={exposed ? '5' : '8'} strokeLinejoin="round" opacity="0.96" />
      <path d={path} fill="none" stroke="#f8ffff" strokeWidth="2.4" strokeLinejoin="round" opacity="0.64" strokeDasharray="20 13 4 11" />
      <path d={path} fill="none" stroke="#507483" strokeWidth="2.2" strokeLinejoin="round" opacity="0.36" strokeDasharray="8 14" />
    </g>
  );
}

function BuriedReliquaryStone({ x, y, w = 68, h = 26, rotate = 0 }: { x: number; y: number; w?: number; h?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.66">
      <rect x="0" y="0" width={w} height={h} rx="4" fill="#8da1a8" stroke="#304b56" strokeWidth="2" />
      <path d={`M8 ${h / 2} H${w - 8} M${w * 0.5} 5 V${h - 5}`} stroke="#eafcff" strokeWidth="1.3" opacity="0.42" />
      <path d={`M${w * 0.18} 4 l10 8 l-7 9 M${w * 0.7} ${h - 5} l8 -7 l9 7`} stroke="#496a76" strokeWidth="1.2" opacity="0.5" fill="none" />
    </g>
  );
}

function BrokenArchFragment({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.72">
      <path d="M-34 20 C-26 -12 26 -12 34 20" fill="none" stroke="#6f858c" strokeWidth="9" strokeLinecap="round" />
      <path d="M-30 20 C-22 -5 22 -5 30 20" fill="none" stroke="#d8f4fa" strokeWidth="2" strokeLinecap="round" opacity="0.5" strokeDasharray="8 7" />
      <path d="M-36 21 h16 M18 21 h18" stroke="#304b56" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function SealedVaultMark({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.78">
      <circle cx={x} cy={y} r="28" fill="none" stroke="#7bdfff" strokeWidth="2.4" opacity="0.58" />
      <circle cx={x} cy={y} r="15" fill="none" stroke="#f8ffff" strokeWidth="1.4" opacity="0.54" />
      <path d={`M${x - 22} ${y} H${x + 22} M${x} ${y - 22} V${y + 22}`} stroke="#7bdfff" strokeWidth="1.5" opacity="0.44" />
      <path d={`M${x - 18} ${y + 18} L${x} ${y - 22} L${x + 18} ${y + 18}`} stroke="#f8ffff" strokeWidth="1.2" fill="none" opacity="0.42" />
    </g>
  );
}

function FrozenStatue({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84">
      <path d="M-10 18 H12 L8 -10 L0 -22 L-8 -10 Z" fill="#a6bac0" stroke="#304b56" strokeWidth="2" />
      <path d="M-5 -8 H6 M-5 6 H8" stroke="#f4ffff" strokeWidth="1.3" opacity="0.58" />
    </g>
  );
}

function IceCrystals({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.8">
      <path d="M0 16 L8 -10 L16 16 Z M14 15 L24 -2 L30 15 Z M-12 15 L-4 0 L3 15 Z" fill="#c9f4ff" stroke="#5fa7bd" strokeWidth="1.4" />
      <path d="M8 -4 V12 M24 3 V13 M-4 4 V14" stroke="#f8ffff" strokeWidth="1" opacity="0.58" />
    </g>
  );
}

function WindStreaks() {
  return (
    <g opacity="0.32">
      <path d="M72 118 C156 90 238 110 310 88 M412 96 C498 72 574 90 650 64 M62 406 C150 380 236 402 318 372 M430 424 C506 386 586 404 650 372" stroke="#f8ffff" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="32 20" />
      <path d="M96 148 C144 132 198 140 240 126 M476 134 C526 118 572 126 618 112" stroke="#7fb8c9" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="18 15" />
    </g>
  );
}

export function LevelTwoFrozenRuinRenderer({ connections, secretStroke, isPlayer, presentation = 'screen', showLabels = true }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 98, y: 250, label: '1' },
    { x: 252, y: 160, label: '2' },
    { x: 392, y: 242, label: '3' },
    { x: 566, y: 144, label: '4' },
    { x: 560, y: 322, label: '5' },
    { x: 338, y: 378, label: '6' },
    { x: 160, y: 388, label: '7' },
    { x: 468, y: 410, label: '8' },
  ];
  const footprintPath = 'M36 226 C86 126 178 152 234 84 C312 44 400 124 474 86 C562 34 668 104 670 214 C708 300 632 392 540 388 C476 470 370 436 300 444 C210 468 82 442 42 354 C12 302 10 262 36 226 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-frozen-ruin-footprint" path={footprintPath} theme={frozenRuinTheme} presentation={presentation}>
        <path d="M64 246 C142 178 210 150 270 104 M354 236 C430 178 508 136 592 112 M102 400 C210 430 332 402 456 416" stroke="#f5ffff" strokeWidth="40" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M42 300 C124 260 210 304 310 276 S500 226 682 282" stroke="#3f6a7a" strokeWidth="38" strokeLinecap="round" fill="none" opacity="0.14" />
      </LevelTwoFoundation>
      <WindStreaks />
      <Crevasse path="M30 306 C126 260 226 314 326 276 S504 216 688 286" width={22} />
      <Crevasse path="M388 82 C420 158 414 230 390 302 S378 392 450 456" width={12} />
      <FrozenPool cx={382} cy={244} rx={76} ry={48} />
      <FrozenPool cx={560} cy={322} rx={58} ry={38} />
      <IceRouteLayer connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} presentation={presentation} />
      <IceArea path="M44 226 L76 204 L122 210 L160 230 L146 262 L108 286 L62 278 L38 252 Z" exposed />
      <IceArea path="M192 118 L226 90 L276 100 L318 132 L304 168 L262 194 L214 184 L178 144 Z" />
      <IceArea path="M306 194 L352 168 L418 174 L468 220 L458 270 L410 306 L350 300 L292 250 Z" exposed />
      <IceArea path="M506 100 L548 74 L612 86 L646 124 L632 166 L586 194 L534 184 L492 134 Z" />
      <IceArea path="M506 280 L548 252 L606 270 L632 310 L616 350 L574 378 L526 366 L486 310 Z" />
      <IceArea path="M280 344 L322 316 L382 326 L424 364 L410 406 L362 426 L308 416 L260 372 Z" />
      <IceArea path="M100 356 L140 332 L196 344 L224 380 L206 416 L158 436 L112 424 L82 382 Z" />
      <IceArea path="M416 390 L456 362 L510 372 L544 410 L530 444 L484 462 L438 450 L402 410 Z" final />
      <SnowDrift path="M52 236 C92 222 126 226 154 248 C120 260 82 264 48 254 Z" />
      <SnowDrift path="M196 130 C238 110 284 120 312 148 C270 154 232 150 198 142 Z" />
      <SnowDrift path="M512 110 C552 88 608 102 638 134 C590 140 546 136 512 124 Z" />
      <SnowDrift path="M292 354 C336 336 384 344 414 374 C366 384 324 378 292 366 Z" opacity={0.48} />
      <g>
        <FrozenStatue x={586} y={150} rotate={-10} />
        <FrozenStatue x={246} y={168} rotate={8} />
        <BrokenArchFragment x={252} y={120} rotate={3} />
        <BrokenArchFragment x={566} y={112} rotate={-12} />
        <BuriedReliquaryStone x={320} y={260} w={62} h={22} rotate={-8} />
        <BuriedReliquaryStone x={386} y={198} w={70} h={22} rotate={9} />
        <BuriedReliquaryStone x={520} y={306} w={62} h={20} rotate={-14} />
        <BuriedReliquaryStone x={124} y={402} w={58} h={20} rotate={6} />
        <SealedVaultMark x={468} y={410} />
        <IceCrystals x={126} y={264} scale={0.72} />
        <IceCrystals x={520} y={336} scale={0.62} />
        <IceCrystals x={330} y={392} scale={0.58} />
        <LevelTwoRubble x={198} y={176} scale={0.62} theme={frozenRuinTheme} />
        <LevelTwoRubble x={522} y={186} scale={0.56} theme={frozenRuinTheme} />
        <LevelTwoRubbleChips chips={[{ x: 70, y: 222, r: 5 }, { x: 418, y: 292, r: 6 }, { x: 546, y: 376, r: 5 }, { x: 124, y: 424, r: 4 }]} />
        <LevelTwoCrack x={350} y={222} scale={0.74} stroke="#315d6b" />
        <LevelTwoCrack x={534} y={300} scale={0.7} stroke="#315d6b" />
        <LevelTwoCrack x={146} y={392} scale={0.66} stroke="#315d6b" />
        <LevelTwoCrack x={420} y={424} scale={0.62} stroke="#315d6b" />
        <LevelTwoCrack x={94} y={238} scale={0.58} stroke="#315d6b" />
        <LevelTwoDebris x={252} y={132} fill="#8da5ad" />
        <LevelTwoDebris x={468} y={424} fill="#8da5ad" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={444} y={218} label="H" presentation={presentation} />
          <LevelTwoMarker x={494} y={386} label="T" presentation={presentation} />
          <LevelTwoMarker x={174} y={364} label="B" presentation={presentation} />
        </>
      )}
      {showLabels && <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />}
    </>
  );
}

