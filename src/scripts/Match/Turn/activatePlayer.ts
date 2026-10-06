import { Pitch, PitchZone } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { movePlayer } from "./Actions/moving";
import { tackle } from "./Actions/tackle";
import { ballCarrierPlayer, TeamSide } from "./Ballcarrier/ballcarrier";
import { goalkeeperAction } from "./goalkeeperAction";
import { canTackle } from "./Utils/canTackle";

export type ActivationResult = {
  pitch: Pitch;
  scored: boolean;
};

const findActivationZones = (
  pitch: Pitch,
  playerId: string,
  needsBallZone: boolean,
): { activePlayerZone: PitchZone | null; ballZone: PitchZone | null } => {
  let activePlayerZone: PitchZone | null = null;
  let ballZone: PitchZone | null = null;

  for (const row of pitch) {
    for (const zone of row) {
      if (!activePlayerZone && zone.playerId === playerId) {
        activePlayerZone = zone;
      }
      if (needsBallZone && !ballZone && zone.containsBall) {
        ballZone = zone;
      }

      if (
        activePlayerZone &&
        (activePlayerZone.containsBall || !needsBallZone || ballZone)
      ) {
        return { activePlayerZone, ballZone };
      }
    }
  }

  return { activePlayerZone, ballZone };
};

export const activatePlayer = (
  pitch: Pitch,
  playerBeingActivated: Player,
  teamSide: TeamSide,
  homeClubPlayers: Player[],
  awayClubPlayers: Player[],
  playerPositionInTeam: Position,
): ActivationResult => {
  const needsBallZone = playerPositionInTeam !== Position.Goalkeeper;
  const { activePlayerZone, ballZone } = findActivationZones(
    pitch,
    playerBeingActivated.id,
    needsBallZone,
  );

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
  if (playerPositionInTeam === Position.Goalkeeper) {
    return goalkeeperAction({
      pitch,
      playerBeingActivated,
      teamSide,
      activePlayerZone,
    });
  }

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
