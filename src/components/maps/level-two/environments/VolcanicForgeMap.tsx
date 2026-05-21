import type { MapConnection } from '../../../../types';
import { volcanicForgeTheme } from '../themes';
import { LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoRoomNumbers, LevelTwoRubble } from '../shared';
import type { LevelTwoRendererProps, MapPresentation } from '../types';

function LavaChannel({ path, width = 18 }: { path: string; width?: number }) {
  return (
    <g>
      <path d={path} stroke="#120807" strokeWidth={width + 26} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.58" />
      <path d={path} stroke="#3a1510" strokeWidth={width + 18} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.72" strokeDasharray="22 13 8 17" />
      <path d={path} stroke="#7e1b11" strokeWidth={width + 8} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.86" />
      <path d={path} stroke="#f05a24" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.82" />
      <path d={path} stroke="#ffd27a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.58" strokeDasharray="9 17" />
      <path d={path} stroke="#24110d" strokeWidth={width + 34} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2" strokeDasharray="6 24 18 20" />
    </g>
  );
}

function EmberScatter({ x, y, count = 8 }: { x: number; y: number; count?: number }) {
  return (
    <g opacity="0.78">
      {Array.from({ length: count }).map((_, index) => {
        const px = x + ((index * 17) % 64);
        const py = y + ((index * 23) % 38);
        return <circle key={index} cx={px} cy={py} r={index % 3 === 0 ? 2.2 : 1.4} fill={index % 2 ? '#ff9a3d' : '#ffd27a'} opacity={index % 2 ? '0.62' : '0.48'} />;
      })}
    </g>
  );
}

function ForgePlate({ x, y, w = 56, h = 24, rotate = 0 }: { x: number; y: number; w?: number; h?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.82">
      <rect x="0" y="0" width={w} height={h} rx="4" fill={volcanicForgeTheme.metal} stroke="#111" strokeWidth="2" />
      <path d={`M8 ${h / 2} H${w - 8}`} stroke="#85827a" strokeWidth="1.6" opacity="0.5" />
      {[10, w - 12].map((bolt) => (
        <circle key={bolt} cx={bolt} cy={h / 2} r="2.5" fill="#151515" opacity="0.8" />
      ))}
    </g>
  );
}

function AnvilMark({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84">
      <path d="M-22 -8 H8 L24 -16 L18 -4 L26 4 H-18 Z" fill="#2f3333" stroke="#111" strokeWidth="2" />
      <rect x="-12" y="5" width="22" height="9" rx="2" fill="#252828" stroke="#111" strokeWidth="1.4" />
      <path d="M-14 -3 H10" stroke="#85827a" strokeWidth="1.4" opacity="0.46" />
    </g>
  );
}

