import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { versusCheck } from "../../Checks/versusCheck";
import { getDistanceInSquares } from "./Utils/getDistanceInSquares";

export type ShotOutcome = {
  withinRange: boolean;
  distanceToGoal: number;
  shooterRoll: number;
  goalkeeperRoll: number;
  scored: boolean;
  goalkeeperGetsBall: boolean;
  totalRoll: number;
  goalTarget: PitchCoordinates;
  goalkeeperZone?: PitchZone;
  pitch: Pitch;
  newPitch: Pitch;
};

export const shootBall = (
  pitch: Pitch,
  shooter: Player,
  goalkeeper: Player,
  shooterZone: PitchZone,
  goalkeeperZone?: PitchZone,
): ShotOutcome => {
  const goalMouths = pitch
    .flat()
    .filter((zone) => zone.homeGoalMouth || zone.awayGoalMouth)
    .map((zone) => zone.coordinates);

  const goalTarget =
    goalMouths.reduce<PitchCoordinates | null>((closest, coordinate) => {
      if (!closest) {
        return coordinate;
      }

      return getDistanceInSquares(shooterZone.coordinates, coordinate) <
        getDistanceInSquares(shooterZone.coordinates, closest)
        ? coordinate
        : closest;
    }, null) ?? shooterZone.coordinates;

  const distanceToGoal = getDistanceInSquares(
    shooterZone.coordinates,
    goalTarget,
  );
  const withinRange = distanceToGoal <= 10;

  const shooterRoll = shooter.Shooting;
  const goalkeeperRoll = goalkeeper.Defending;
  const totalRoll = versusCheck(shooterRoll, goalkeeperRoll);

  const scored = withinRange && totalRoll > 0;
  const goalkeeperGetsBall = !scored;

  const newPitch = pitch.map((row) =>
    row.map((zone) => ({ ...zone, containsBall: false })),
  );
  const shooterZoneOnPitch =
    newPitch[shooterZone.coordinates.y]?.[shooterZone.coordinates.x];

  if (shooterZoneOnPitch) {
    shooterZoneOnPitch.containsBall = false;
  }

  if (scored) {
    const centerX = Math.floor(pitch[0].length / 2);
    const centerY = Math.floor(pitch.length / 2);
    const centerZone = newPitch[centerY]?.[centerX];

    if (centerZone) {
      centerZone.containsBall = true;
    }
  } else if (goalkeeperZone) {
    const keeperZone =
      newPitch[goalkeeperZone.coordinates.y]?.[goalkeeperZone.coordinates.x];

    if (keeperZone) {
      keeperZone.playerId = goalkeeper.id;
      keeperZone.containsBall = true;
    }
  }

  return {
    withinRange,
    distanceToGoal,
    shooterRoll,
    goalkeeperRoll,
    scored,
    goalkeeperGetsBall,
    totalRoll,
    goalTarget,
    goalkeeperZone,
    pitch,
    newPitch,
  };
};

export default shootBall;
