import { Badge } from './Badge';
import type { MapStyle } from '../types';

function MapRoom({ x, y, w, h, fill }: { x: number; y: number; w: number; h: number; label?: string; fill: string }) {
  return (
    <g>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx="7" fill="none" stroke="#7b5d45" strokeWidth="3" opacity="0.28" />
      <rect x={x} y={y} width={w} height={h} rx="5" fill={fill} stroke="#211a16" strokeWidth="7" filter="url(#inkRoughen)" />
      <path d={`M${x + 12} ${y + 10} H${x + w - 12} M${x + 12} ${y + h - 10} H${x + w - 12}`} stroke="#7b5d45" strokeWidth="1.5" opacity="0.14" />
    </g>
  );
}

function RoomNumber({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 20} y={y - 20} width="40" height="40" rx="10" fill="#fff8ef" opacity="0.82" />
      <text x={x} y={y + 9} textAnchor="middle" fontSize="34" fontWeight="900" fill="#211a16" paintOrder="stroke" stroke="#fff8ef" strokeWidth="4">
        {label}
      </text>
    </g>
  );
}

function RoomNumbers({ rooms }: { rooms: { x: number; y: number; label: string }[] }) {
  return (
    <>
      {rooms.map((room) => (
        <RoomNumber key={room.label} {...room} />
      ))}
    </>
  );
}

function MapMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g filter="url(#markerInk)">
      <circle cx={x} cy={y} r="12" fill="#fff8ef" stroke="#7b3f28" strokeWidth="2.5" />
      <circle cx={x} cy={y} r="8.5" fill="#b85c38" opacity="0.94" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff8ef">
        {label}
      </text>
    </g>
  );
}

function OvalRoom({ cx, cy, rx, ry, fill }: { cx: number; cy: number; rx: number; ry: number; label?: string; fill: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx + 2} ry={ry + 2} fill="none" stroke="#7b5d45" strokeWidth="3" opacity="0.25" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke="#211a16" strokeWidth="7" filter="url(#inkRoughen)" />
      <path d={`M${cx - rx + 18} ${cy - ry / 2} C${cx - 18} ${cy - ry / 2 - 6} ${cx + 18} ${cy - ry / 2 + 6} ${cx + rx - 18} ${cy - ry / 2}`} stroke="#7b5d45" strokeWidth="1.5" fill="none" opacity="0.12" />
    </g>
  );
}

type MapPalette = {
  roomFill: string;
  featureFill: string;
  secretStroke: string;
  finalFill: string;
};

type CorridorKind = 'constructed' | 'natural';

function Corridors({ paths, kind = 'constructed' }: { paths: string[]; kind?: CorridorKind }) {
  const isNatural = kind === 'natural';
  const shadowWidth = isNatural ? 24 : 20;
  const wallWidth = isNatural ? 17 : 14;
  const floorWidth = isNatural ? 9 : 10;
  const wallOpacity = isNatural ? 0.72 : 0.5;
  const centerlineOpacity = isNatural ? 0.18 : 0.16;

  return (
    <>
      {paths.map((path) => (
        <path key={`${path}-shadow`} d={path} stroke="#7b5d45" strokeWidth={shadowWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isNatural ? '0.18' : '0.12'} />
      ))}
      {paths.map((path) => (
        <path
          key={`${path}-wall`}
          d={path}
          stroke={isNatural ? '#211a16' : '#4a392e'}
          strokeWidth={wallWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={wallOpacity}
          filter={isNatural ? 'url(#inkRoughen)' : undefined}
        />
      ))}
      {paths.map((path) => (
        <path key={`${path}-floor`} d={path} stroke={isNatural ? '#efe4cf' : '#f7f1e4'} strokeWidth={floorWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isNatural ? '0.96' : '0.98'} />
      ))}
      {paths.map((path) => (
        <path key={`${path}-centerline`} d={path} stroke="#b79d7a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={centerlineOpacity} strokeDasharray={isNatural ? '4 11' : '7 12'} />
      ))}
    </>
  );
}

function MapTexture({ isPlayer }: { isPlayer: boolean }) {
  return (
    <>
      <rect x="0" y="0" width="720" height="480" fill="url(#paperBase)" />
      <rect x="0" y="0" width="720" height="480" fill="url(#paperGrain)" opacity={isPlayer ? '0.25' : '0.34'} />
      <path d="M360 28 V452 M30 240 H690" stroke="#8c7355" strokeWidth="1.2" opacity="0.12" strokeDasharray="18 12" />
      <path d="M96 88 C132 52 212 62 232 108 M516 382 C574 348 626 360 666 398" stroke="#a46f43" strokeWidth="38" fill="none" opacity={isPlayer ? '0.04' : '0.07'} />
      <g opacity={isPlayer ? '0.06' : '0.1'}>
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={index} d={`M${80 + index * 78} 0 V480`} stroke="#7b5d45" strokeWidth="0.8" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <path key={index} d={`M0 ${80 + index * 78} H720`} stroke="#7b5d45" strokeWidth="0.8" />
        ))}
      </g>
    </>
  );
}

