import { ftToZones } from "@/scripts/Utils/ftToZones";
import { Pitch, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { TeamSide } from "../Ballcarrier/ballcarrier";
import { getDistanceInZones } from "./getDistanceInZones";

const TACKLE_RANGE = ftToZones(15);

const hasTackleSpace = (
  pitch: Pitch,
  attackerZone: PitchZone,
  ballCarrierZone: PitchZone,
  attackerId: string,
): PitchZone | undefined => {
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
        getDistanceInZones(
          attackerZone.coordinates,
          adjacentZone.coordinates,
        ) <= TACKLE_RANGE
      ) {
        return adjacentZone;
      }
    }
  }
};

export const canTackle = ({
  pitch,
  activePlayerZone,
  ballZone,
  playerBeingActivated,
  teamSide,
  homeClubPlayers,
  awayClubPlayers,
}: {
  pitch: Pitch;
  activePlayerZone: PitchZone;
  ballZone: PitchZone;
  playerBeingActivated: Player;
  teamSide: TeamSide;
  homeClubPlayers: Player[];
  awayClubPlayers: Player[];
}): { ballCarrier: Player; emptyTackleSpace: PitchZone } | undefined => {
  const opponentPlayers =
    teamSide === "home" ? awayClubPlayers : homeClubPlayers;
  const ballCarrier = ballZone.playerId
    ? opponentPlayers.find((player) => player.id === ballZone.playerId)
    : undefined;

  const emptyTackleSpace = hasTackleSpace(
    pitch,
    activePlayerZone,
    ballZone,
    playerBeingActivated.id,
  );
  if (
    !ballCarrier ||
    getDistanceInZones(activePlayerZone.coordinates, ballZone.coordinates) >
      TACKLE_RANGE ||
    !emptyTackleSpace
  ) {
    return undefined;
  }

  return { ballCarrier, emptyTackleSpace };
};
