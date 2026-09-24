import { Pitch } from "./pitch";

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
  pitchHistory?: Pitch[];
  result?: {
    winnerClubId: string | null;
    score: MatchScore;
    pitchStates?: Pitch[];
  };
};
