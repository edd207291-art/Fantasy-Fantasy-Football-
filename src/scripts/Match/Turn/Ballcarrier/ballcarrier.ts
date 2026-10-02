import { Pitch, PitchZone } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { movePlayer } from "../Actions/moving";
import { shootBall } from "../Actions/shooting";
import { getPlayerZone } from "../Utils/getPlayerZone";

export type TeamSide = "home" | "away";

type BallCarrierActivation = {
  pitch: Pitch;
  playerBeingActivated: Player;
  activePlayerZone: PitchZone;
  teamSide: TeamSide;
  homeClubPlayers: Player[];
  awayClubPlayers: Player[];
};

export const ballCarrierPlayer = ({
  pitch,
  playerBeingActivated,
  activePlayerZone,
  teamSide,
  homeClubPlayers,
  awayClubPlayers,
}: BallCarrierActivation): { pitch: Pitch; scored: boolean } => {
  const isInOpposingGoalArea =
    teamSide === "home"
      ? activePlayerZone.inAwayGoalArea
      : activePlayerZone.inHomeGoalArea;

  if (isInOpposingGoalArea) {
    const opponentPlayers =
      teamSide === "home" ? awayClubPlayers : homeClubPlayers;
    const opponentGoalkeeper = opponentPlayers.find(
      (player) =>
        player.positionPreference === Position.Goalkeeper &&
        getPlayerZone(pitch, player.id) !== null,
    );

    console.log(
      `Player ${playerBeingActivated.name} is attempting to shoot at the goal.`,
    );

    if (!opponentGoalkeeper) {
      return { pitch, scored: false };
    }

    const shot = shootBall(pitch, playerBeingActivated, opponentGoalkeeper);
    console.log(`Shot result: ${shot.scored ? "Goal!" : "Missed!"}`);
    return { pitch: shot.newPitch, scored: shot.scored };
  }

  //TODO have better understanding of where they need to go - currently
  const targetOfMovement = pitch
    .flat()
    .find((zone) =>
      teamSide === "home" ? zone.awayGoalMouth : zone.homeGoalMouth,
    );

  if (!targetOfMovement) {
    return { pitch, scored: false };
  }

  const newPitch = movePlayer(
    pitch,
    playerBeingActivated,
    activePlayerZone,
    targetOfMovement,
  ).newPitch;
  return {
    pitch: newPitch,
    scored: false,
  };
};
