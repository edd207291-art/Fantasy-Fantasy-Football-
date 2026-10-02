import { Pitch } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { movePlayer } from "./Actions/moving";
import { tackle } from "./Actions/tackle";
import { ballCarrierPlayer, TeamSide } from "./Ballcarrier/ballcarrier";
import { goalkeeperAction } from "./goalkeeperAction";
import { canTackle } from "./Utils/canTackle";
import { findBallZone } from "./Utils/findBallZone";
import { getPlayerZone } from "./Utils/getPlayerZone";

export type ActivationResult = {
  pitch: Pitch;
  scored: boolean;
};

export const activatePlayer = (
  pitch: Pitch,
  playerBeingActivated: Player,
  teamSide: TeamSide,
  homeClubPlayers: Player[],
  awayClubPlayers: Player[],
): ActivationResult => {
  const activePlayerZone = getPlayerZone(pitch, playerBeingActivated.id);

  if (!activePlayerZone) {
    return { pitch, scored: false };
  }
  //if goalkeeper go to and stay in own goal area

  //activate ball carrier
  if (activePlayerZone.containsBall) {
    return ballCarrierPlayer({
      pitch,
      playerBeingActivated,
      activePlayerZone,
      teamSide,
      homeClubPlayers,
      awayClubPlayers,
    });
  }
  //if player is goalkeeper
  if (playerBeingActivated.positionPreference === Position.Goalkeeper) {
    return goalkeeperAction({
      pitch,
      playerBeingActivated,
      teamSide,
      activePlayerZone,
    });
  }

  const ballZone = findBallZone(pitch);

  if (!ballZone) {
    return { pitch, scored: false };
  }

  const tackleTarget = canTackle({
    pitch,
    activePlayerZone,
    ballZone,
    playerBeingActivated,
    teamSide,
    homeClubPlayers,
    awayClubPlayers,
  });

  //if player can tackle
  if (tackleTarget) {
    const tackleResult = tackle(
      pitch,
      playerBeingActivated,
      tackleTarget.ballCarrier,
      activePlayerZone,
      tackleTarget.emptyTackleSpace,
    );

    return { pitch: tackleResult.newPitch, scored: false };
  }

  //else move player towards ball
  return {
    pitch: movePlayer(pitch, playerBeingActivated, activePlayerZone, ballZone)
      .newPitch,
    scored: false,
  };
};
