import { firstNames } from "@/static/firstNameList";
import { lastNames } from "@/static/lastNameList";
import { Player, Position, PositionRating } from "@/types/player";
import { v4 as uuidv4 } from "uuid";

const generatePositionPreferences = (position: Position): PositionRating => {
  const preferences = {} as PositionRating;
  const highestPreference = Math.floor(Math.random() * 100) + 1;

  Object.values(Position).forEach((currentPosition) => {
    preferences[currentPosition] =
      currentPosition === position
        ? highestPreference
        : Math.floor(Math.random() * highestPreference);
  });

  return preferences;
};

export const generatePlayer = (position: Position): Player => {
  //generate name
  const generatedName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

  return {
    id: uuidv4(),
    name: generatedName,
    positionPreference: generatePositionPreferences(position),
    Pace: Math.floor(Math.random() * 101),
    Shooting: Math.floor(Math.random() * 101),
    Passing: Math.floor(Math.random() * 101),
    Dribbling: Math.floor(Math.random() * 101),
    Defending: Math.floor(Math.random() * 101),
    Physical: Math.floor(Math.random() * 101),
  };
};
