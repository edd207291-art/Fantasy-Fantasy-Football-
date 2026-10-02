import { Pitch, PitchZone } from "@/types/pitch";

export const findBallZone = (pitch: Pitch): PitchZone | null =>
  pitch.flat().find((zone) => zone.containsBall) ?? null;
