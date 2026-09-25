import { PitchCoordinates } from "@/types/pitch";

export const moveTowardCoordinate = (
  from: PitchCoordinates,
  destination: PitchCoordinates,
  maxSteps: number,
): PitchCoordinates => {
  const deltaX = destination.x - from.x;
  const deltaY = destination.y - from.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  const moveX = absX > 0 ? Math.sign(deltaX) * Math.min(maxSteps, absX) : 0;
  const moveY = absY > 0 ? Math.sign(deltaY) * Math.min(maxSteps, absY) : 0;

  return {
    x: from.x + moveX,
    y: from.y + moveY,
  };
};

export default moveTowardCoordinate;
