import { Copy, MousePointer2, Route, Tag, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { mockDungeons } from '../../data/mockDungeon';
import { DEFAULT_PREMIUM_MAP_BOUNDS, getPremiumAnchorPoint, getPremiumPercentPoint } from '../maps/premium/premiumMapGeometry';
import type { Dungeon, MapConnection, PremiumMapMarkerAnchor, PremiumMapMetadata, PremiumMapOverlayAnchor, PremiumMapRouteOverlay, RouteDifficulty, RouteStyle } from '../../types';

type AnnotatorMode = 'room' | 'marker' | 'route' | 'select';
type PreviewMode = 'gm' | 'player';
type MarkerType = PremiumMapMarkerAnchor['marker'];

type DragTarget =
  | { type: 'room'; roomNumber: number }
  | { type: 'marker'; index: number }
  | { type: 'routePoint'; routeId: string; pointIndex: number };

type SelectedAnnotation = DragTarget | undefined;

type LocalPremiumMapAsset = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml';
  alt?: string;
};

type DraftRoute = {
  id: string;
  from: number;
  to: number;
  type: 'secret';
  points: { xPercent: number; yPercent: number }[];
  path?: string;
  edited?: boolean;
};

type DraftConnection = {
  id: string;
  from: number;
  to: number;
  type: 'normal' | 'secret';
  routeStyle: RouteStyle;
  routeDifficulty: RouteDifficulty;
  note: string;
  path?: string;
  oneWay?: boolean;
};

const localPremiumMapAssets: LocalPremiumMapAsset[] = [
  {
    id: 'premium-test-temple-map',
    name: 'Test Temple Map',
    url: '/premium-maps/test-temple-map.png',
    width: 1254,
    height: 1254,
    mimeType: 'image/png',
  },
  {
    id: 'premium-volcanic-ruin-1',
    name: 'Volcanic Ruins Test 1',
    url: '/premium-maps/volcanic-ruin-1.png',
    width: 1448,
    height: 1086,
    mimeType: 'image/png',
  },
];

const premiumMapDungeons = mockDungeons.filter((dungeon) => Boolean(dungeon.map.premiumMap));
const markerTypes: MarkerType[] = ['treasure', 'hazard', 'objective', 'boss', 'secret', 'custom'];
const routeStyles: RouteStyle[] = ['corridor', 'trail', 'bridge', 'tunnel', 'ledge', 'channel', 'stair', 'crawl', 'servicePath', 'causeway', 'ford', 'grate'];
const routeDifficulties: RouteDifficulty[] = ['clear', 'narrow', 'unstable', 'hidden', 'hazardous', 'blocked'];

function roundPercent(value: number) {
  return Number(value.toFixed(2));
}

function clampPercent(value: number) {
  return roundPercent(Math.min(100, Math.max(0, value)));
}

function overlayPoint(point: { xPercent?: number; yPercent?: number; x?: number; y?: number }) {
  return getPremiumAnchorPoint({ roomNumber: 0, ...point }, DEFAULT_PREMIUM_MAP_BOUNDS) ?? { x: DEFAULT_PREMIUM_MAP_BOUNDS.x, y: DEFAULT_PREMIUM_MAP_BOUNDS.y };
}