function MapDefs() {
  return (
    <defs>
      <linearGradient id="paperBase" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#f2ead8" />
        <stop offset="48%" stopColor="#e8dcc4" />
        <stop offset="100%" stopColor="#f5eedf" />
      </linearGradient>
      <pattern id="paperGrain" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="transparent" />
        <circle cx="3" cy="7" r="0.7" fill="#7b5d45" opacity="0.32" />
        <circle cx="18" cy="5" r="0.5" fill="#9a7d5b" opacity="0.26" />
        <circle cx="24" cy="18" r="0.8" fill="#7b5d45" opacity="0.2" />
        <path d="M6 23 C10 21 14 24 18 22" stroke="#9a7d5b" strokeWidth="0.6" opacity="0.22" fill="none" />
      </pattern>
      <filter id="inkRoughen" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="markerInk" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="0.7" floodColor="#211a16" floodOpacity="0.25" />
      </filter>
    </defs>
  );
}

function BlackfenLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
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

  return (
    <>
      <path d="M48 72 H206 V132 H292 V92 H418 V172 H548 V292 H488 V380 H328 V318 H222 V386 H92 V260 H48 Z" fill={palette.featureFill} opacity="0.58" />
      <path d="M180 172 C206 198 222 222 250 250 M496 378 C528 350 548 322 582 286" stroke={palette.secretStroke} strokeWidth="4.5" strokeDasharray="9 9" strokeLinecap="round" fill="none" filter="url(#inkRoughen)" />
      <Corridors paths={['M190 128 H246', 'M306 166 V224', 'M214 266 H238', 'M342 262 H386', 'M456 186 V140', 'M528 242 H560', 'M432 340 V298', 'M210 386 H374']} />
      <MapRoom x={70} y={88} w={120} h={84} label="1" fill={palette.roomFill} />
      <MapRoom x={246} y={78} w={120} h={88} label="2" fill={palette.roomFill} />
      <MapRoom x={84} y={222} w={130} h={92} label="3" fill={palette.roomFill} />
      <MapRoom x={238} y={224} w={104} h={82} label="4" fill={palette.roomFill} />
      <MapRoom x={386} y={186} w={142} h={112} label="5" fill={palette.roomFill} />
      <MapRoom x={438} y={58} w={98} h={82} label="6" fill={palette.roomFill} />
      <MapRoom x={84} y={350} w={126} h={72} label="7" fill={palette.roomFill} />
      <MapRoom x={374} y={340} w={122} h={76} label="8" fill={palette.roomFill} />
      <MapRoom x={560} y={220} w={92} h={118} label="9" fill={palette.finalFill} />
      {!isPlayer && (
        <>
          <MapMarker x={174} y={106} label="T" />
          <MapMarker x={508} y={202} label="H" />
          <MapMarker x={633} y={238} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function ShrineLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 154, y: 216, label: '1' },
    { x: 324, y: 204, label: '2' },
    { x: 480, y: 211, label: '3' },
    { x: 490, y: 348, label: '4' },
    { x: 329, y: 344, label: '5' },
    { x: 167, y: 354, label: '6' },
  ];

  return (
    <>
      <path d="M156 72 H492 V394 H156 Z" fill={palette.featureFill} opacity="0.18" />
      <path d="M318 258 C304 284 292 304 274 326 M216 352 C242 378 284 400 336 386" stroke={palette.secretStroke} strokeWidth="4.5" strokeDasharray="9 9" strokeLinecap="round" fill="none" filter="url(#inkRoughen)" />
      <Corridors paths={['M220 216 H260', 'M388 206 H424', 'M480 254 V310', 'M432 348 H388', 'M270 344 H216', 'M152 318 V262']} />
      <MapRoom x={88} y={170} w={132} h={92} label="1" fill={palette.roomFill} />
      <MapRoom x={260} y={150} w={128} h={108} label="2" fill={palette.roomFill} />
      <MapRoom x={424} y={168} w={112} h={86} label="3" fill={palette.roomFill} />
      <MapRoom x={432} y={310} w={116} h={76} label="4" fill={palette.roomFill} />
      <MapRoom x={270} y={302} w={118} h={84} label="5" fill={palette.roomFill} />
      <MapRoom x={118} y={318} w={98} h={72} label="6" fill={palette.finalFill} />
      {!isPlayer && (
        <>
          <MapMarker x={366} y={172} label="H" />
          <MapMarker x={528} y={326} label="T" />
          <MapMarker x={202} y={334} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function CavernLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 96, y: 238, label: '1' },
    { x: 218, y: 174, label: '2' },
    { x: 222, y: 326, label: '3' },
    { x: 352, y: 220, label: '4' },
    { x: 498, y: 154, label: '5' },
    { x: 600, y: 300, label: '6' },
  ];

  return (
    <>
      <path d="M52 226 C142 118 196 318 286 194 S440 80 526 188 S612 354 684 278" stroke={palette.featureFill} strokeWidth="52" strokeLinecap="round" fill="none" opacity="0.64" />
      <path d="M262 334 C318 388 428 388 518 328 M432 200 C466 244 504 268 574 286" stroke={palette.secretStroke} strokeWidth="4.5" strokeDasharray="9 9" strokeLinecap="round" fill="none" filter="url(#inkRoughen)" />
      <Corridors kind="natural" paths={['M156 224 C180 208 190 192 218 174', 'M156 252 C184 276 194 306 222 326', 'M286 186 C310 196 326 208 352 220', 'M424 210 C452 188 470 170 498 154', 'M540 198 C568 234 584 264 600 300', 'M288 316 C388 350 466 348 548 316']} />
      <OvalRoom cx={96} cy={238} rx={68} ry={52} label="1" fill={palette.roomFill} />
      <OvalRoom cx={218} cy={174} rx={72} ry={48} label="2" fill={palette.roomFill} />
      <OvalRoom cx={222} cy={326} rx={68} ry={48} label="3" fill={palette.roomFill} />
      <OvalRoom cx={352} cy={220} rx={86} ry={62} label="4" fill={palette.roomFill} />
      <OvalRoom cx={498} cy={154} rx={70} ry={52} label="5" fill={palette.roomFill} />
      <OvalRoom cx={600} cy={300} rx={78} ry={58} label="6" fill={palette.finalFill} />
      {!isPlayer && (
        <>
          <MapMarker x={410} y={184} label="H" />
          <MapMarker x={270} y={300} label="T" />
          <MapMarker x={652} y={276} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function CryptLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 360, y: 89, label: '1' },
    { x: 360, y: 215, label: '2' },
    { x: 149, y: 217, label: '3' },
    { x: 571, y: 217, label: '4' },
    { x: 206, y: 365, label: '5' },
    { x: 514, y: 365, label: '6' },
  ];

  return (
    <>
      <path d="M92 86 H628 V394 H92 Z" fill={palette.featureFill} opacity="0.2" />
      <path d="M150 216 C218 138 500 138 570 216 M206 326 C282 282 438 282 514 326" stroke={palette.secretStroke} strokeWidth="4.5" strokeDasharray="8 10" strokeLinecap="round" fill="none" filter="url(#inkRoughen)" />
      <Corridors paths={['M360 128 V170', 'M256 214 H210', 'M464 214 H510', 'M210 260 C214 298 244 310 276 342', 'M510 260 C506 298 476 310 444 342', 'M276 366 H444']} />
      <MapRoom x={296} y={50} w={128} h={78} label="1" fill={palette.roomFill} />
      <MapRoom x={256} y={170} w={208} h={90} label="2" fill={palette.roomFill} />
      <MapRoom x={88} y={174} w={122} h={86} label="3" fill={palette.roomFill} />
      <MapRoom x={510} y={174} w={122} h={86} label="4" fill={palette.roomFill} />
      <MapRoom x={136} y={326} w={140} h={78} label="5" fill={palette.roomFill} />
      <MapRoom x={444} y={326} w={140} h={78} label="6" fill={palette.finalFill} />
      {!isPlayer && (
        <>
          <MapMarker x={190} y={192} label="H" />
          <MapMarker x={258} y={346} label="T" />
          <MapMarker x={566} y={346} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function SewerLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 112, y: 238, label: '1' },
    { x: 280, y: 238, label: '2' },
    { x: 156, y: 112, label: '3' },
    { x: 416, y: 238, label: '4' },
    { x: 536, y: 371, label: '5' },
    { x: 626, y: 235, label: '6' },
  ];

  return (
    <>
      <path d="M48 238 H674 M156 238 V104 M280 238 V372 M402 238 V110 M536 238 V368" stroke={palette.featureFill} strokeWidth="62" strokeLinecap="round" fill="none" opacity="0.46" />
      <path d="M156 150 C208 174 252 192 280 238 M474 282 C512 306 540 324 566 358" stroke={palette.secretStroke} strokeWidth="4.5" strokeDasharray="10 8" strokeLinecap="round" fill="none" filter="url(#inkRoughen)" />
      <Corridors paths={['M166 238 H220', 'M340 238 H358', 'M474 238 H570', 'M156 196 V150', 'M280 280 V372', 'M536 330 V282']} />
      <MapRoom x={58} y={196} w={108} h={84} label="1" fill={palette.roomFill} />
      <MapRoom x={220} y={196} w={120} h={84} label="2" fill={palette.roomFill} />
      <MapRoom x={96} y={74} w={120} h={76} label="3" fill={palette.roomFill} />
      <MapRoom x={358} y={194} w={116} h={88} label="4" fill={palette.roomFill} />
      <MapRoom x={468} y={330} w={136} h={82} label="5" fill={palette.roomFill} />
      <MapRoom x={570} y={178} w={112} h={114} label="6" fill={palette.finalFill} />
      {!isPlayer && (
        <>
          <MapMarker x={324} y={214} label="H" />
          <MapMarker x={458} y={216} label="T" />
          <MapMarker x={660} y={202} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function LaboratoryLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 145, y: 133, label: '1' },
    { x: 350, y: 109, label: '2' },
    { x: 569, y: 151, label: '3' },
    { x: 160, y: 332, label: '4' },
    { x: 370, y: 348, label: '5' },
    { x: 586, y: 344, label: '6' },
  ];

  return (
    <>
      <path d="M66 112 H232 V66 H436 V142 H620 V318 H506 V414 H264 V362 H90 Z" fill={palette.featureFill} opacity="0.22" />
      <path d="M178 172 C234 222 286 260 342 318 M426 350 C482 300 528 246 568 206" stroke={palette.secretStroke} strokeWidth="4.5" strokeDasharray="7 9" strokeLinecap="round" fill="none" filter="url(#inkRoughen)" />
      <Corridors paths={['M216 132 H274', 'M426 110 H506', 'M568 206 V286', 'M434 348 H520', 'M228 332 H306', 'M158 284 V174', 'M364 158 V302']} />
      <MapRoom x={74} y={92} w={142} h={82} label="1" fill={palette.roomFill} />
      <MapRoom x={274} y={60} w={152} h={98} label="2" fill={palette.roomFill} />
      <MapRoom x={506} y={96} w={126} h={110} label="3" fill={palette.roomFill} />
      <MapRoom x={92} y={284} w={136} h={96} label="4" fill={palette.roomFill} />
      <MapRoom x={306} y={302} w={128} h={92} label="5" fill={palette.roomFill} />
      <MapRoom x={520} y={286} w={132} h={116} label="6" fill={palette.finalFill} />
      {!isPlayer && (
        <>
          <MapMarker x={410} y={82} label="H" />
          <MapMarker x={420} y={324} label="T" />
          <MapMarker x={636} y={314} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function MapLayout({ style, palette, isPlayer }: { style: MapStyle; palette: MapPalette; isPlayer: boolean }) {
  switch (style) {
    case 'shrine':
      return <ShrineLayout palette={palette} isPlayer={isPlayer} />;
    case 'cavern':
      return <CavernLayout palette={palette} isPlayer={isPlayer} />;
    case 'crypt':
      return <CryptLayout palette={palette} isPlayer={isPlayer} />;
    case 'sewer':
      return <SewerLayout palette={palette} isPlayer={isPlayer} />;
    case 'laboratory':
      return <LaboratoryLayout palette={palette} isPlayer={isPlayer} />;
    case 'blackfen':
    default:
      return <BlackfenLayout palette={palette} isPlayer={isPlayer} />;
  }
}

export function DungeonMap({
  mode,
  mapStyle,
  colorEnabled,
  compact = false,
  showLegend = false,
}: {
  mode: 'gm' | 'player' | 'fog';
  mapStyle: MapStyle;
  colorEnabled: boolean;
  compact?: boolean;
  showLegend?: boolean;
}) {
  const isPlayer = mode === 'player';
  const isFog = mode === 'fog';
  const roomFill = colorEnabled && !isPlayer ? '#e3eedc' : isPlayer ? '#fbf7eb' : '#f8f5ef';
  const palette: MapPalette = {
    roomFill,
    featureFill: colorEnabled ? (isPlayer ? '#e5dfca' : '#cfe7ee') : '#e5ddcf',
    secretStroke: isPlayer ? 'transparent' : '#b85c38',
    finalFill: colorEnabled && !isPlayer ? '#ead9cc' : isPlayer ? '#fbf7eb' : '#f8f5ef',
  };

  return (
    <div className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-tool">
      <div className={`flex items-center justify-between gap-3 border-b border-ink/10 px-4 ${compact ? 'py-2.5' : 'py-3'}`}>
        <div>
          <h2 className={`font-serif font-bold ${compact ? 'text-lg' : 'text-xl'}`}>{isPlayer ? 'Player-Safe Map' : isFog ? 'Fog-of-War Map' : 'GM Map Preview'}</h2>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            {colorEnabled ? 'Color map available' : 'Lantern black-and-white map'}
          </p>
        </div>
        {isPlayer ? <Badge tone="success">Secrets hidden</Badge> : <Badge tone="accent">GM labels</Badge>}
      </div>

      <svg viewBox="0 0 720 480" role="img" aria-label={`${isPlayer ? 'Player safe' : 'GM'} dungeon map`} className="h-auto w-full bg-[#efe7d6]">
        <MapDefs />
        <MapTexture isPlayer={isPlayer} />
        <MapLayout style={mapStyle} palette={palette} isPlayer={isPlayer} />
        {isFog && <rect x="46" y="44" width="628" height="392" fill="#211a16" opacity="0.22" />}
      </svg>
      {showLegend && (
        <div className="flex flex-wrap gap-2 border-t border-ink/10 px-4 py-2 text-xs font-bold text-ink/55">
          <span>Numbers: keyed rooms</span>
          {!isPlayer && <span>T: treasure</span>}
          {!isPlayer && <span>H: hazard</span>}
          {!isPlayer && <span>B: boss/objective</span>}
          {!isPlayer && <span>Dashed lines: secret routes</span>}
        </div>
      )}
    </div>
  );
}
