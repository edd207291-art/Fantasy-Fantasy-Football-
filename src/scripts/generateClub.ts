import { Club } from "@/types/club";
import { Player } from "@/types/player";
import { v4 as uuidv4 } from "uuid";
import { generateClubName } from "./generateClubName";
import { generatePlayer } from "./generatePlayer";

const PLAYERS_IN_CLUB = 20;

export const generateClubWithPlayers = (
  onPlayerGenerated?: (player: Player) => void,
  existingClubNames: ReadonlySet<string> = new Set(),
): Club => {
  const createPlayer = () => {
    const player = generatePlayer();
    onPlayerGenerated?.(player);
    return player;
  };

  const players = [];
  for (let i = 0; i < PLAYERS_IN_CLUB; i++) {
    players.push(createPlayer());
  }

  const clubName = generateClubName(existingClubNames);

  return {
    id: uuidv4(),
    name: clubName,
    playerIds: players.map((player) => player.id),
  };
};
