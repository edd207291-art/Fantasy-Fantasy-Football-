import { getBestPosition } from "@/scripts/Player/getBestPosition";
import { Pitch, PitchZone } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { movePlayer } from "./Actions/moving";
import { shootBall } from "./Actions/shooting";
import { tackle } from "./Actions/tackle";
import { findBallCarrierZone } from "./Actions/Utils/findBallCarrierZone";
import { getDistanceInSquares } from "./Actions/Utils/getDistanceInSquares";
import { moveTowardCoordinate } from "./Actions/Utils/moveTowardCoordinate";
import { goalkeeperAction } from "./goalkeeperAction";

type TeamSide = "home" | "away";

export type ActivationResult = {
  pitch: Pitch;
  scored: boolean;
};

const getPlayerZone = (pitch: Pitch, playerId: string): PitchZone | null =>
  pitch.flat().find((zone) => zone.playerId === playerId) ?? null;

const isInOpponentGoalArea = (zone: PitchZone, teamSide: TeamSide): boolean =>
  teamSide === "home" ? zone.inAwayGoalArea : zone.inHomeGoalArea;

const hasTackleSpace = (
  pitch: Pitch,
  attackerZone: PitchZone,
  ballCarrierZone: PitchZone,
  attackerId: string,
): boolean => {
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      const adjacentZone =
        pitch[ballCarrierZone.coordinates.y + offsetY]?.[
          ballCarrierZone.coordinates.x + offsetX
        ];

      if (
        adjacentZone &&
        (adjacentZone.playerId === undefined ||
          adjacentZone.playerId === attackerId) &&
        getDistanceInSquares(
          attackerZone.coordinates,
          adjacentZone.coordinates,
        ) <= 3
      ) {
        return true;
      }
    }
  }

  return false;
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
  if (getBestPosition(playerBeingActivated).position === Position.Goalkeeper) {
    return goalkeeperAction({
      pitch,
      playerBeingActivated,
      teamSide,
      activePlayerZone,
    });
  }

  // GOT HERE

  if (activePlayerZone.containsBall) {
    const opponentPlayers =
      teamSide === "home" ? awayClubPlayers : homeClubPlayers;
    const opponentGoalkeeper = opponentPlayers.find(
      (player) => getBestPosition(player).position === Position.Goalkeeper,
    );
    const goalkeeperZone = opponentGoalkeeper
      ? getPlayerZone(pitch, opponentGoalkeeper.id)
      : null;
    const isInOpposingGoalArea = isInOpponentGoalArea(
      activePlayerZone,
      teamSide,
    );

    if (isInOpposingGoalArea && opponentGoalkeeper && goalkeeperZone) {
      console.log(
        `Player ${playerBeingActivated.name} is attempting to shoot at the goal.`,
      );
      const shot = shootBall(
        pitch,
        playerBeingActivated,
        opponentGoalkeeper,
        activePlayerZone,
        goalkeeperZone,
      );
      console.log(`Shot result: ${shot.scored ? "Goal!" : "Missed!"}`);
      return { pitch: shot.newPitch, scored: shot.scored };
    }

    const goalZone = pitch
      .flat()
      .find((zone) =>
        teamSide === "home" ? zone.awayGoalMouth : zone.homeGoalMouth,
      );

    if (!goalZone) {
      return { pitch, scored: false };
    }

    const destination = moveTowardCoordinate(
      activePlayerZone.coordinates,
      goalZone.coordinates,
      2,
    );
    const destinationZone = pitch[destination.y]?.[destination.x];

    if (
      !destinationZone ||
      (destination.x === activePlayerZone.coordinates.x &&
        destination.y === activePlayerZone.coordinates.y)
    ) {
      return { pitch, scored: false };
    }

    return {
      pitch: movePlayer(
        pitch,
        playerBeingActivated,
        activePlayerZone,
        destinationZone,
        true,
      ).newPitch,
      scored: false,
    };
  }

  const ballZone = findBallCarrierZone(pitch);

  if (!ballZone) {
    return { pitch, scored: false };
  }

  const opponentPlayers =
    teamSide === "home" ? awayClubPlayers : homeClubPlayers;
  const ballCarrier = ballZone.playerId
    ? opponentPlayers.find((player) => player.id === ballZone.playerId)
    : undefined;
  const distanceToBall = ballCarrier
    ? getDistanceInSquares(activePlayerZone.coordinates, ballZone.coordinates)
    : Number.POSITIVE_INFINITY;

  if (
    ballCarrier &&
    distanceToBall <= 3 &&
    hasTackleSpace(pitch, activePlayerZone, ballZone, playerBeingActivated.id)
  ) {
    const tackleResult = tackle(
      pitch,
      playerBeingActivated,
      ballCarrier,
      activePlayerZone,
    );

    return { pitch: tackleResult.newPitch, scored: false };
  }

  const destination = moveTowardCoordinate(
    activePlayerZone.coordinates,
    ballZone.coordinates,
    2,
  );
  const destinationZone = pitch[destination.y]?.[destination.x];

  if (
    !destinationZone ||
    (destination.x === activePlayerZone.coordinates.x &&
      destination.y === activePlayerZone.coordinates.y)
  ) {
    return { pitch, scored: false };
  }

  return {
    pitch: movePlayer(
      pitch,
      playerBeingActivated,
      activePlayerZone,
      destinationZone,
      false,
    ).newPitch,
    scored: false,
  };
};