function ScorchedStain({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g opacity="0.54">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.25} ${y - 8} ${x + w * 0.74} ${y + h + 8} ${x + w} ${y + h / 2}`} stroke={volcanicForgeTheme.scorch} strokeWidth={h} strokeLinecap="round" fill="none" />
      <path d={`M${x + 10} ${y + h / 2} C${x + w * 0.34} ${y + 2} ${x + w * 0.62} ${y + h - 2} ${x + w - 10} ${y + h / 2}`} stroke="#6f2a18" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.5" />
    </g>
  );
}

function GlowingCrack({ x, y, scale = 1, rotate = 0 }: { x: number; y: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity="0.78">
      <path d="M0 0 l18 -9 l10 16 l16 -6 l12 12" stroke="#2a0804" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M0 0 l18 -9 l10 16 l16 -6 l12 12" stroke="#f05a24" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M4 -1 l14 -6 l8 11 l12 -4" stroke="#ffd27a" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.62" />
    </g>
  );
}

function RitualForgeMark({ x, y, r = 24 }: { x: number; y: number; r?: number }) {
  return (
    <g opacity="0.74">
      <circle cx={x} cy={y} r={r} fill="none" stroke={volcanicForgeTheme.runeGlow} strokeWidth="2.2" opacity="0.5" />
      <path d={`M${x - r * 0.7} ${y + r * 0.2} L${x} ${y - r * 0.7} L${x + r * 0.7} ${y + r * 0.2} M${x - r * 0.55} ${y + r * 0.55} H${x + r * 0.55}`} stroke="#ffbd69" strokeWidth="1.7" fill="none" opacity="0.48" />
    </g>
  );
}

function MoltenSeam({ path, width = 4 }: { path: string; width?: number }) {
  return (
    <g opacity="0.74">
      <path d={path} stroke="#1d0a07" strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={path} stroke="#c93a1c" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={path} stroke="#ffd27a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.54" strokeDasharray="6 10" />
    </g>
  );
}

function CooledCrust({ path }: { path: string }) {
  return <path d={path} stroke="#7a3320" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="18 12 4 10" />;
}

function BasaltPebbles({ x, y, count = 8 }: { x: number; y: number; count?: number }) {
  return (
    <g opacity="0.44">
      {Array.from({ length: count }).map((_, index) => {
        const px = x + ((index * 23) % 76);
        const py = y + ((index * 19) % 44);
        return <path key={index} d={`M${px} ${py} l${4 + (index % 3)} -2 l4 4 l-${3 + (index % 2)} 4 l-${4 + (index % 3)} -2 Z`} fill={index % 2 ? '#1d1a18' : '#4a4038'} />;
      })}
    </g>
  );
}

function ForgePlatform({ path, final = false, narrow = false }: { path: string; final?: boolean; narrow?: boolean }) {
  return (
    <g>
      <path d={path} fill="#090706" opacity="0.52" transform="translate(7 10)" />
      <path d={path} fill={final ? '#49362c' : narrow ? '#3d3935' : volcanicForgeTheme.floorTiles[2]} stroke="#090706" strokeWidth={narrow ? '8' : '12'} strokeLinejoin="round" />
      <path d={path} fill="none" stroke="#5d4b3d" strokeWidth={narrow ? '4' : '5'} strokeLinejoin="round" opacity="0.74" />
      <path d={path} fill="none" stroke="#b15a2c" strokeWidth={narrow ? '2' : '2.6'} strokeLinejoin="round" opacity="0.28" strokeDasharray={narrow ? '10 11 3 9' : '16 13 5 11'} />
      <path d={path} fill="none" stroke="#15100d" strokeWidth="2.2" strokeLinejoin="round" opacity="0.48" strokeDasharray={narrow ? '5 12' : '7 16'} />
    </g>
  );
}

function MetalGrateBridge({ path }: { path: string }) {
  return (
    <g>
      <path d={path} stroke="#151515" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      <path d={path} stroke={volcanicForgeTheme.metal} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.96" />
      <path d={path} stroke="#2a2926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="5 9" opacity="0.72" />
      <path d={path} stroke="#b1a781" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.48" />
    </g>
  );
}

function ForgeRouteLayer({ connections, secretStroke, isPlayer, presentation = 'screen' }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean; presentation?: MapPresentation }) {
  const isPrint = presentation === 'print';
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);

  return (
    <g>
      {normalPaths.map((path) => (
        <g key={path}>
          <path d={path} stroke="#080605" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" />
          <path d={path} stroke="#292521" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.94" />
          <path d={path} stroke="#5a4a3e" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.86" />
          <path d={path} stroke="#8a6d52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="9 11 3 8" />
          <path d={path} stroke="#e26a2a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.18" strokeDasharray="5 18" />
        </g>
      ))}
      {!isPlayer &&
        secretPaths.map((path) => (
          <g key={path}>
            <path d={path} stroke="#1a100c" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.32" />
            <path d={path} stroke={secretStroke} strokeWidth={isPrint ? '6' : '4.5'} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={isPrint ? '12 7' : '9 8'} opacity={isPrint ? '0.96' : '0.9'} />
          </g>
        ))}
    </g>
  );
}

export function LevelTwoVolcanicForgeRenderer({ connections, secretStroke, isPlayer, presentation = 'screen' }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 92, y: 250, label: '1' },
    { x: 238, y: 126, label: '2' },
    { x: 376, y: 228, label: '3' },
    { x: 568, y: 242, label: '4' },
    { x: 420, y: 370, label: '5' },
    { x: 214, y: 370, label: '6' },
    { x: 548, y: 116, label: '7' },
    { x: 104, y: 392, label: '8' },
  ];
  const footprintPath = 'M34 210 C76 132 164 160 220 82 C296 44 392 96 462 70 C548 38 642 128 650 232 C704 302 608 370 518 372 C466 458 354 426 282 428 C194 468 68 442 38 362 C8 302 8 246 34 210 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-volcanic-forge-footprint" path={footprintPath} theme={volcanicForgeTheme} presentation={presentation}>
        <path d="M54 246 C144 184 198 132 250 90 M318 186 C402 124 482 122 574 114 M94 404 C216 442 344 398 444 374" stroke="#0e0b09" strokeWidth="42" strokeLinecap="round" fill="none" opacity="0.24" />
        <path d="M318 74 C356 162 348 260 316 352 S282 420 228 448" stroke="#7e1b11" strokeWidth="26" strokeLinecap="round" fill="none" opacity="0.16" />
        <path d="M24 304 C114 252 218 306 322 262 S496 182 690 254" stroke="#32140f" strokeWidth="52" strokeLinecap="round" fill="none" opacity="0.2" />
      </LevelTwoFoundation>
      <LavaChannel path="M28 294 C118 238 222 294 318 252 S488 166 686 250" width={24} />
      <LavaChannel path="M336 48 C382 138 384 232 356 314 S318 402 266 458" width={16} />
      <LavaChannel path="M512 56 C548 128 548 190 568 242 S612 324 672 372" width={12} />
      <MoltenSeam path="M292 186 C330 196 356 202 392 188" width={3.6} />
      <MoltenSeam path="M430 278 C444 306 458 326 482 342" width={3.4} />
      <MoltenSeam path="M146 376 C178 392 218 404 254 392" width={3.2} />
      <ForgeRouteLayer connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} presentation={presentation} />
      <MetalGrateBridge path="M530 238 C544 238 554 240 568 242" />
      <MetalGrateBridge path="M392 338 C402 348 410 358 420 370" />
      <ForgePlatform path="M42 230 C62 212 118 214 148 222 L164 246 C152 272 122 286 70 280 C48 274 36 254 42 230 Z" />
      <ForgePlatform path="M184 104 C210 82 266 84 292 106 C306 126 286 156 256 166 C220 174 188 154 176 132 Z" />
      <ForgePlatform path="M290 176 C330 150 406 150 444 182 C482 216 458 276 410 296 C354 318 294 286 276 246 C260 214 266 190 290 176 Z" />
      <ForgePlatform path="M518 214 C548 194 606 198 628 228 C642 250 616 284 578 292 C540 298 508 272 504 244 Z" narrow />
      <ForgePlatform path="M370 336 C402 316 464 326 492 362 C500 388 466 418 414 418 C376 416 346 392 344 370 Z" />
      <ForgePlatform path="M160 338 C194 316 254 324 286 362 C294 394 260 424 206 426 C160 426 130 398 132 372 Z" final />
      <ForgePlatform path="M498 88 C526 68 586 72 616 104 C626 130 596 158 548 160 C514 158 486 134 486 112 Z" narrow />
      <ForgePlatform path="M52 362 C80 342 132 348 160 382 C158 412 126 434 78 428 C48 422 34 394 52 362 Z" narrow />
      <CooledCrust path="M42 230 C62 212 118 214 148 222 L164 246" />
      <CooledCrust path="M276 246 C294 286 354 318 410 296 C458 276 482 216 444 182" />
      <CooledCrust path="M370 336 C402 316 464 326 492 362" />
      <CooledCrust path="M160 338 C194 316 254 324 286 362" />
      <g>
        <ScorchedStain x={70} y={248} w={62} h={16} />
        <ScorchedStain x={322} y={234} w={92} h={24} />
        <ScorchedStain x={182} y={378} w={66} h={18} />
        <ForgePlate x={64} y={236} w={46} h={18} rotate={3} />
        <ForgePlate x={532} y={254} w={54} h={17} rotate={-4} />
        <ForgePlate x={512} y={98} w={56} h={16} rotate={6} />
        <AnvilMark x={360} y={224} rotate={-4} />
        <AnvilMark x={214} y={370} rotate={8} />
        <RitualForgeMark x={376} y={228} r={34} />
        <RitualForgeMark x={214} y={370} r={24} />
        <GlowingCrack x={226} y={124} scale={0.68} rotate={8} />
        <GlowingCrack x={396} y={342} scale={0.68} rotate={-22} />
        <GlowingCrack x={78} y={400} scale={0.56} rotate={14} />
        <LevelTwoRubble x={252} y={154} scale={0.54} theme={volcanicForgeTheme} />
        <LevelTwoRubble x={458} y={386} scale={0.56} theme={volcanicForgeTheme} />
        <LevelTwoDebris x={322} y={282} fill="#3a3028" />
        <LevelTwoDebris x={560} y={138} fill="#3a3028" />
        <LevelTwoCrack x={318} y={198} scale={0.68} stroke="#1f1b18" />
        <LevelTwoCrack x={190} y={350} scale={0.7} stroke="#1f1b18" />
        <BasaltPebbles x={278} y={186} count={9} />
        <BasaltPebbles x={372} y={356} count={7} />
        <BasaltPebbles x={526} y={218} count={6} />
        <EmberScatter x={62} y={290} count={8} />
        <EmberScatter x={456} y={206} count={10} />
        <EmberScatter x={294} y={386} count={7} />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={306} y={186} label="H" presentation={presentation} />
          <LevelTwoMarker x={458} y={348} label="T" presentation={presentation} />
          <LevelTwoMarker x={244} y={344} label="B" presentation={presentation} />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />
    </>
  );
}
