import { PitchCoordinates } from "@/types/pitch";

export const getDistanceInZones = (
  from: PitchCoordinates,
  to: PitchCoordinates,
): number => Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
