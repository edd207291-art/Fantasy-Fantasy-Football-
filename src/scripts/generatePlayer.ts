import { Player, Position } from "@/types/player";
import { v4 as uuidv4 } from "uuid";

export const generatePlayer = ({
  name,
  rating,
  position,
}: Partial<Player>): Player => {
  return {
    id: uuidv4(),
    name: name || "Player " + Math.floor(Math.random() * 1000),
    rating: rating !== undefined ? rating : Math.floor(Math.random() * 101),
    position:
      position ||
      ([
        Position.Goalkeeper,
        Position.Defender,
        Position.Midfielder,
        Position.Forward,
      ][Math.floor(Math.random() * 4)] as Player["position"]),
  };
};
