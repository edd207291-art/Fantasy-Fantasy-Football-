import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { versusCheck } from "../../Checks/versusCheck";
import { canTackle } from "./Utils/canTackle";
import { findBallCarrierZone } from "./Utils/findBallCarrierZone";
import { moveTowardCoordinate } from "./Utils/moveTowardCoordinate";

export type TackleOutcome = {
  attacker: Player;
  defender: Player;
  attackerZone: PitchZone;
  ballCarrierZone: PitchZone;
  canMove: boolean;
  moveDistance: number;
  attackerRoll: number;
  defenderRoll: number;
  comparison: number;
  winner: "attacker" | "defender";
  attackerGetsBall: boolean;
  defenderGetsBall: boolean;
  movedTo: PitchCoordinates;
  pitch: Pitch;
  newPitch: Pitch;
};

export const tackle = (
  pitch: Pitch,
  attacker: Player,
  defender: Player,
  attackerZone: PitchZone,
): TackleOutcome => {
  const ballCarrierZone = findBallCarrierZone(pitch);

  if (!ballCarrierZone) {
    throw new Error("No player with the ball found on the pitch.");
  }

  const canMove = canTackle(pitch, attackerZone);

  const moveDistance = canMove ? 3 : 0;
  const movedTo = canMove
    ? moveTowardCoordinate(
        attackerZone.coordinates,
        ballCarrierZone.coordinates,
        moveDistance,
      )
    : { ...attackerZone.coordinates };

  const attackerRoll = attacker.Defending;
  const defenderRoll = defender.Defending;
  const comparison = versusCheck(attackerRoll, defenderRoll);

  const winner = comparison > 0 ? "attacker" : "defender";
  const attackerGetsBall = winner === "attacker";
  const defenderGetsBall = winner === "defender";

  const newPitch = pitch.map((row) =>
    row.map((zone) => ({ ...zone, containsBall: false })),
  );

  let actualMovedTo = { ...movedTo };
  const attackerDestination = newPitch[movedTo.y]?.[movedTo.x];

  if (
    attackerGetsBall &&
    attackerDestination?.playerId &&
    attackerDestination.playerId !== attacker.id
  ) {
    actualMovedTo = { ...attackerZone.coordinates };
  }

  const finalBallZone = attackerGetsBall
    ? newPitch[actualMovedTo.y]?.[actualMovedTo.x]
    : newPitch[ballCarrierZone.coordinates.y]?.[ballCarrierZone.coordinates.x];

  const attackerOriginalZone =
    newPitch[attackerZone.coordinates.y]?.[attackerZone.coordinates.x];

  if (finalBallZone) {
    if (attackerGetsBall) {
      if (attackerOriginalZone && attackerOriginalZone !== finalBallZone) {
        attackerOriginalZone.playerId = undefined;
      }
      finalBallZone.playerId = attacker.id;
    } else {
      finalBallZone.playerId = defender.id;
    }
    finalBallZone.containsBall = true;
  }

  return {
    attacker,
    defender,
    attackerZone,
    ballCarrierZone,
    canMove,
    moveDistance,
    attackerRoll,
    defenderRoll,
    comparison,
    winner,
    attackerGetsBall,
    defenderGetsBall,
    movedTo: actualMovedTo,
    pitch,
    newPitch,
  };
};
