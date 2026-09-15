import { Player, Position } from "@/types/player";

export const generateTeam = (clubPlayers: Player[]): Player[] => {
  const goalkeepers = clubPlayers.filter(
    (player) => player.position === Position.Goalkeeper,
  );
  const defenders = clubPlayers.filter(
    (player) => player.position === Position.Defender,
  );
  const midfielders = clubPlayers.filter(
    (player) => player.position === Position.Midfielder,
  );
  const forwards = clubPlayers.filter(
    (player) => player.position === Position.Forward,
  );

  const bestGoalkeeper = goalkeepers.sort((a, b) => b.rating - a.rating)[0];
  const bestDefenders = defenders
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const bestMidfielders = midfielders
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const bestForwards = forwards.sort((a, b) => b.rating - a.rating).slice(0, 2);

  return [
    bestGoalkeeper,
    ...bestDefenders,
    ...bestMidfielders,
    ...bestForwards,
  ];
};
