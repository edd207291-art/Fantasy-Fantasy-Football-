import { Player, Position } from "@/types/player";

type BestPosition = {
  position: Position;
  rating: number;
};

export const getBestPosition = (player: Player): BestPosition =>
  Object.values(Position).reduce<BestPosition>(
    (bestPosition, position) => {
      const rating = player.positionPreference[position];

      return rating > bestPosition.rating ? { position, rating } : bestPosition;
    },
    {
      position: Position.Goalkeeper,
      rating: player.positionPreference[Position.Goalkeeper],
    },
  );
