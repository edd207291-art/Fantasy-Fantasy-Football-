import { Club } from "@/types/club";
import { Player, Position } from "@/types/player";
import { v4 as uuidv4 } from "uuid";
import { generateClubName } from "./generateClubName";
import { generatePlayer } from "./generatePlayer";

const NUMBER_OF_GOALKEEPERS = 2;
const NUMBER_OF_DEFENDERS = 6;
const NUMBER_OF_MIDFIELDERS = 6;
const NUMBER_OF_FORWARDS = 4;

export const generateClubWithPlayers = (
  onPlayerGenerated?: (player: Player) => void,
  existingClubNames: ReadonlySet<string> = new Set(),
): Club => {
  //club initial players
  const players = [];
  const createPlayer = (options: Partial<Player>) => {
    const player = generatePlayer(options);
    onPlayerGenerated?.(player);
    return player;
  };

  for (let i = 0; i < NUMBER_OF_GOALKEEPERS; i++) {
    players.push(
      createPlayer({
        name: `Goalkeeper ${i + 1}`,
        position: Position.Goalkeeper,
      }),
    );
  }
  for (let i = 0; i < NUMBER_OF_DEFENDERS; i++) {
    players.push(
      createPlayer({
        name: `Defender ${i + 1}`,
        position: Position.Defender,
      }),
    );
  }
  for (let i = 0; i < NUMBER_OF_MIDFIELDERS; i++) {
    players.push(
      createPlayer({
        name: `Midfielder ${i + 1}`,
        position: Position.Midfielder,
      }),
    );
  }
  for (let i = 0; i < NUMBER_OF_FORWARDS; i++) {
    players.push(
      createPlayer({
        name: `Forward ${i + 1}`,
        position: Position.Forward,
      }),
    );
  }

  const clubName = generateClubName(existingClubNames);

  return {
    id: uuidv4(),

    name: clubName,
    playerIds: players.map((player) => player.id),
  };
};
