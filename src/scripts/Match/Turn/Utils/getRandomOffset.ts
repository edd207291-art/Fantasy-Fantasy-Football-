import { ftToZones } from "@/scripts/Utils/ftToZones";
import { Pitch, PitchCoordinates } from "@/types/pitch";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const getRandomOffset = (
  target: PitchCoordinates,
  maxDistanceFeet: number,
  pitch: Pitch,
): PitchCoordinates => {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * ftToZones(maxDistanceFeet);
  const deltaX = Math.round(Math.cos(angle) * radius);
  const deltaY = Math.round(Math.sin(angle) * radius);
  const maxX = pitch[0]?.length ?? 0;
  const maxY = pitch.length ?? 0;

  return {
    x: clamp(target.x + deltaX, 0, maxX - 1),
    y: clamp(target.y + deltaY, 0, maxY - 1),
  };
};
