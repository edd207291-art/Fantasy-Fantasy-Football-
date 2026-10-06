import { Pitch, PitchZone } from "@/types/pitch";

export const findBallZone = (pitch: Pitch): PitchZone | null => {
  for (const row of pitch) {
    for (const zone of row) {
      if (zone.containsBall) {
        return zone;
      }
    }
  }

  return null;
};
