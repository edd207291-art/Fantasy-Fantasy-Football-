import { Pitch, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { versusCheck } from "../../Checks/versusCheck";
import { movePlayer } from "./moving";

export type TackleOutcome = {
  pitch: Pitch;
  newPitch: Pitch;
};

export const tackle = (
  pitch: Pitch,
  attacker: Player,
  defender: Player,
  attackerZone: PitchZone,
  emptyTackleSpace: PitchZone,
): TackleOutcome => {
  const defenderZone = pitch
    .flat()
    .find((zone) => zone.playerId === defender.id);

  if (!defenderZone) {
    throw new Error("No player with the ball found on the pitch.");
  }
  //move attacker to be next to defender
  let newPitch = movePlayer(
    pitch,
    attacker,
    attackerZone,
    emptyTackleSpace,
  ).newPitch;

  //clear ball off pitch
  newPitch = newPitch.map((row) =>
    row.map((zone) => ({ ...zone, containsBall: false })),
  );

  //do check
  const comparison = versusCheck(
    attacker.attributes.Defending,
    defender.attributes.Defending,
  );

  const winner = comparison > 0 ? "attacker" : "defender";
  const attackerGetsBall = winner === "attacker";

  if (attackerGetsBall) {
    newPitch[emptyTackleSpace.coordinates.y][
      emptyTackleSpace.coordinates.x
    ].containsBall = true;
  } else {
    newPitch[defenderZone.coordinates.y][
      defenderZone.coordinates.x
    ].containsBall = true;
  }

  return {
    pitch,
    newPitch,
  };
};
