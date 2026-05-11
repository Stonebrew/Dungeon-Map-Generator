import { Badge } from './Badge';
import type { MapStyle } from '../types';

function MapRoom({ x, y, w, h, label, fill }: { x: number; y: number; w: number; h: number; label: string; fill: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={fill} stroke="#211a16" strokeWidth="8" />
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" fontSize="34" fontWeight="700" fill="#211a16">
        {label}
      </text>
    </g>
  );
}

function MapMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="#b85c38" stroke="#fff8ef" strokeWidth="3" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
        {label}
      </text>
    </g>
  );
}

function OvalRoom({ cx, cy, rx, ry, label, fill }: { cx: number; cy: number; rx: number; ry: number; label: string; fill: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke="#211a16" strokeWidth="8" />
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="34" fontWeight="700" fill="#211a16">
        {label}
      </text>
    </g>
  );
}

type MapPalette = {
  roomFill: string;
  featureFill: string;
  secretStroke: string;
  finalFill: string;
};

function Corridors({ paths }: { paths: string[] }) {
  return (
    <>
      {paths.map((path) => (
        <path key={`${path}-wall`} d={path} stroke="#211a16" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
      {paths.map((path) => (
        <path key={`${path}-floor`} d={path} stroke="#efe7d6" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
    </>
  );
}

function BlackfenLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <>
      <path d="M48 72 H206 V132 H292 V92 H418 V172 H548 V292 H488 V380 H328 V318 H222 V386 H92 V260 H48 Z" fill={palette.featureFill} opacity="0.75" />
      <MapRoom x={70} y={88} w={120} h={84} label="1" fill={palette.roomFill} />
      <MapRoom x={246} y={78} w={120} h={88} label="2" fill={palette.roomFill} />
      <MapRoom x={84} y={222} w={130} h={92} label="3" fill={palette.roomFill} />
      <MapRoom x={238} y={224} w={104} h={82} label="4" fill={palette.roomFill} />
      <MapRoom x={386} y={186} w={142} h={112} label="5" fill={palette.roomFill} />
      <MapRoom x={438} y={58} w={98} h={82} label="6" fill={palette.roomFill} />
      <MapRoom x={84} y={350} w={126} h={72} label="7" fill={palette.roomFill} />
      <MapRoom x={374} y={340} w={122} h={76} label="8" fill={palette.roomFill} />
      <MapRoom x={560} y={220} w={92} h={118} label="9" fill={palette.finalFill} />
      <Corridors paths={['M190 128 H246', 'M306 166 V224', 'M214 266 H238', 'M342 262 H386', 'M456 186 V140', 'M528 242 H560', 'M432 340 V298', 'M210 386 H374']} />
      <path d="M180 172 C206 198 222 222 250 250 M496 378 C528 350 548 322 582 286" stroke={palette.secretStroke} strokeWidth="5" strokeDasharray="10 10" fill="none" />
      {!isPlayer && (
        <>
          <MapMarker x={174} y={106} label="T" />
          <MapMarker x={508} y={202} label="H" />
          <MapMarker x={633} y={238} label="B" />
        </>
      )}
    </>
  );
}

function ShrineLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <>
      <path d="M156 72 H492 V394 H156 Z" fill={palette.featureFill} opacity="0.25" />
      <MapRoom x={88} y={170} w={132} h={92} label="1" fill={palette.roomFill} />
      <MapRoom x={260} y={150} w={128} h={108} label="2" fill={palette.roomFill} />
      <MapRoom x={424} y={168} w={112} h={86} label="3" fill={palette.roomFill} />
      <MapRoom x={432} y={310} w={116} h={76} label="4" fill={palette.roomFill} />
      <MapRoom x={270} y={302} w={118} h={84} label="5" fill={palette.roomFill} />
      <MapRoom x={118} y={318} w={98} h={72} label="6" fill={palette.finalFill} />
      <Corridors paths={['M220 216 H260', 'M388 206 H424', 'M480 254 V310', 'M432 348 H388', 'M270 344 H216', 'M152 318 V262']} />
      <path d="M318 258 C304 284 292 304 274 326 M216 352 C242 378 284 400 336 386" stroke={palette.secretStroke} strokeWidth="5" strokeDasharray="9 9" fill="none" />
      {!isPlayer && (
        <>
          <MapMarker x={366} y={172} label="H" />
          <MapMarker x={528} y={326} label="T" />
          <MapMarker x={202} y={334} label="B" />
        </>
      )}
    </>
  );
}

function CavernLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <>
      <path d="M52 226 C142 118 196 318 286 194 S440 80 526 188 S612 354 684 278" stroke={palette.featureFill} strokeWidth="52" strokeLinecap="round" fill="none" opacity="0.75" />
      <OvalRoom cx={96} cy={238} rx={68} ry={52} label="1" fill={palette.roomFill} />
      <OvalRoom cx={218} cy={174} rx={72} ry={48} label="2" fill={palette.roomFill} />
      <OvalRoom cx={222} cy={326} rx={68} ry={48} label="3" fill={palette.roomFill} />
      <OvalRoom cx={352} cy={220} rx={86} ry={62} label="4" fill={palette.roomFill} />
      <OvalRoom cx={498} cy={154} rx={70} ry={52} label="5" fill={palette.roomFill} />
      <OvalRoom cx={600} cy={300} rx={78} ry={58} label="6" fill={palette.finalFill} />
      <Corridors paths={['M156 224 C180 208 190 192 218 174', 'M156 252 C184 276 194 306 222 326', 'M286 186 C310 196 326 208 352 220', 'M424 210 C452 188 470 170 498 154', 'M540 198 C568 234 584 264 600 300', 'M288 316 C388 350 466 348 548 316']} />
      <path d="M262 334 C318 388 428 388 518 328 M432 200 C466 244 504 268 574 286" stroke={palette.secretStroke} strokeWidth="5" strokeDasharray="10 10" fill="none" />
      {!isPlayer && (
        <>
          <MapMarker x={410} y={184} label="H" />
          <MapMarker x={270} y={300} label="T" />
          <MapMarker x={652} y={276} label="B" />
        </>
      )}
    </>
  );
}

function CryptLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <>
      <path d="M92 86 H628 V394 H92 Z" fill={palette.featureFill} opacity="0.3" />
      <MapRoom x={296} y={50} w={128} h={78} label="1" fill={palette.roomFill} />
      <MapRoom x={256} y={170} w={208} h={90} label="2" fill={palette.roomFill} />
      <MapRoom x={88} y={174} w={122} h={86} label="3" fill={palette.roomFill} />
      <MapRoom x={510} y={174} w={122} h={86} label="4" fill={palette.roomFill} />
      <MapRoom x={136} y={326} w={140} h={78} label="5" fill={palette.roomFill} />
      <MapRoom x={444} y={326} w={140} h={78} label="6" fill={palette.finalFill} />
      <Corridors paths={['M360 128 V170', 'M256 214 H210', 'M464 214 H510', 'M210 260 C214 298 244 310 276 342', 'M510 260 C506 298 476 310 444 342', 'M276 366 H444']} />
      <path d="M150 216 C218 138 500 138 570 216 M206 326 C282 282 438 282 514 326" stroke={palette.secretStroke} strokeWidth="5" strokeDasharray="8 10" fill="none" />
      {!isPlayer && (
        <>
          <MapMarker x={190} y={192} label="H" />
          <MapMarker x={258} y={346} label="T" />
          <MapMarker x={566} y={346} label="B" />
        </>
      )}
    </>
  );
}

function SewerLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <>
      <path d="M48 238 H674 M156 238 V104 M280 238 V372 M402 238 V110 M536 238 V368" stroke={palette.featureFill} strokeWidth="62" strokeLinecap="round" fill="none" opacity="0.75" />
      <MapRoom x={58} y={196} w={108} h={84} label="1" fill={palette.roomFill} />
      <MapRoom x={220} y={196} w={120} h={84} label="2" fill={palette.roomFill} />
      <MapRoom x={96} y={74} w={120} h={76} label="3" fill={palette.roomFill} />
      <MapRoom x={358} y={194} w={116} h={88} label="4" fill={palette.roomFill} />
      <MapRoom x={468} y={330} w={136} h={82} label="5" fill={palette.roomFill} />
      <MapRoom x={570} y={178} w={112} h={114} label="6" fill={palette.finalFill} />
      <Corridors paths={['M166 238 H220', 'M340 238 H358', 'M474 238 H570', 'M156 196 V150', 'M280 280 V372', 'M536 330 V282']} />
      <path d="M156 150 C208 174 252 192 280 238 M474 282 C512 306 540 324 566 358" stroke={palette.secretStroke} strokeWidth="5" strokeDasharray="12 8" fill="none" />
      {!isPlayer && (
        <>
          <MapMarker x={324} y={214} label="H" />
          <MapMarker x={458} y={216} label="T" />
          <MapMarker x={660} y={202} label="B" />
        </>
      )}
    </>
  );
}

function LaboratoryLayout({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <>
      <path d="M66 112 H232 V66 H436 V142 H620 V318 H506 V414 H264 V362 H90 Z" fill={palette.featureFill} opacity="0.3" />
      <MapRoom x={74} y={92} w={142} h={82} label="1" fill={palette.roomFill} />
      <MapRoom x={274} y={60} w={152} h={98} label="2" fill={palette.roomFill} />
      <MapRoom x={506} y={96} w={126} h={110} label="3" fill={palette.roomFill} />
      <MapRoom x={92} y={284} w={136} h={96} label="4" fill={palette.roomFill} />
      <MapRoom x={306} y={302} w={128} h={92} label="5" fill={palette.roomFill} />
      <MapRoom x={520} y={286} w={132} h={116} label="6" fill={palette.finalFill} />
      <Corridors paths={['M216 132 H274', 'M426 110 H506', 'M568 206 V286', 'M434 348 H520', 'M228 332 H306', 'M158 284 V174', 'M364 158 V302']} />
      <path d="M178 172 C234 222 286 260 342 318 M426 350 C482 300 528 246 568 206" stroke={palette.secretStroke} strokeWidth="5" strokeDasharray="7 9" fill="none" />
      {!isPlayer && (
        <>
          <MapMarker x={410} y={82} label="H" />
          <MapMarker x={420} y={324} label="T" />
          <MapMarker x={636} y={314} label="B" />
        </>
      )}
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
  const roomFill = colorEnabled && !isPlayer ? '#e6f0df' : '#f8f5ef';
  const palette: MapPalette = {
    roomFill,
    featureFill: colorEnabled ? '#cfe7ee' : '#e9e4da',
    secretStroke: isPlayer ? 'transparent' : '#b85c38',
    finalFill: colorEnabled && !isPlayer ? '#ead9cc' : '#f8f5ef',
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
        <rect x="0" y="0" width="720" height="480" fill="#efe7d6" />
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
