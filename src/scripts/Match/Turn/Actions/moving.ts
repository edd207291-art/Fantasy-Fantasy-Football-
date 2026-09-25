import { Pitch, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { performCheck } from "../../Checks/performCheck";
import { getDistanceInSquares } from "./Utils/getDistanceInSquares";
import { getRandomOffset } from "./Utils/getRandomOffset";

export type MoveOutcome = {
  pitch: Pitch;
  newPitch: Pitch;
};

const FREE_MOVE = 3;
const FAST_MOVE = 6;

export const movePlayer = (
  pitch: Pitch,
  player: Player,
  fromZone: PitchZone,
  toZone: PitchZone,
): MoveOutcome => {
  let canMoveNumberOfZones = FREE_MOVE;
  const paceRoll = performCheck(player.Pace);
  if (paceRoll >= 0) {
    console.log("fast-move");
    canMoveNumberOfZones = FAST_MOVE;
  }

  let newPitch = [...pitch];

  const startedAt = { ...fromZone.coordinates };
  const destination = { ...toZone.coordinates };

  // figure out which zone can get to with canMoveNumberOfZones as distance can move
  const reachableEmptyZones = pitch
    .flat()
    .filter(
      (zone) =>
        !zone.playerId &&
        getDistanceInSquares(startedAt, zone.coordinates) <=
          canMoveNumberOfZones,
    );

  //get closest empty zone to destination
  reachableEmptyZones.sort(
    (first, second) =>
      getDistanceInSquares(first.coordinates, destination) -
      getDistanceInSquares(second.coordinates, destination),
  );
  const movedTo = reachableEmptyZones[0]?.coordinates ?? { ...startedAt };

  //place player
  newPitch = newPitch.map((row) =>
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
            ? player.id
            : zone.playerId,
      };
    }),
  );

  //dribbling logic
  if (fromZone.containsBall) {
    const dribbleRoll = performCheck(player.Dribbling);
    const dribbleSuccess = dribbleRoll >= 0;
    if (dribbleSuccess) {
      newPitch = newPitch.map((row) =>
        row.map((zone) => ({
          ...zone,
          containsBall:
            zone.coordinates.x === movedTo.x &&
            zone.coordinates.y === movedTo.y,
        })),
      );
    } else {
      const ballEndsUpZone = getRandomOffset(movedTo, 1, newPitch);
      newPitch = newPitch.map((row) =>
        row.map((zone) => ({
          ...zone,
          containsBall:
            zone.coordinates.x === ballEndsUpZone.x &&
            zone.coordinates.y === movedTo.y,
        })),
      );
    }
  }
  return {
    newPitch,
    pitch,
  };
};

export default movePlayer;
