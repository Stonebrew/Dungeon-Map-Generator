import type { MapConnection } from '../../../../types';
import { desertTempleTheme } from '../themes';
import { LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoRoomNumbers, LevelTwoRubble, LevelTwoRubbleChips } from '../shared';
import type { LevelTwoRendererProps, MapPresentation } from '../types';

function SandDrift({ path, opacity = 0.62 }: { path: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <path d={path} fill="#efd9aa" opacity="0.72" />
      <path d={path} fill="none" stroke="#a87942" strokeWidth="1.6" opacity="0.34" strokeDasharray="12 10" />
      <path d={path} fill="none" stroke="#fff3cf" strokeWidth="1.2" opacity="0.46" strokeDasharray="20 18" />
    </g>
  );
}

function DuneRouteLayer({ connections, secretStroke, isPlayer, presentation = 'screen' }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean; presentation?: MapPresentation }) {
  const isPrint = presentation === 'print';
  const normalConnections = connections.filter((connection) => connection.type === 'normal' && connection.path);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);

  return (
    <g>
      {normalConnections.map((connection) => {
        const path = connection.path as string;
        const isStair = connection.routeStyle === 'stair' || connection.routeStyle === 'causeway';
        const isNarrow = connection.routeDifficulty === 'narrow' || connection.routeDifficulty === 'unstable';

        return (
          <g key={path}>
            <path d={path} stroke="#2b190d" strokeWidth={isStair ? '36' : '44'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.22' : '0.16'} />
            <path d={path} stroke={isStair ? '#a8753f' : '#d9b978'} strokeWidth={isStair ? '26' : '34'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.98' : '0.86'} />
            <path d={path} stroke="#f4dcaa" strokeWidth={isStair ? '17' : '22'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.55' : '0.72'} />
            <path d={path} stroke="#8d6236" strokeWidth={isStair ? '3.2' : '2'} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.38' : '0.5'} strokeDasharray={isStair ? '10 9' : '22 18'} />
            {isNarrow && <path d={path} stroke="#5e3a1f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48" strokeDasharray="4 12" />}
          </g>
        );
      })}
      {!isPlayer &&
        secretPaths.map((path) => (
          <g key={path}>
            <path d={path} stroke="#3a2413" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2" />
            <path d={path} stroke={secretStroke} strokeWidth={isPrint ? '6' : '4.5'} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={isPrint ? '12 7' : '9 8'} opacity={isPrint ? '0.95' : '0.82'} />
          </g>
        ))}
    </g>
  );
}

function TempleArea({ path, final = false, sunken = false }: { path: string; final?: boolean; sunken?: boolean }) {
  return (
    <g>
      <path d={path} fill="#27170c" opacity={sunken ? '0.34' : '0.22'} transform="translate(5 8)" />
      <path d={path} fill={final ? '#c89552' : sunken ? '#9d7446' : desertTempleTheme.floorTiles[0]} stroke="#5e3b20" strokeWidth={sunken ? '8' : '6'} strokeLinejoin="round" opacity="0.96" />
      <path d={path} fill="none" stroke="#fff0c9" strokeWidth="2" strokeLinejoin="round" opacity="0.4" strokeDasharray="24 16" />
      <path d={path} fill="none" stroke="#7d5a34" strokeWidth="2" strokeLinejoin="round" opacity="0.42" strokeDasharray="9 13" />
    </g>
  );
}

function BrokenColumn({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84">
      <rect x="-8" y="-26" width="16" height="42" rx="3" fill="#b98f58" stroke="#4b2f1a" strokeWidth="2" />
      <path d="M-14 -27 H14 M-12 16 H12" stroke="#e8c98b" strokeWidth="3" strokeLinecap="round" />
      <path d="M-5 -18 H5 M-5 -4 H5 M-5 8 H5" stroke="#6f4a28" strokeWidth="1.2" opacity="0.52" />
    </g>
  );
}

function CarvedSlab({ x, y, w = 66, h = 26, rotate = 0 }: { x: number; y: number; w?: number; h?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <rect x="0" y="0" width={w} height={h} rx="4" fill="#b98f58" stroke="#5e3b20" strokeWidth="2" />
      <path d={`M8 ${h / 2} H${w - 8} M${w * 0.32} 6 V${h - 6} M${w * 0.64} 6 V${h - 6}`} stroke="#f2d7a0" strokeWidth="1.2" opacity="0.52" />
      <path d={`M${w * 0.16} ${h - 7} l8 -8 l8 7 M${w * 0.74} 7 l7 7 l7 -7`} stroke="#6f4a28" strokeWidth="1.1" fill="none" opacity="0.56" />
    </g>
  );
}

function SunkenShadow({ path }: { path: string }) {
  return (
    <g opacity="0.72">
      <path d={path} fill="#2a1a12" opacity="0.5" />
      <path d={path} fill="none" stroke="#d4a869" strokeWidth="2" opacity="0.32" strokeDasharray="13 10" />
    </g>
  );
}

function WindStreaks() {
  return (
    <g opacity="0.34">
      <path d="M58 130 C158 94 232 116 330 82 M408 126 C496 88 570 104 660 70 M48 394 C142 352 244 378 340 338 M418 426 C508 382 596 404 668 358" stroke="#fff1c6" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="38 24" />
      <path d="M120 164 C180 142 244 156 302 132 M458 196 C522 168 574 182 640 150" stroke="#a8753f" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="18 16" />
    </g>
  );
}

function SunSeal({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.72">
      <circle cx={x} cy={y} r="24" fill="none" stroke="#ffd36d" strokeWidth="2.4" opacity="0.56" />
      <circle cx={x} cy={y} r="10" fill="#ffd36d" opacity="0.22" />
      {[0, 45, 90, 135].map((angle) => (
        <path key={angle} d={`M${x} ${y - 32} V${y - 22}`} stroke="#ffd36d" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${angle} ${x} ${y})`} opacity="0.5" />
      ))}
    </g>
  );
}

export function LevelTwoDesertTempleRenderer({ connections, secretStroke, isPlayer, presentation = 'screen' }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 94, y: 250, label: '1' },
    { x: 248, y: 178, label: '2' },
    { x: 412, y: 154, label: '3' },
    { x: 554, y: 244, label: '4' },
    { x: 390, y: 300, label: '5' },
    { x: 244, y: 366, label: '6' },
    { x: 112, y: 398, label: '7' },
    { x: 500, y: 402, label: '8' },
  ];
  const footprintPath = 'M42 214 C86 132 176 150 236 104 C304 54 396 82 468 118 C560 98 654 158 666 252 C642 344 574 382 526 438 C432 466 352 420 292 436 C196 464 74 438 42 354 C14 302 16 250 42 214 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-desert-temple-footprint" path={footprintPath} theme={desertTempleTheme} presentation={presentation}>
        <path d="M72 260 C150 190 226 158 304 126 M246 370 C334 330 448 296 596 232" stroke="#8d6236" strokeWidth="44" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M70 394 C176 426 290 388 398 410 S568 420 640 342" stroke="#f1d59d" strokeWidth="30" strokeLinecap="round" fill="none" opacity="0.13" />
      </LevelTwoFoundation>
      <WindStreaks />
      <SunkenShadow path="M334 264 C378 236 452 248 486 292 C482 346 430 374 366 354 C328 340 306 294 334 264 Z" />
      <DuneRouteLayer connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} presentation={presentation} />
      <TempleArea path="M46 222 L92 202 L146 226 L152 266 L114 292 L62 282 L36 252 Z" />
      <TempleArea path="M186 140 L250 104 L318 144 L306 208 L238 226 L178 190 Z" />
      <TempleArea path="M348 104 L430 82 L496 128 L480 198 L402 216 L338 170 Z" />
      <TempleArea path="M510 206 L594 190 L642 236 L622 304 L548 316 L500 268 Z" />
      <TempleArea path="M328 252 L418 232 L478 286 L452 352 L360 366 L306 314 Z" sunken />
      <TempleArea path="M188 326 L258 300 L320 340 L304 406 L230 424 L174 380 Z" sunken />
      <TempleArea path="M58 368 L124 340 L176 374 L164 432 L90 438 L42 404 Z" />
      <TempleArea path="M438 366 L512 342 L568 390 L548 444 L472 458 L418 416 Z" final sunken />
      <SandDrift path="M40 236 C82 218 126 224 154 252 C114 266 70 266 36 252 Z" />
      <SandDrift path="M190 156 C236 126 282 134 314 166 C270 178 224 174 186 164 Z" />
      <SandDrift path="M506 218 C554 198 606 206 638 246 C590 258 546 250 506 230 Z" />
      <SandDrift path="M180 354 C230 328 284 332 316 366 C270 386 222 378 180 366 Z" opacity={0.52} />
      <SandDrift path="M436 386 C480 360 532 370 562 404 C518 416 478 412 436 398 Z" opacity={0.48} />
      <g>
        <BrokenColumn x={236} y={176} rotate={-14} />
        <BrokenColumn x={282} y={178} rotate={8} />
        <BrokenColumn x={408} y={128} rotate={5} />
        <BrokenColumn x={548} y={254} rotate={-10} />
        <CarvedSlab x={358} y={286} w={74} h={24} rotate={-8} />
        <CarvedSlab x={214} y={392} w={66} h={22} rotate={7} />
        <CarvedSlab x={468} y={426} w={70} h={22} rotate={-4} />
        <SunSeal x={500} y={402} />
        <LevelTwoRubble x={176} y={196} scale={0.64} theme={desertTempleTheme} />
        <LevelTwoRubble x={510} y={302} scale={0.62} theme={desertTempleTheme} />
        <LevelTwoRubbleChips chips={[{ x: 84, y: 218, r: 5 }, { x: 396, y: 214, r: 6 }, { x: 570, y: 318, r: 5 }, { x: 96, y: 430, r: 4 }]} />
        <LevelTwoCrack x={384} y={292} scale={0.76} stroke="#7d5a34" />
        <LevelTwoCrack x={524} y={232} scale={0.62} stroke="#7d5a34" />
        <LevelTwoCrack x={228} y={352} scale={0.64} stroke="#7d5a34" />
        <LevelTwoDebris x={250} y={134} fill="#9d7446" />
        <LevelTwoDebris x={468} y={154} fill="#9d7446" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={458} y={276} label="H" presentation={presentation} />
          <LevelTwoMarker x={536} y={386} label="T" presentation={presentation} />
          <LevelTwoMarker x={126} y={374} label="B" presentation={presentation} />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />
    </>
  );
}
