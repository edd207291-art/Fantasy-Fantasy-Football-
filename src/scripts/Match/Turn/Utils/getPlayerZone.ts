import { Pitch, PitchZone } from "@/types/pitch";

export const getPlayerZone = (
  pitch: Pitch,
  playerId: string,
): PitchZone | null => {
  for (const row of pitch) {
    for (const zone of row) {
      if (zone.playerId === playerId) {
        return zone;
      }
    }
  }

  return null;
};
