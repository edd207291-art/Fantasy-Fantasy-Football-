import { getPlayerRating } from "@/scripts/Player/getPlayerRating";
import {
  LINEUP_FORMATIONS,
  type LineupFormation,
  type ManagerLineup,
} from "@/types/lineup";
import { Player, Position } from "@/types/player";
import { ITeam } from "@/types/team";
import { getTeamFromLineup } from "./getTeamFromLineup";

type FormationResult = {
  players: {
    defenders: Player[];
    midfielders: Player[];
    forwards: Player[];
  };
  formationRating: number;
};

const getFormationRating = (
  defenders: PlayerWithRating[],
  midfielders: PlayerWithRating[],
  forwards: PlayerWithRating[],
  numberOfDefenders: number,
  numberOfMidfielders: number,
  numberOfForwards: number,
): FormationResult => {
  const selectedDefenders = defenders.slice(0, numberOfDefenders);
  const selectedMidfielders = midfielders.slice(0, numberOfMidfielders);
  const selectedForwards = forwards.slice(0, numberOfForwards);

  if (
    selectedDefenders.length < numberOfDefenders ||
    selectedMidfielders.length < numberOfMidfielders ||
    selectedForwards.length < numberOfForwards
  ) {
    return {
      players: {
        defenders: [],
        midfielders: [],
        forwards: [],
      },
      formationRating: 0,
    };
  }

  return {
    players: {
      defenders: selectedDefenders.map((player) => player.player),
      midfielders: selectedMidfielders.map((player) => player.player),
      forwards: selectedForwards.map((player) => player.player),
    },
    formationRating: [
      ...selectedDefenders,
      ...selectedMidfielders,
      ...selectedForwards,
    ].reduce((total, playerWithRating) => total + playerWithRating.rating, 0),
  };
};

type PlayerWithRating = { player: Player; rating: number };

export const generateTeam = (
  clubPlayers: Player[],
  lineup?: ManagerLineup,
): ITeam => {
  if (lineup) {
    const selectedTeam = getTeamFromLineup(clubPlayers, lineup);
    if (selectedTeam) return selectedTeam;
  }

  // else just generate best possible team
  const playersByPosition: Record<Position, PlayerWithRating[]> = {
    [Position.Goalkeeper]: [],
    [Position.Defender]: [],
    [Position.Midfielder]: [],
    [Position.Forward]: [],
  };

  clubPlayers.forEach((player) => {
    const rating = getPlayerRating(player);
    playersByPosition[player.positionPreference].push({ player, rating });
  });

  const goalKeepers = playersByPosition[Position.Goalkeeper].sort(
    (first, second) => second.rating - first.rating,
  );
  const bestGoalkeeper = goalKeepers[0].player;

  const defenders = [...playersByPosition[Position.Defender]].sort(
    (first, second) => second.rating - first.rating,
  );

  const midfielders = playersByPosition[Position.Midfielder].sort(
    (first, second) => second.rating - first.rating,
  );
  const forwards = playersByPosition[Position.Forward].sort(
    (first, second) => second.rating - first.rating,
  );

  const formationCandidates = (
    Object.keys(LINEUP_FORMATIONS) as LineupFormation[]
  ).map((name) => {
    const formation = LINEUP_FORMATIONS[name];

    return {
      name,
      result: getFormationRating(
        defenders,
        midfielders,
        forwards,
        formation.defenders,
        formation.midfielders,
        formation.forwards,
      ),
    };
  });

  const bestFormation = formationCandidates.reduce((prev, current) =>
    current.result.formationRating > prev.result.formationRating
      ? current
      : prev,
  );

  return {
    formation: bestFormation.name,
    teamPlayers: {
      Goalkeeper: bestGoalkeeper,
      Defenders: bestFormation.result.players.defenders,
      Midfielders: bestFormation.result.players.midfielders,
      Forwards: bestFormation.result.players.forwards,
    },
  };
};
