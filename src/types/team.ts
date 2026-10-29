import type { LineupFormation } from "./lineup";
import { PitchCoordinates } from "./pitch";
import { Player } from "./player";

export type PlayerPosition = {
  player: Player;
  initialCoordinates: PitchCoordinates;
  restingCoordinates: PitchCoordinates;
};

export type TeamPositions = {
  Goalkeeper: PlayerPosition;
  Defenders: PlayerPosition[];
  Midfielders: PlayerPosition[];
  Forwards: PlayerPosition[];
};

export interface ITeam {
  formation: LineupFormation;
  teamPlayers: TeamPositions;
}
