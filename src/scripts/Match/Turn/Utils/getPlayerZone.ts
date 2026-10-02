import { Pitch, PitchZone } from "@/types/pitch";

export const getPlayerZone = (
  pitch: Pitch,
  playerId: string,
): PitchZone | null =>
  pitch.flat().find((zone) => zone.playerId === playerId) ?? null;
