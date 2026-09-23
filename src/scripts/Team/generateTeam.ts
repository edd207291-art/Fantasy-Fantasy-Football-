import { getBestPosition } from "@/scripts/Player/getBestPosition";
import { Player, Position } from "@/types/player";

type TeamPositions = {
  Goalkeeper: Player;
  Defenders: Player[];
  Midfielders: Player[];
  Forwards: Player[];
};

interface ITeam {
  teamPlayers: TeamPositions;
}

type FormationResult = {
  rating: number;
  players: {
    defenders: Player[];
    midfielders: Player[];
    forwards: Player[];
  };
};

const getFormationRating = (
  defenders: Player[],
  midfielders: Player[],
  forwards: Player[],
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
      rating: 0,
      players: {
        defenders: [],
        midfielders: [],
        forwards: [],
      },
    };
  }

  const defenderRating = selectedDefenders.reduce(
    (sum, player) => sum + player.rating,
    0,
  );
  const midfielderRating = selectedMidfielders.reduce(
    (sum, player) => sum + player.rating,
    0,
  );
  const forwardRating = selectedForwards.reduce(
    (sum, player) => sum + player.rating,
    0,
  );

  return {
    rating: defenderRating + midfielderRating + forwardRating,
    players: {
      defenders: selectedDefenders,
      midfielders: selectedMidfielders,
      forwards: selectedForwards,
    },
  };
};

export const generateTeam = (clubPlayers: Player[]): ITeam => {
  const playersByPosition: Record<Position, Player[]> = {
    [Position.Goalkeeper]: [],
    [Position.Defender]: [],
    [Position.Midfielder]: [],
    [Position.Forward]: [],
  };

  clubPlayers.forEach((player) => {
    const bestPosition = getBestPosition(player).position;
    playersByPosition[bestPosition].push(player);
  });

  Object.values(Position).forEach((position) => {
    playersByPosition[position].sort(
      (a, b) => b.positionPreference[position] - a.positionPreference[position],
    );
  });

  // is a bug if no goalkeepers. In future when gen teams will gen players with a preferance for positions.
  const goalKeepers = playersByPosition[Position.Goalkeeper];
  const bestGoalkeeper = goalKeepers.reduce((prev, current) =>
    prev.rating > current.rating ? prev : current,
  );

  const defenders = playersByPosition[Position.Defender];
  const midfielders = playersByPosition[Position.Midfielder];
  const forwards = playersByPosition[Position.Forward];

  const formation422 = getFormationRating(
    defenders,
    midfielders,
    forwards,
    4,
    2,
    2,
  );
  const formation433 = getFormationRating(
    defenders,
    midfielders,
    forwards,
    4,
    3,
    3,
  );
  const formation343 = getFormationRating(
    defenders,
    midfielders,
    forwards,
    3,
    4,
    3,
  );
  const formation352 = getFormationRating(
    defenders,
    midfielders,
    forwards,
    3,
    5,
    2,
  );

  const bestFormation = [
    formation422,
    formation433,
    formation343,
    formation352,
  ].reduce((prev, current) => (prev.rating > current.rating ? prev : current));

  return {
    teamPlayers: {
      Goalkeeper: bestGoalkeeper,
      Defenders: bestFormation.players.defenders,
      Midfielders: bestFormation.players.midfielders,
      Forwards: bestFormation.players.forwards,
    },
  };
};
