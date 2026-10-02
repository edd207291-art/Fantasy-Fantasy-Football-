import { Player } from "@/types/player";

export const getPlayerRating = (player: Player): number => {
  return (
    player.Defending +
    player.Dribbling +
    player.Pace +
    player.Pace +
    player.Passing +
    player.Physical +
    player.Shooting
  );
};
