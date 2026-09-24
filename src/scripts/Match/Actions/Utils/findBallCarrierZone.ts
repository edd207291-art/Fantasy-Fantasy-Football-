import { Pitch, PitchZone } from "@/types/pitch";

export const findBallCarrierZone = (pitch: Pitch): PitchZone | null =>
  pitch.flat().find((zone) => zone.containsBall) ?? null;

export default findBallCarrierZone;