function routePath(points: DraftRoute['points']) {
  return points
    .map((point, index) => {
      const { x, y } = overlayPoint(point);
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
}

function routePreviewPath(points: DraftRoute['points']) {
  return routePath(points);
}

function routeExportPath(route: DraftRoute) {
  if (!route.edited && route.path?.trim()) {
    return route.path;
  }

  return routePath(route.points);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function slugifyAssetId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function mimeTypeFromPath(path: string): LocalPremiumMapAsset['mimeType'] | undefined {
  const normalizedPath = path.toLowerCase();

  if (normalizedPath.endsWith('.png')) return 'image/png';
  if (normalizedPath.endsWith('.jpg') || normalizedPath.endsWith('.jpeg')) return 'image/jpeg';
  if (normalizedPath.endsWith('.webp')) return 'image/webp';
  if (normalizedPath.endsWith('.svg')) return 'image/svg+xml';

  return undefined;
}

function copyText(value: string) {
  void navigator.clipboard?.writeText(value);
}

function svgPercentPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const transformed = point.matrixTransform(svg.getScreenCTM()?.inverse());
  const percentPoint = getPremiumPercentPoint(transformed.x, transformed.y, DEFAULT_PREMIUM_MAP_BOUNDS);

  return {
    xPercent: clampPercent(percentPoint.xPercent),
    yPercent: clampPercent(percentPoint.yPercent),
  };
}

function isSelected(selected: SelectedAnnotation, target: DragTarget) {
  if (!selected || selected.type !== target.type) {
    return false;
  }

  if (selected.type === 'room' && target.type === 'room') {
    return selected.roomNumber === target.roomNumber;
  }

  if (selected.type === 'marker' && target.type === 'marker') {
    return selected.index === target.index;
  }

  if (selected.type === 'routePoint' && target.type === 'routePoint') {
    return selected.routeId === target.routeId && selected.pointIndex === target.pointIndex;
  }

  return false;
}

function formatMetadata(asset: LocalPremiumMapAsset, rooms: PremiumMapOverlayAnchor[], markers: PremiumMapMarkerAnchor[], routes: DraftRoute[], showNormalRouteOverlay: boolean) {
  const routeOverlayPaths: PremiumMapRouteOverlay[] = routes
    .filter((route) => route.path?.trim() || route.points.length > 1)
    .map((route) => ({
      from: route.from,
      to: route.to,
      type: 'secret',
      path: routeExportPath(route),
    }));

  const gmOverlay = {
    viewBox: '0 0 720 480',
    labelAnchors: rooms,
    markerAnchors: markers,
    routeOverlayPaths,
    notes: 'Generated by the dev-only premium map annotator. Review alignment before committing.',
  };

  const playerOverlay = {
    viewBox: '0 0 720 480',
    labelAnchors: rooms,
  };

  const premiumMap: PremiumMapMetadata = {
    status: 'available',
    baseMapImage: {
      id: asset.id,
      url: asset.url,
      width: asset.width,
      height: asset.height,
      ...(asset.mimeType ? { mimeType: asset.mimeType } : {}),
      ...(asset.alt ? { alt: asset.alt } : {}),
    },
    imageSize: {
      width: asset.width,
      height: asset.height,
    },
      mapBounds: {
      ...DEFAULT_PREMIUM_MAP_BOUNDS,
    },
    overlayViewBox: '0 0 720 480',
    printableMapVariant: 'standard',
    showNormalRouteOverlay,
    gmOverlay,
    playerOverlay,
    printNotes: 'Generated from the dev-only premium map annotator.',
  };

  return JSON.stringify(premiumMap, null, 2);
}

function formatConnections(connections: DraftConnection[]) {
  const mapConnections: MapConnection[] = connections.map((connection) => ({
    from: connection.from,
    to: connection.to,
    type: connection.type,
    routeStyle: connection.routeStyle,
    routeDifficulty: connection.routeDifficulty,
    ...(connection.note ? { note: connection.note } : {}),
    ...(connection.path ? { path: connection.path } : {}),
    ...(connection.oneWay ? { oneWay: connection.oneWay } : {}),
  }));

  return JSON.stringify(
    mapConnections.map((connection) => ({
      from: connection.from,
      to: connection.to,
      type: connection.type,
      routeStyle: connection.routeStyle,
      routeDifficulty: connection.routeDifficulty,
      ...(connection.note ? { note: connection.note } : {}),
      ...(connection.path ? { path: connection.path } : {}),
      ...(connection.oneWay ? { oneWay: connection.oneWay } : {}),
    })),
    null,
    2,
  );
}

function assetFromPremiumMap(premiumMap: PremiumMapMetadata | undefined): LocalPremiumMapAsset | undefined {
  const asset = premiumMap?.baseMapImage ?? premiumMap?.gmBaseMapImage ?? premiumMap?.playerBaseMapImage;

  if (!asset) {
    return undefined;
  }

  return {
    id: asset.id,
    name: asset.alt ?? asset.id,
    url: asset.url,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
    alt: asset.alt,
  };
}

function uniqueAssets(assets: LocalPremiumMapAsset[]) {
  const seen = new Set<string>();

  return assets.filter((asset) => {
    const key = `${asset.id}:${asset.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function anchorToPercent(anchor: PremiumMapOverlayAnchor, bounds = { x: 0, y: 0, width: 720, height: 480 }) {
  if (Number.isFinite(anchor.xPercent) && Number.isFinite(anchor.yPercent)) {
    return {
      xPercent: roundPercent(anchor.xPercent as number),
      yPercent: roundPercent(anchor.yPercent as number),
    };
  }

  if (Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) {
    return {
      xPercent: roundPercent((((anchor.x as number) - bounds.x) / bounds.width) * 100),
      yPercent: roundPercent((((anchor.y as number) - bounds.y) / bounds.height) * 100),
    };
  }

  return undefined;
}

function routePathToPercentPoints(path: string) {
  const numbers = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const points: DraftRoute['points'] = [];

  for (let index = 0; index < numbers.length - 1; index += 2) {
    const percentPoint = getPremiumPercentPoint(numbers[index], numbers[index + 1], DEFAULT_PREMIUM_MAP_BOUNDS);
    points.push({
      xPercent: clampPercent(percentPoint.xPercent),
      yPercent: clampPercent(percentPoint.yPercent),
    });
  }

  return points;
}

function draftConnectionsFromDungeon(dungeon: Dungeon): DraftConnection[] {
  return (dungeon.map.connections ?? []).map((connection, index) => ({
    id: createId(`connection-${index}`),
    from: connection.from,
    to: connection.to,
    type: connection.type,
    routeStyle: connection.routeStyle ?? (connection.type === 'secret' ? 'crawl' : 'trail'),
    routeDifficulty: connection.routeDifficulty ?? (connection.type === 'secret' ? 'hidden' : 'clear'),
    note: connection.note ?? '',
    path: connection.path,
    oneWay: connection.oneWay,
  }));
}

export function PremiumMapAnnotator() {
  const [customAssets, setCustomAssets] = useState<LocalPremiumMapAsset[]>([]);
  const availableAssets = useMemo(
    () => uniqueAssets([...localPremiumMapAssets, ...customAssets, ...premiumMapDungeons.flatMap((dungeon) => assetFromPremiumMap(dungeon.map.premiumMap) ?? [])]),
    [customAssets],
  );
  const [assetId, setAssetId] = useState(localPremiumMapAssets[0].id);
  const [selectedDungeonId, setSelectedDungeonId] = useState('blank');
  const [customImageName, setCustomImageName] = useState('');
  const [customImagePath, setCustomImagePath] = useState('');
  const [customImageStatus, setCustomImageStatus] = useState<string | undefined>();
  const [isLoadingCustomImage, setIsLoadingCustomImage] = useState(false);
  const [mode, setMode] = useState<AnnotatorMode>('room');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('gm');
  const [roomNumber, setRoomNumber] = useState(1);
  const [markerRoomNumber, setMarkerRoomNumber] = useState(1);
  const [markerType, setMarkerType] = useState<MarkerType>('treasure');
  const [customLabel, setCustomLabel] = useState('');
  const [routeFrom, setRouteFrom] = useState(1);
  const [routeTo, setRouteTo] = useState(2);
  const [rooms, setRooms] = useState<PremiumMapOverlayAnchor[]>([]);
  const [markers, setMarkers] = useState<PremiumMapMarkerAnchor[]>([]);
  const [routes, setRoutes] = useState<DraftRoute[]>([]);
  const [activeRouteId, setActiveRouteId] = useState<string | undefined>();
  const [connections, setConnections] = useState<DraftConnection[]>([]);
  const [showNormalRouteOverlay, setShowNormalRouteOverlay] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<SelectedAnnotation>();
  const [dragTarget, setDragTarget] = useState<DragTarget>();
  const [connectionFrom, setConnectionFrom] = useState(1);
  const [connectionTo, setConnectionTo] = useState(2);
  const [connectionType, setConnectionType] = useState<'normal' | 'secret'>('normal');
  const [connectionRouteStyle, setConnectionRouteStyle] = useState<RouteStyle>('trail');
  const [connectionDifficulty, setConnectionDifficulty] = useState<RouteDifficulty>('clear');
  const [connectionNote, setConnectionNote] = useState('');

  const asset = availableAssets.find((item) => item.id === assetId) ?? availableAssets[0];
  const metadataOutput = useMemo(() => formatMetadata(asset, rooms, markers, routes, showNormalRouteOverlay), [asset, markers, rooms, routes, showNormalRouteOverlay]);
  const connectionsOutput = useMemo(() => formatConnections(connections), [connections]);
  const activeRoute = routes.find((route) => route.id === activeRouteId);

  const clearAnnotations = () => {
    setRooms([]);
    setMarkers([]);
    setRoutes([]);
    setConnections([]);
    setShowNormalRouteOverlay(false);
    setSelectedAnnotation(undefined);
    setDragTarget(undefined);
    setActiveRouteId(undefined);
    setRoomNumber(1);
    setMarkerRoomNumber(1);
    setRouteFrom(1);
    setRouteTo(2);
    setConnectionFrom(1);
    setConnectionTo(2);
    setConnectionType('normal');
    setConnectionRouteStyle('trail');
    setConnectionDifficulty('clear');
    setConnectionNote('');
  };

  const resetToBlank = () => {
    setSelectedDungeonId('blank');
    setAssetId(availableAssets[0].id);
    clearAnnotations();
  };

  const loadCustomImage = () => {
    const trimmedPath = customImagePath.trim();
    const trimmedName = customImageName.trim();

    if (!trimmedPath.startsWith('/premium-maps/')) {
      setCustomImageStatus('Could not load image. Check that the file exists in public/premium-maps/ and that the path starts with /premium-maps/.');
      return;
    }

    setIsLoadingCustomImage(true);
    setCustomImageStatus('Loading custom image...');

    const image = new Image();
    image.onload = () => {
      const idBase = trimmedName || trimmedPath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'custom-premium-map';
      const customAsset: LocalPremiumMapAsset = {
        id: `custom-${slugifyAssetId(idBase) || 'premium-map'}`,
        name: trimmedName || idBase,
        url: trimmedPath,
        width: image.naturalWidth,
        height: image.naturalHeight,
        mimeType: mimeTypeFromPath(trimmedPath),
      };

      setCustomAssets((current) => uniqueAssets([...current.filter((asset) => asset.url !== customAsset.url), customAsset]));
      setSelectedDungeonId('blank');
      setAssetId(customAsset.id);
      clearAnnotations();
      setCustomImageStatus(`Loaded ${customAsset.name} (${customAsset.width}x${customAsset.height}).`);
      setIsLoadingCustomImage(false);
    };
    image.onerror = () => {
      setCustomImageStatus('Could not load image. Check that the file exists in public/premium-maps/ and that the path starts with /premium-maps/.');
      setIsLoadingCustomImage(false);
    };
    image.src = trimmedPath;
  };

  const loadDungeon = (dungeonId: string) => {
    if (dungeonId === 'blank') {
      resetToBlank();
      return;
    }

    const dungeon = premiumMapDungeons.find((item) => item.id === dungeonId);
    const premiumMap = dungeon?.map.premiumMap;
    const loadedAsset = assetFromPremiumMap(premiumMap);

    if (!dungeon || !premiumMap || !loadedAsset) {
      return;
    }

    const bounds = premiumMap.mapBounds ?? { x: 0, y: 0, width: 720, height: 480 };
    const gmOverlay = premiumMap.gmOverlay;
    const loadedRooms = (premiumMap.playerOverlay?.labelAnchors ?? gmOverlay?.labelAnchors ?? [])
      .flatMap((anchor) => {
        const point = anchorToPercent(anchor, bounds);
        return point ? [{ roomNumber: anchor.roomNumber, label: anchor.label, ...point }] : [];
      })
      .sort((a, b) => a.roomNumber - b.roomNumber);
    const loadedMarkers = (gmOverlay?.markerAnchors ?? []).flatMap((anchor) => {
      const point = anchorToPercent(anchor, bounds);
      return point ? [{ roomNumber: anchor.roomNumber, marker: anchor.marker, label: anchor.label, ...point }] : [];
    });
    const loadedRoutes = (gmOverlay?.routeOverlayPaths ?? [])
      .filter((route) => route.type === 'secret' && route.path?.trim())
      .map((route, index) => ({
        id: createId(`route-${index}`),
        from: route.from,
        to: route.to,
        type: 'secret' as const,
        path: route.path,
        points: routePathToPercentPoints(route.path),
      }));

    setSelectedDungeonId(dungeon.id);
    setAssetId(loadedAsset.id);
    setRooms(loadedRooms);
    setMarkers(loadedMarkers);
    setRoutes(loadedRoutes);
    setConnections(draftConnectionsFromDungeon(dungeon));
    setShowNormalRouteOverlay(Boolean(premiumMap.showNormalRouteOverlay));
    setSelectedAnnotation(undefined);
    setDragTarget(undefined);
    setActiveRouteId(undefined);
    setRoomNumber((loadedRooms.at(-1)?.roomNumber ?? 0) + 1);
    setMarkerRoomNumber(loadedRooms[0]?.roomNumber ?? 1);
    setRouteFrom(loadedRoutes[0]?.from ?? 1);
    setRouteTo(loadedRoutes[0]?.to ?? 2);
    setConnectionFrom(dungeon.map.connections?.at(-1)?.to ?? 1);
    setConnectionTo((dungeon.map.connections?.at(-1)?.to ?? 1) + 1);
  };

  const handleMapClick = (event: MouseEvent<SVGSVGElement>) => {
    if (dragTarget) {
      return;
    }

    const { xPercent, yPercent } = svgPercentPoint(event.currentTarget, event.clientX, event.clientY);

    if (mode === 'room') {
      setRooms((current) => {
        const next = current.filter((room) => room.roomNumber !== roomNumber);
        return [...next, { roomNumber, xPercent, yPercent }].sort((a, b) => a.roomNumber - b.roomNumber);
      });
      setSelectedAnnotation({ type: 'room', roomNumber });
      setRoomNumber((current) => current + 1);
    }

    if (mode === 'marker') {
      setMarkers((current) => [
        ...current,
        {
          roomNumber: markerRoomNumber,
          marker: markerType,
          xPercent,
          yPercent,
          ...(markerType === 'custom' && customLabel ? { label: customLabel } : {}),
        },
      ]);
      setSelectedAnnotation({ type: 'marker', index: markers.length });
    }

    if (mode === 'route') {
      setRoutes((current) => {
        const existing = current.find((route) => route.id === activeRouteId);
        if (existing) {
          setSelectedAnnotation({ type: 'routePoint', routeId: existing.id, pointIndex: existing.points.length });
          return current.map((route) => (route.id === existing.id ? { ...route, edited: true, points: [...route.points, { xPercent, yPercent }] } : route));
        }

        const nextRoute = {
          id: createId('route'),
          from: routeFrom,
          to: routeTo,
          type: 'secret' as const,
          points: [{ xPercent, yPercent }],
        };
        setActiveRouteId(nextRoute.id);
        setSelectedAnnotation({ type: 'routePoint', routeId: nextRoute.id, pointIndex: 0 });
        return [...current, nextRoute];
      });
    }
  };

  const moveAnnotation = (target: DragTarget, xPercent: number, yPercent: number) => {
    if (target.type === 'room') {
      setRooms((current) => current.map((room) => (room.roomNumber === target.roomNumber ? { ...room, xPercent, yPercent } : room)));
      return;
    }

    if (target.type === 'marker') {
      setMarkers((current) => current.map((marker, index) => (index === target.index ? { ...marker, xPercent, yPercent } : marker)));
      return;
    }

    setRoutes((current) =>
      current.map((route) =>
        route.id === target.routeId
          ? {
              ...route,
              edited: true,
              points: route.points.map((point, index) => (index === target.pointIndex ? { xPercent, yPercent } : point)),
            }
          : route,
      ),
    );
  };

  const startDrag = (target: DragTarget) => (event: PointerEvent<SVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) {
      return;
    }
    const { xPercent, yPercent } = svgPercentPoint(svg, event.clientX, event.clientY);
    setSelectedAnnotation(target);
    setDragTarget(target);
    moveAnnotation(target, xPercent, yPercent);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragTarget) {
      return;
    }

    event.preventDefault();
    const { xPercent, yPercent } = svgPercentPoint(event.currentTarget, event.clientX, event.clientY);
    moveAnnotation(dragTarget, xPercent, yPercent);
  };

  const finishDrag = () => {
    setDragTarget(undefined);
  };

  const addConnection = () => {
    setConnections((current) => [
      ...current,
      {
        id: createId('connection'),
        from: connectionFrom,
        to: connectionTo,
        type: connectionType,
        routeStyle: connectionRouteStyle,
        routeDifficulty: connectionDifficulty,
        note: connectionNote,
      },
    ]);
    setConnectionFrom(connectionTo);
    setConnectionTo(connectionTo + 1);
    setConnectionNote('');
  };

  return (
    <div className="min-h-screen bg-[#17130f] p-4 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 rounded-md border border-white/10 bg-white/8 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Prototype Dev Tool</p>
          <h1 className="mt-1 font-serif text-3xl font-bold">Premium Map Annotator</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
            Dev-only visual helper for placing premium map room anchors, GM markers, secret routes, and draft connections. It outputs pasteable metadata; it does not save files or call a backend.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[300px_1fr_360px]">
          <aside className="space-y-3 rounded-md border border-white/10 bg-white/8 p-3">
            <label className="block text-xs font-bold uppercase tracking-[0.14em] text-white/50" htmlFor="dungeon-source">
              Existing dungeon
            </label>
            <select id="dungeon-source" value={selectedDungeonId} onChange={(event) => loadDungeon(event.target.value)} className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              <option value="blank">Blank new metadata</option>
              {premiumMapDungeons.map((dungeon) => (
                <option key={dungeon.id} value={dungeon.id}>
                  {dungeon.title}
                </option>
              ))}
            </select>
            <p className="text-xs leading-5 text-white/50">Loading a dungeon imports its current premiumMap overlays and map.connections into this copy-only editor.</p>

            <label className="block text-xs font-bold uppercase tracking-[0.14em] text-white/50" htmlFor="asset">
              Premium map
            </label>
            <select id="asset" value={assetId} onChange={(event) => setAssetId(event.target.value)} className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              {availableAssets.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <ControlGroup title="Custom Local Image">
              <label className="block text-xs font-semibold text-white/70">
                Display name
                <input value={customImageName} onChange={(event) => setCustomImageName(event.target.value)} placeholder="My New Map" className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-white placeholder:text-white/25" />
              </label>
              <label className="block text-xs font-semibold text-white/70">
                Image path
                <input value={customImagePath} onChange={(event) => setCustomImagePath(event.target.value)} placeholder="/premium-maps/my-new-map.png" className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-white placeholder:text-white/25" />
              </label>
              <button type="button" onClick={loadCustomImage} disabled={isLoadingCustomImage} className="w-full rounded-md bg-emerald-400 px-3 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-60">
                {isLoadingCustomImage ? 'Loading image...' : 'Load Custom Image'}
              </button>
              {customImageStatus && <p className="text-xs leading-5 text-white/55">{customImageStatus}</p>}
              <p className="text-xs leading-5 text-white/45">Put the file in public/premium-maps/, then enter the public path. Dimensions are detected automatically.</p>
            </ControlGroup>

            <label className="flex items-start gap-2 rounded-md border border-white/10 bg-black/20 p-2 text-xs leading-5 text-white/60">
              <input type="checkbox" checked={showNormalRouteOverlay} onChange={(event) => setShowNormalRouteOverlay(event.target.checked)} className="mt-1" />
              <span>
                Export normal route overlays
                <span className="block text-white/40">Usually off for illustrated maps because visible paths belong in the art.</span>
              </span>
            </label>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <ToolButton active={mode === 'room'} icon={MousePointer2} label="Rooms" onClick={() => setMode('room')} />
                <ToolButton active={mode === 'marker'} icon={Tag} label="Markers" onClick={() => setMode('marker')} />
                <ToolButton active={mode === 'route'} icon={Route} label="Routes" onClick={() => setMode('route')} />
                <ToolButton active={mode === 'select'} icon={Trash2} label="Edit/Delete" onClick={() => setMode('select')} />
              </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">Preview</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPreviewMode('gm')} className={`rounded-md px-3 py-2 text-sm font-bold ${previewMode === 'gm' ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}`}>
                  GM
                </button>
                <button type="button" onClick={() => setPreviewMode('player')} className={`rounded-md px-3 py-2 text-sm font-bold ${previewMode === 'player' ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}>
                  Player
                </button>
              </div>
            </div>

            {mode === 'room' && (
              <ControlGroup title="Room Anchor">
                <NumberInput label="Room number" value={roomNumber} onChange={setRoomNumber} />
                <p className="text-xs leading-5 text-white/55">Click the map to place or replace this room anchor.</p>
              </ControlGroup>
            )}

            {mode === 'marker' && (
              <ControlGroup title="GM Marker">
                <NumberInput label="Room number" value={markerRoomNumber} onChange={setMarkerRoomNumber} />
                <SelectInput label="Marker" value={markerType} options={markerTypes} onChange={(value) => setMarkerType(value as MarkerType)} />
                {markerType === 'custom' && (
                  <label className="block text-xs font-semibold text-white/70">
                    Custom label
                    <input value={customLabel} onChange={(event) => setCustomLabel(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-white" />
                  </label>
                )}
              </ControlGroup>
            )}

            {mode === 'route' && (
              <ControlGroup title="Secret Route">
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput label="From" value={routeFrom} onChange={setRouteFrom} />
                  <NumberInput label="To" value={routeTo} onChange={setRouteTo} />
                </div>
                <p className="text-xs leading-5 text-white/55">Click multiple points to draw a GM-only secret route.</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setActiveRouteId(undefined)} className="rounded-md bg-white/10 px-2 py-1.5 text-xs font-bold">
                    Finish Route
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeRouteId) return;
                      setRoutes((current) => current.map((route) => (route.id === activeRouteId ? { ...route, edited: true, points: route.points.slice(0, -1) } : route)));
                    }}
                    className="rounded-md bg-white/10 px-2 py-1.5 text-xs font-bold"
                  >
                    Undo Point
                  </button>
                </div>
              </ControlGroup>
            )}

            <ControlGroup title="Draft Connection">
              <div className="grid grid-cols-2 gap-2">
                <NumberInput label="From" value={connectionFrom} onChange={setConnectionFrom} />
                <NumberInput label="To" value={connectionTo} onChange={setConnectionTo} />
              </div>
              <SelectInput label="Type" value={connectionType} options={['normal', 'secret']} onChange={(value) => setConnectionType(value as 'normal' | 'secret')} />
              <SelectInput label="Route style" value={connectionRouteStyle} options={routeStyles} onChange={(value) => setConnectionRouteStyle(value as RouteStyle)} />
              <SelectInput label="Difficulty" value={connectionDifficulty} options={routeDifficulties} onChange={(value) => setConnectionDifficulty(value as RouteDifficulty)} />
              <label className="block text-xs font-semibold text-white/70">
                Note
                <input value={connectionNote} onChange={(event) => setConnectionNote(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-white" />
              </label>
              <button type="button" onClick={addConnection} className="w-full rounded-md bg-amber-500 px-3 py-2 text-sm font-bold text-black">
                Add Connection
              </button>
            </ControlGroup>
          </aside>

          <main className="rounded-md border border-white/10 bg-black/25 p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-white/55">
              <span>{asset.url}</span>
              <span>{activeRoute ? `Drawing route ${activeRoute.from}-${activeRoute.to}` : '720x480 production overlay; anchors export as percent of mapBounds'}</span>
            </div>
            <svg
              viewBox="0 0 720 480"
              role="img"
              aria-label="Premium map annotation canvas"
              onClick={handleMapClick}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onPointerLeave={finishDrag}
              className="h-auto w-full cursor-crosshair touch-none rounded-md border border-white/10 bg-black"
            >
              <image href={asset.url} x="0" y="0" width="720" height="480" preserveAspectRatio="xMidYMid slice" />

              {previewMode === 'gm' &&
                routes.map((route) => (
                  <g key={route.id}>
                    {!route.edited && route.path?.trim() ? (
                      <path d={route.path} fill="none" stroke="#f59e0b" strokeDasharray="8 8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                    ) : (
                      route.points.length > 1 && <path d={routePreviewPath(route.points)} fill="none" stroke="#f59e0b" strokeDasharray="8 8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                    )}
                    {route.points.map((point, index) => {
                      const handle = overlayPoint(point);
                      return (
                        <circle
                          key={`${route.id}-${index}`}
                          cx={handle.x}
                          cy={handle.y}
                          r={isSelected(selectedAnnotation, { type: 'routePoint', routeId: route.id, pointIndex: index }) ? '8' : '6'}
                          fill="#fef3c7"
                          stroke={isSelected(selectedAnnotation, { type: 'routePoint', routeId: route.id, pointIndex: index }) ? '#38bdf8' : '#92400e'}
                          strokeWidth="2"
                          className="cursor-move"
                          onPointerDown={startDrag({ type: 'routePoint', routeId: route.id, pointIndex: index })}
                          onClick={(event) => event.stopPropagation()}
                        />
                      );
                    })}
                  </g>
                ))}

              {previewMode === 'gm' &&
                markers.map((marker, index) => {
                  const point = overlayPoint(marker);
                  return (
                    <g key={`${marker.roomNumber}-${marker.marker}-${index}`} className="cursor-move" onPointerDown={startDrag({ type: 'marker', index })} onClick={(event) => event.stopPropagation()}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isSelected(selectedAnnotation, { type: 'marker', index }) ? '15' : '12'}
                        fill="#fff8e8"
                        stroke={isSelected(selectedAnnotation, { type: 'marker', index }) ? '#38bdf8' : '#7a4d2c'}
                        strokeWidth="2"
                      />
                      <text x={point.x} y={point.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#7a4d2c">
                        {(marker.label ?? marker.marker.slice(0, 1)).toUpperCase()}
                      </text>
                    </g>
                  );
                })}

              {rooms.map((room) => {
                const point = overlayPoint(room);
                return (
                  <g key={room.roomNumber} className="cursor-move" onPointerDown={startDrag({ type: 'room', roomNumber: room.roomNumber })} onClick={(event) => event.stopPropagation()}>
                    <rect
                      x={point.x - 14}
                      y={point.y - 14}
                      width="28"
                      height="28"
                      rx="8"
                      fill="#fff8e8"
                      stroke={isSelected(selectedAnnotation, { type: 'room', roomNumber: room.roomNumber }) ? '#38bdf8' : 'transparent'}
                      strokeWidth="3"
                      opacity="0.94"
                    />
                    <text x={point.x} y={point.y + 6} textAnchor="middle" fontSize="20" fontWeight="900" fill="#211a16">
                      {room.roomNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </main>

          <aside className="space-y-3">
            <AnnotationList title="Rooms" emptyText="No room anchors yet.">
              {rooms.map((room) => (
                <ListRow key={room.roomNumber} label={`Room ${room.roomNumber}`} detail={`${room.xPercent}, ${room.yPercent}`} onDelete={() => setRooms((current) => current.filter((item) => item.roomNumber !== room.roomNumber))} />
              ))}
            </AnnotationList>

            <AnnotationList title="GM Markers" emptyText="No GM markers yet.">
              {markers.map((marker, index) => (
                <ListRow key={`${marker.roomNumber}-${marker.marker}-${index}`} label={`${marker.marker} in Room ${marker.roomNumber}`} detail={`${marker.xPercent}, ${marker.yPercent}`} onDelete={() => setMarkers((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
              ))}
            </AnnotationList>

            <AnnotationList title="Secret Routes" emptyText="No secret routes yet.">
              {routes.map((route) => (
                <ListRow key={route.id} label={`Room ${route.from} to ${route.to}`} detail={`${route.points.length} point${route.points.length === 1 ? '' : 's'}`} onDelete={() => setRoutes((current) => current.filter((item) => item.id !== route.id))} />
              ))}
            </AnnotationList>

            <AnnotationList title="Connections" emptyText="No draft connections yet.">
              {connections.map((connection) => (
                <ListRow key={connection.id} label={`${connection.from}-${connection.to} ${connection.type}`} detail={`${connection.routeStyle}, ${connection.routeDifficulty}`} onDelete={() => setConnections((current) => current.filter((item) => item.id !== connection.id))} />
              ))}
            </AnnotationList>

            <OutputBox title="premiumMap metadata" value={metadataOutput} />
            <OutputBox title="map.connections draft" value={connectionsOutput} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof MousePointer2; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-bold ${active ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/15'}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">{title}</p>
      {children}
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-xs font-semibold text-white/70">
      {label}
      <input type="number" min="1" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-white" />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-semibold text-white/70">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-white">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function AnnotationList({ title, emptyText, children }: { title: string; emptyText: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-white/10 bg-white/8 p-3">
      <h2 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">{title}</h2>
      <div className="mt-2 space-y-2">{children || <p className="text-xs text-white/45">{emptyText}</p>}</div>
    </section>
  );
}

function ListRow({ label, detail, onDelete }: { label: string; detail: string; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-black/25 px-2 py-1.5 text-xs">
      <div>
        <p className="font-bold text-white">{label}</p>
        <p className="text-white/45">{detail}</p>
      </div>
      <button type="button" onClick={onDelete} className="rounded bg-white/10 p-1 text-white/70 hover:text-white" aria-label={`Delete ${label}`}>
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

function OutputBox({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-md border border-white/10 bg-white/8 p-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">{title}</h2>
        <button type="button" onClick={() => copyText(value)} className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-black">
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Copy
        </button>
      </div>
      <textarea readOnly value={value} className="mt-2 h-56 w-full resize-y rounded-md border border-white/10 bg-black/50 p-2 font-mono text-xs leading-5 text-white/75" />
    </section>
  );
}
