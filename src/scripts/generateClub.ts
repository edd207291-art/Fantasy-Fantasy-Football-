import {
  STARTING_CLUB_DEFENDERS,
  STARTING_CLUB_FORWARDS,
  STARTING_CLUB_GOALKEEPERS,
  STARTING_CLUB_MIDFIELDERS,
} from "@/static/GlobalVars";
import { Club } from "@/types/club";
import { Player, Position } from "@/types/player";
import * as Crypto from "expo-crypto";
import { generateClubName } from "./generateClubName";
import { generatePlayer } from "./generatePlayer";

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

  for (let i = 0; i < STARTING_CLUB_GOALKEEPERS; i++) {
    players.push(createPlayer(Position.Goalkeeper));
  }
  for (let i = 0; i < STARTING_CLUB_DEFENDERS; i++) {
    players.push(createPlayer(Position.Defender));
  }
  for (let i = 0; i < STARTING_CLUB_MIDFIELDERS; i++) {
    players.push(createPlayer(Position.Midfielder));
  }
  for (let i = 0; i < STARTING_CLUB_FORWARDS; i++) {
    players.push(createPlayer(Position.Forward));
  }

  const clubName = generateClubName(existingClubNames);

  return {
    id: Crypto.randomUUID(),
    name: clubName,
    playerIds: players.map((player) => player.id),
  };
};
