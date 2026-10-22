import { Player } from "@/types/player";

export const getPlayerRating = (player: Player): number => {
  return (
    player.attributes.Defending +
    player.attributes.Dribbling +
    player.attributes.Pace +
    player.attributes.Pace +
    player.attributes.Passing +
    player.attributes.Physical +
    player.attributes.Shooting
  );
};
