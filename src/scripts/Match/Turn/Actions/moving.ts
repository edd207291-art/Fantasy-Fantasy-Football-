import { performCheck } from "@/scripts/Match/Checks/performCheck";
import { ftToZones } from "@/scripts/Utils/ftToZones";
import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { getDistanceInZones } from "../Utils/getDistanceInZones";
import { findMarkingZone, findUnMarkedZone } from "./Moving/findUnmarkedZone";
import { MoveOutcome, movePlayer } from "./Moving/movePlayer";

const DISTRACTION_RANGE = ftToZones(50);
const MAX_BALL_DISTANCE = ftToZones(150);

const getWhichZoneToMoveTo = (
  pitch: Pitch,
  player: Player,
  ballZone: PitchZone,
  restingZone: PitchZone,
  activePlayerZone: PitchZone,
  isClosestToBall: boolean,
  teamPlayers: Player[],
): PitchZone => {
  const distanceFromBall = getDistanceInZones(
    activePlayerZone.coordinates,
    ballZone.coordinates,
  );

  if (distanceFromBall > MAX_BALL_DISTANCE) {
    return restingZone;
  }

  const ballCarrierId = ballZone.playerId;
  const teamHasBall =
    ballCarrierId !== undefined &&
    teamPlayers.some((teamPlayer) => teamPlayer.id === ballCarrierId);

  if (isClosestToBall && !teamHasBall) {
    return ballZone;
  }

  if (teamHasBall) {
    return findUnMarkedZone(pitch, player, ballZone, restingZone, teamPlayers);
  }

  if (
    distanceFromBall <= DISTRACTION_RANGE &&
    performCheck(player.attributes.Discipline) < 0
  ) {
    return ballZone;
  }

  if (ballCarrierId && !teamHasBall) {
    return (
      findMarkingZone(pitch, player, activePlayerZone, ballZone, teamPlayers) ??
      restingZone
    );
  }

  return restingZone;
};

export const moving = (
  pitch: Pitch,
  player: Player,
  activePlayerZone: PitchZone,
  ballZone: PitchZone,
  restingCoordinates: PitchCoordinates,
  isClosestToBall: boolean,
  teamPlayers: Player[],
): MoveOutcome => {
  const restingZone = pitch[restingCoordinates.y]?.[restingCoordinates.x];

  const destination = getWhichZoneToMoveTo(
    pitch,
    player,
    ballZone,
    restingZone,
    activePlayerZone,
    isClosestToBall,
    teamPlayers,
  );

  if (!destination) {
    return { pitch, newPitch: pitch };
  }

  const isAlreadyAtDestination =
    activePlayerZone.coordinates.x === destination.coordinates.x &&
    activePlayerZone.coordinates.y === destination.coordinates.y;

  if (isAlreadyAtDestination) {
    return { pitch, newPitch: pitch };
  }

  return movePlayer(pitch, player, activePlayerZone, destination);
};
