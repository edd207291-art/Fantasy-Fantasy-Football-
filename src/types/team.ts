import type { LineupFormation } from "./lineup";
import { Player } from "./player";

type TeamPositions = {
  Goalkeeper: Player;
  Defenders: Player[];
  Midfielders: Player[];
  Forwards: Player[];
};

export interface ITeam {
  formation: LineupFormation;
  teamPlayers: TeamPositions;
}
