import { Pitch, PitchCoordinates } from "@/types/pitch";

export const clearLineBetweenPoints = (
  pitch: Pitch,
  from: PitchCoordinates,
  to: PitchCoordinates,
): boolean => {
  let x = from.x;
  let y = from.y;
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);
  const stepX = from.x < to.x ? 1 : -1;
  const stepY = from.y < to.y ? 1 : -1;
  let error = deltaX - deltaY;

  while (x !== to.x || y !== to.y) {
    const doubledError = error * 2;
    if (doubledError > -deltaY) {
      error -= deltaY;
      x += stepX;
    }
    if (doubledError < deltaX) {
      error += deltaX;
      y += stepY;
    }

    if (x === to.x && y === to.y) {
      break;
    }
    if (pitch[y]?.[x]?.playerId) {
      return false;
    }
  }

  return true;
};
