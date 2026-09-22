import { firstNames } from "@/static/firstNameList";
import { lastNames } from "@/static/lastNameList";
import { Player, Position } from "@/types/player";
import { v4 as uuidv4 } from "uuid";

export const generatePlayer = ({
  rating,
  position,
}: Partial<Player>): Player => {
  //generate name
  const generatedName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

  return {
    id: uuidv4(),
    name: generatedName,
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
