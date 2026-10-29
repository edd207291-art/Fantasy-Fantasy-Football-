import type { PitchCoordinates } from "./pitch";

export type MatchPitchState = {
  players: { playerId: string; location: PitchCoordinates }[];
  ballLocation: PitchCoordinates | null;
};

export type MatchScore = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  homeClubId: string;
  awayClubId: string;
  season: number;
  week: number;
  score?: MatchScore;
  pitchHistory?: MatchPitchState[];
  result?: {
    winnerClubId: string | null;
    score: MatchScore;
    pitchStates?: MatchPitchState[];
  };
};
