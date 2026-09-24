import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { performCheck } from "../Checks/performCheck";
import { getDistanceInSquares } from "./Utils/getDistanceInSquares";
import { getRandomOffset } from "./Utils/getRandomOffset";
import { moveTowardCoordinate } from "./Utils/moveTowardCoordinate";

export type MoveOutcome = {
  paceRoll: number;
  moveSuccess: boolean;
  movedTo: PitchCoordinates;
  startedAt: PitchCoordinates;
  endedAt: PitchCoordinates;
  distance: number;
  usedFastMove: boolean;
  dribbleRoll?: number;
  dribbleSuccess?: boolean;
  ballLost: boolean;
  ballZone?: PitchCoordinates;
  pitch: Pitch;
  newPitch: Pitch;
};

export const movePlayer = (
  pitch: Pitch,
  player: Player,
  fromZone: PitchZone,
  toZone: PitchZone,
  hasBall: boolean = false,
): MoveOutcome => {
  const startedAt = { ...fromZone.coordinates };
  const destination = { ...toZone.coordinates };
  const distance = getDistanceInSquares(startedAt, destination);

  let movedTo = { ...startedAt };
  let paceRoll = 0;
  let moveSuccess = true;
  let usedFastMove = false;
  let ballLost = false;
  let dribbleRoll = 0;
  let dribbleSuccess = true;
  let ballZone: PitchCoordinates | undefined;

  if (distance <= 3) {
    movedTo = { ...destination };
  } else {
    paceRoll = performCheck(player.Pace);
    usedFastMove = true;

    if (paceRoll >= 0) {
      movedTo = moveTowardCoordinate(startedAt, destination, 6);
    } else {
      movedTo = { ...startedAt };
      moveSuccess = false;
    }
  }

  const attemptedZone = pitch[movedTo.y]?.[movedTo.x];
  if (attemptedZone?.playerId && attemptedZone.playerId !== player.id) {
    const movementLimit = moveSuccess ? (distance <= 3 ? distance : 6) : 0;
    const adjacentZones: PitchZone[] = [];

    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        if (offsetX === 0 && offsetY === 0) {
          continue;
        }

        const adjacentZone = pitch[movedTo.y + offsetY]?.[movedTo.x + offsetX];

        if (
          adjacentZone &&
          !adjacentZone.playerId &&
          getDistanceInSquares(startedAt, adjacentZone.coordinates) <=
            movementLimit
        ) {
          adjacentZones.push(adjacentZone);
        }
      }
    }

    adjacentZones.sort(
      (first, second) =>
        getDistanceInSquares(first.coordinates, destination) -
        getDistanceInSquares(second.coordinates, destination),
    );

    movedTo = adjacentZones[0]?.coordinates ?? { ...startedAt };
  }

  if (hasBall && usedFastMove && moveSuccess) {
    dribbleRoll = performCheck(player.Dribbling);
    dribbleSuccess = dribbleRoll >= 0;

    if (!dribbleSuccess) {
      ballLost = true;
      ballZone = getRandomOffset(movedTo, 1, pitch);
    }
  }

  const newPitch = pitch.map((row) =>
    row.map((zone) => ({
      ...zone,
      containsBall: hasBall ? false : zone.containsBall,
    })),
  );

  for (const row of newPitch) {
    for (const zone of row) {
      if (zone.playerId === player.id) {
        zone.playerId = undefined;
      }
    }
  }

  const finalZone = newPitch[movedTo.y]?.[movedTo.x];
  const picksUpBall = finalZone?.containsBall === true;

  if (finalZone) {
    finalZone.playerId = player.id;
    finalZone.containsBall = (hasBall || picksUpBall) && !ballLost;
  }

  if (ballZone) {
    const looseBallZone = newPitch[ballZone.y]?.[ballZone.x];

    if (looseBallZone) {
      looseBallZone.containsBall = true;
    }
  }

  return {
    paceRoll,
    moveSuccess,
    movedTo,
    startedAt,
    endedAt: movedTo,
    distance,
    usedFastMove,
    dribbleRoll,
    dribbleSuccess,
    ballLost,
    ballZone,
    pitch,
    newPitch,
  };
};

export default movePlayer;
