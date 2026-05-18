import type { RoomNumberPoint } from '../types';

export function LevelTwoRoomNumber({ x, y, label }: RoomNumberPoint) {
  return (
    <g>
      <rect x={x - 20} y={y - 20} width="40" height="40" rx="10" fill="#fff8ef" opacity="0.82" />
      <text x={x} y={y + 9} textAnchor="middle" fontSize="34" fontWeight="900" fill="#211a16" paintOrder="stroke" stroke="#fff8ef" strokeWidth="4">
        {label}
      </text>
    </g>
  );
}

export function LevelTwoRoomNumbers({ rooms }: { rooms: RoomNumberPoint[] }) {
  return (
    <>
      {rooms.map((room) => (
        <LevelTwoRoomNumber key={room.label} {...room} />
      ))}
    </>
  );
}

export function LevelTwoMarker({ x, y, label }: { x: number; y: number; label: string }) {
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
