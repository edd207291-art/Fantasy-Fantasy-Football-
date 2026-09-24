import { Pitch, PitchZone } from "@/types/pitch";
import { findBallCarrierZone } from "./findBallCarrierZone";
import { getDistanceInSquares } from "./getDistanceInSquares";

export const canTackle = (pitch: Pitch, attackerZone: PitchZone): boolean => {
  const ballCarrierZone = findBallCarrierZone(pitch);

  if (!ballCarrierZone) {
    return false;
  }

  return (
    getDistanceInSquares(
      attackerZone.coordinates,
      ballCarrierZone.coordinates,
    ) <= 3
  );
};

export default canTackle;
