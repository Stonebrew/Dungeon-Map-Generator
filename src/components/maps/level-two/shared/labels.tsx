import type { MapPresentation, RoomNumberPoint } from '../types';

export function LevelTwoRoomNumber({ x, y, label, presentation = 'screen' }: RoomNumberPoint & { presentation?: MapPresentation }) {
  const isPrint = presentation === 'print';
  return (
    <g>
      <rect x={x - (isPrint ? 23 : 20)} y={y - (isPrint ? 23 : 20)} width={isPrint ? 46 : 40} height={isPrint ? 46 : 40} rx={isPrint ? 12 : 10} fill="#fffaf2" opacity={isPrint ? '0.96' : '0.82'} stroke={isPrint ? '#211a16' : 'none'} strokeWidth={isPrint ? '1.8' : '0'} />
      <text x={x} y={y + (isPrint ? 10 : 9)} textAnchor="middle" fontSize={isPrint ? '36' : '34'} fontWeight="900" fill="#130f0c" paintOrder="stroke" stroke="#fffaf2" strokeWidth={isPrint ? '6' : '4'}>
        {label}
      </text>
    </g>
  );
}

export function LevelTwoRoomNumbers({ rooms, presentation = 'screen' }: { rooms: RoomNumberPoint[]; presentation?: MapPresentation }) {
  return (
    <>
      {rooms.map((room) => (
        <LevelTwoRoomNumber key={room.label} {...room} presentation={presentation} />
      ))}
    </>
  );
}

export function LevelTwoMarker({ x, y, label, presentation = 'screen' }: { x: number; y: number; label: string; presentation?: MapPresentation }) {
  const isPrint = presentation === 'print';
  return (
    <g filter="url(#markerInk)">
      <circle cx={x} cy={y} r={isPrint ? '13.5' : '12'} fill="#fff8ef" stroke="#5f2f1f" strokeWidth={isPrint ? '3.2' : '2.5'} />
      <circle cx={x} cy={y} r={isPrint ? '9.4' : '8.5'} fill="#a94d30" opacity={isPrint ? '1' : '0.94'} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={isPrint ? '12' : '11'} fontWeight="900" fill="#fff8ef">
        {label}
      </text>
    </g>
  );
}
