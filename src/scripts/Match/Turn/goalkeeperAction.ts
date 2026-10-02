import { Pitch, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { movePlayer } from "./Actions/moving";
import { getDistanceInSquares } from "./Utils/getDistanceInSquares";
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
        getDistanceInSquares(activePlayerZone.coordinates, first.coordinates) -
        getDistanceInSquares(activePlayerZone.coordinates, second.coordinates),
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
