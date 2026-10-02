import { firstNames } from "@/static/firstNameList";
import { lastNames } from "@/static/lastNameList";
import { Player, Position } from "@/types/player";
import { v4 as uuidv4 } from "uuid";

export const generatePlayer = (position: Position): Player => {
  //generate name
  const generatedName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

  return {
    id: uuidv4(),
    name: generatedName,
    positionPreference: position,
    Pace: Math.floor(Math.random() * 101),
    Shooting: Math.floor(Math.random() * 101),
    Passing: Math.floor(Math.random() * 101),
    Dribbling: Math.floor(Math.random() * 101),
    Defending: Math.floor(Math.random() * 101),
    Physical: Math.floor(Math.random() * 101),
  };
};
