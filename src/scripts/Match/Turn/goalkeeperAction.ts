import { Pitch, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { movePlayer } from "./Actions/Moving/movePlayer";
import { getDistanceInZones } from "./Utils/getDistanceInZones";
import { ActivationResult } from "./activatePlayer";

//to and stay in own goal area
export const goalkeeperAction = ({
  pitch,
  playerBeingActivated,
  teamSide,
  activePlayerZone,
}: {
  pitch: Pitch;
  playerBeingActivated: Player;
  teamSide: "home" | "away";
  activePlayerZone: PitchZone;
}): ActivationResult => {
  const isInOwnGoalArea =
    teamSide === "home"
      ? activePlayerZone.inHomeGoalArea
      : activePlayerZone.inAwayGoalArea;

  // if in own goal area stay still
  if (isInOwnGoalArea) {
    return { pitch, scored: false };
  }

  const goalAreaTargetZone = pitch
    .flat()
    .filter((zone) =>
      teamSide === "home" ? zone.inHomeGoalArea : zone.inAwayGoalArea,
    )
    .sort(
      (first, second) =>
        getDistanceInZones(activePlayerZone.coordinates, first.coordinates) -
        getDistanceInZones(activePlayerZone.coordinates, second.coordinates),
    )[0];

  if (!goalAreaTargetZone) {
    return { pitch, scored: false };
  }

  return {
    pitch: movePlayer(
      pitch,
      playerBeingActivated,
      activePlayerZone,
      goalAreaTargetZone,
    ).newPitch,
    scored: false,
  };
};
