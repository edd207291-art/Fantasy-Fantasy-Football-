import { LINEUP_FORMATIONS, ManagerLineup } from "@/types/lineup";
import { Player } from "@/types/player";
import { ITeam } from "@/types/team";

export const getTeamFromLineup = (
  clubPlayers: Player[],
  lineup: ManagerLineup,
): ITeam | undefined => {
  const playerById = new Map(clubPlayers.map((player) => [player.id, player]));
  const formationSlots = LINEUP_FORMATIONS[lineup.formation];
  const allPlayerIds = [
    lineup.goalkeeperId,
    ...lineup.defendersIds,
    ...lineup.midfieldersIds,
    ...lineup.forwardsIds,
  ];
  const getSelectedPlayers = (playerIds: string[]) => {
    const selectedPlayers = playerIds
      .map((playerId) => playerById.get(playerId))
      .filter((player): player is Player => player !== undefined);

    if (selectedPlayers.length !== playerIds.length) {
      return undefined;
    }

    return selectedPlayers;
  };
  const goalkeeper = playerById.get(lineup.goalkeeperId);
  const defenders = getSelectedPlayers(lineup.defendersIds);
  const midfielders = getSelectedPlayers(lineup.midfieldersIds);
  const forwards = getSelectedPlayers(lineup.forwardsIds);
  const expectedPlayerCount = Object.values(formationSlots).reduce(
    (total, count) => total + count,
    0,
  );

  if (
    goalkeeper !== undefined &&
    defenders?.length === formationSlots.defenders &&
    midfielders?.length === formationSlots.midfielders &&
    forwards?.length === formationSlots.forwards &&
    allPlayerIds.length === expectedPlayerCount &&
    new Set(allPlayerIds).size === allPlayerIds.length
  ) {
    return {
      formation: lineup.formation,
      teamPlayers: {
        Goalkeeper: goalkeeper,
        Defenders: defenders,
        Midfielders: midfielders,
        Forwards: forwards,
      },
    };
  }

  return undefined;
};
