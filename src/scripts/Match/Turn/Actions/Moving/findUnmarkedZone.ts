import { ftToZones } from "@/scripts/Utils/ftToZones";
import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { clearLineBetweenPoints } from "../../Utils/clearLineBetweenPoints";
import { getDistanceInZones } from "../../Utils/getDistanceInZones";

const getLineZones = (
  pitch: Pitch,
  from: PitchCoordinates,
  to: PitchCoordinates,
): PitchZone[] => {
  let x = from.x;
  let y = from.y;
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);
  const stepX = from.x < to.x ? 1 : -1;
  const stepY = from.y < to.y ? 1 : -1;
  let error = deltaX - deltaY;
  const lineZones: PitchZone[] = [];

  while (x !== to.x || y !== to.y) {
    const doubledError = error * 2;
    if (doubledError > -deltaY) {
      error -= deltaY;
      x += stepX;
    }
    if (doubledError < deltaX) {
      error += deltaX;
      y += stepY;
    }

    if (x === to.x && y === to.y) {
      break;
    }

    const zone = pitch[y]?.[x];
    if (zone) {
      lineZones.push(zone);
    }
  }

  return lineZones;
};

const findNearestOpenZone = (
  zones: PitchZone[],
  target: PitchCoordinates,
  activePlayerZone: PitchZone,
  playerId: string,
): PitchZone | undefined => {
  let nearestZone: PitchZone | undefined;
  let nearestTargetDistance = Infinity;
  let nearestActiveDistance = Infinity;

  for (const zone of zones) {
    if (zone.playerId && zone.playerId !== playerId) {
      continue;
    }

    const targetDistance = getDistanceInZones(zone.coordinates, target);
    const activeDistance = getDistanceInZones(
      zone.coordinates,
      activePlayerZone.coordinates,
    );
    if (
      targetDistance < nearestTargetDistance ||
      (targetDistance === nearestTargetDistance &&
        activeDistance < nearestActiveDistance)
    ) {
      nearestZone = zone;
      nearestTargetDistance = targetDistance;
      nearestActiveDistance = activeDistance;
    }
  }

  return nearestZone;
};

export const findUnMarkedZone = (
  pitch: Pitch,
  player: Player,
  ballZone: PitchZone,
  restingZone: PitchZone,
  teamPlayers: Player[],
): PitchZone => {
  const minimumOpponentDistance = ftToZones(15);
  const minimumTeammateDistance = ftToZones(20);
  const teamPlayerIds = new Set(teamPlayers.map((teamPlayer) => teamPlayer.id));
  const teammateZones: PitchZone[] = [];
  const opponentZones: PitchZone[] = [];
  const candidateZones: PitchZone[] = [];

  for (const zone of pitch.flat()) {
    if (zone.playerId) {
      if (teamPlayerIds.has(zone.playerId)) {
        if (zone.playerId !== player.id) {
          teammateZones.push(zone);
        }
      } else {
        opponentZones.push(zone);
      }

      if (zone.playerId !== player.id) {
        continue;
      }
    }

    candidateZones.push(zone);
  }

  const eligibleZones = candidateZones.filter((zone) => {
    const nearestOpponentDistance = opponentZones.reduce(
      (nearestDistance, opponentZone) =>
        Math.min(
          nearestDistance,
          getDistanceInZones(zone.coordinates, opponentZone.coordinates),
        ),
      Infinity,
    );

    return (
      nearestOpponentDistance >= minimumOpponentDistance &&
      clearLineBetweenPoints(pitch, zone.coordinates, ballZone.coordinates)
    );
  });
  const spacedZones = eligibleZones.filter(
    (zone) =>
      getDistanceInZones(zone.coordinates, ballZone.coordinates) >=
        minimumTeammateDistance &&
      teammateZones.every(
        (teammateZone) =>
          getDistanceInZones(zone.coordinates, teammateZone.coordinates) >=
          minimumTeammateDistance,
      ),
  );

  return (spacedZones.length > 0 ? spacedZones : eligibleZones).sort(
    (first, second) => {
      const restingDistanceDifference =
        getDistanceInZones(first.coordinates, restingZone.coordinates) -
        getDistanceInZones(second.coordinates, restingZone.coordinates);
      if (restingDistanceDifference !== 0) {
        return restingDistanceDifference;
      }

      const firstOpponentDistance = opponentZones.reduce(
        (nearestDistance, opponentZone) =>
          Math.min(
            nearestDistance,
            getDistanceInZones(first.coordinates, opponentZone.coordinates),
          ),
        Infinity,
      );
      const secondOpponentDistance = opponentZones.reduce(
        (nearestDistance, opponentZone) =>
          Math.min(
            nearestDistance,
            getDistanceInZones(second.coordinates, opponentZone.coordinates),
          ),
        Infinity,
      );
      return secondOpponentDistance - firstOpponentDistance;
    },
  )[0];
};

export const findMarkingZone = (
  pitch: Pitch,
  player: Player,
  activePlayerZone: PitchZone,
  ballZone: PitchZone,
  teamPlayers: Player[],
): PitchZone | undefined => {
  const teamPlayerIds = new Set(teamPlayers.map((teamPlayer) => teamPlayer.id));
  const zones = pitch.flat();
  const teammateZones: PitchZone[] = [];
  const opponentZones: PitchZone[] = [];

  for (const zone of zones) {
    if (!zone.playerId) {
      continue;
    }

    if (teamPlayerIds.has(zone.playerId)) {
      if (zone.playerId !== player.id) {
        teammateZones.push(zone);
      }
    } else {
      opponentZones.push(zone);
    }
  }

  let targetOpponent: PitchZone | undefined;
  let nearestOpponentDistance = Infinity;
  for (const opponentZone of opponentZones) {
    const isNearestToPlayer = teammateZones.every(
      (teammateZone) =>
        getDistanceInZones(
          activePlayerZone.coordinates,
          opponentZone.coordinates,
        ) <=
        getDistanceInZones(
          teammateZone.coordinates,
          opponentZone.coordinates,
        ),
    );
    if (!isNearestToPlayer) {
      continue;
    }

    const distance = getDistanceInZones(
      opponentZone.coordinates,
      activePlayerZone.coordinates,
    );
    if (distance < nearestOpponentDistance) {
      targetOpponent = opponentZone;
      nearestOpponentDistance = distance;
    }
  }

  if (!targetOpponent) {
    return undefined;
  }

  const blockingZone = getLineZones(
    pitch,
    targetOpponent.coordinates,
    ballZone.coordinates,
  )
    .filter((zone) => !zone.playerId || zone.playerId === player.id)
    .sort(
      (first, second) =>
        getDistanceInZones(first.coordinates, activePlayerZone.coordinates) -
        getDistanceInZones(second.coordinates, activePlayerZone.coordinates),
    )[0];

  return (
    blockingZone ??
    findNearestOpenZone(
      zones,
      targetOpponent.coordinates,
      activePlayerZone,
      player.id,
    )
  );
};
