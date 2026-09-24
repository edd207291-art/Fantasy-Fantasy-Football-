import { Club } from "@/types/club";
import { Player, Position } from "@/types/player";
import { v4 as uuidv4 } from "uuid";
import { generateClubName } from "./generateClubName";
import { generatePlayer } from "./generatePlayer";

const GOALKEEPERS = 3;
const DEFENDERS = 5;
const MIDFIELDERS = 5;
const FORWARDS = 5;

export const generateClubWithPlayers = (
  onPlayerGenerated?: (player: Player) => void,
  existingClubNames: ReadonlySet<string> = new Set(),
): Club => {
  const createPlayer = (position: Position) => {
    const player = generatePlayer(position);
    onPlayerGenerated?.(player);
    return player;
  };

  const players = [];

  for (let i = 0; i < GOALKEEPERS; i++) {
    players.push(createPlayer(Position.Goalkeeper));
  }
  for (let i = 0; i < DEFENDERS; i++) {
    players.push(createPlayer(Position.Defender));
  }
  for (let i = 0; i < MIDFIELDERS; i++) {
    players.push(createPlayer(Position.Midfielder));
  }
  for (let i = 0; i < FORWARDS; i++) {
    players.push(createPlayer(Position.Forward));
  }

  const clubName = generateClubName(existingClubNames);

  return {
    id: uuidv4(),
    name: clubName,
    playerIds: players.map((player) => player.id),
  };
};
