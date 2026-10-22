import { getRoundedNumber } from "@/scripts/Utils/rounding";
import { FT_IN_ZONE } from "@/static/GlobalVars";
import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { performCheck } from "../../Checks/performCheck";
import { getRandomOffset } from "../Utils/getRandomOffset";

export type MoveOutcome = {
  pitch: Pitch;
  newPitch: Pitch;
};

const FREE_MOVE = getRoundedNumber(15 / FT_IN_ZONE);
const FAST_MOVE = getRoundedNumber(30 / FT_IN_ZONE);

const findClosestReachableZone = (
  pitch: Pitch,
  startedAt: PitchCoordinates,
  destination: PitchCoordinates,
  maxDistance: number,
): PitchZone | undefined => {
  let closestZone: PitchZone | undefined;
  let closestDistance = Infinity;
  const minimumY = Math.max(0, startedAt.y - maxDistance);
  const maximumY = Math.min(pitch.length - 1, startedAt.y + maxDistance);
  const minimumX = Math.max(0, startedAt.x - maxDistance);
  const maximumX = startedAt.x + maxDistance;

  for (let y = minimumY; y <= maximumY; y += 1) {
    const row = pitch[y];
    for (let x = minimumX; x <= Math.min(maximumX, row.length - 1); x += 1) {
      const zone = row[x];
      const distanceFromStart =
        Math.abs(startedAt.x - x) + Math.abs(startedAt.y - y);

      if (!zone.playerId && distanceFromStart <= maxDistance) {
        const distanceToDestination =
          Math.abs(destination.x - x) + Math.abs(destination.y - y);
        if (distanceToDestination < closestDistance) {
          closestZone = zone;
          closestDistance = distanceToDestination;
        }
      }
    }
  }

  return closestZone;
};

const movePlayerToZone = (
  pitch: Pitch,
  playerId: string,
  fromZone: PitchZone,
  movedTo: PitchCoordinates,
): Pitch =>
  pitch.map((row) =>
    row.map((zone) => {
      const isFromZone =
        fromZone.coordinates.x === zone.coordinates.x &&
        fromZone.coordinates.y === zone.coordinates.y;
      const isMovedToZone =
        movedTo.x === zone.coordinates.x && movedTo.y === zone.coordinates.y;
      return {
        ...zone,
        playerId: isFromZone
          ? undefined
          : isMovedToZone
            ? playerId
            : zone.playerId,
      };
    }),
  );

const moveBallToZone = (pitch: Pitch, destination: PitchCoordinates): Pitch =>
  pitch.map((row) =>
    row.map((zone) => ({
      ...zone,
      containsBall:
        zone.coordinates.x === destination.x &&
        zone.coordinates.y === destination.y,
    })),
  );

const resolveDribble = (
  pitch: Pitch,
  player: Player,
  fromZone: PitchZone,
  movedTo: PitchCoordinates,
): Pitch => {
  if (!fromZone.containsBall) {
    return pitch;
  }

  const dribbleSuccess = performCheck(player.attributes.Dribbling) >= 0;
  const ballDestination = dribbleSuccess
    ? movedTo
    : getRandomOffset(movedTo, 1, pitch);

  return moveBallToZone(pitch, ballDestination);
};

export const movePlayer = (
  pitch: Pitch,
  player: Player,
  fromZone: PitchZone,
  toZone: PitchZone,
): MoveOutcome => {
  const maxDistance =
    performCheck(player.attributes.Pace) >= 0 ? FAST_MOVE : FREE_MOVE;
  const closestZone = findClosestReachableZone(
    pitch,
    fromZone.coordinates,
    toZone.coordinates,
    maxDistance,
  );

  if (!closestZone) {
    return { pitch, newPitch: pitch };
  }

  const movedTo = closestZone.coordinates;
  let newPitch = movePlayerToZone(pitch, player.id, fromZone, movedTo);
  newPitch = resolveDribble(newPitch, player, fromZone, movedTo);

  return {
    newPitch,
    pitch,
  };
};
