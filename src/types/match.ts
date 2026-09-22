export type Match = {
  id: string;
  homeClubId: string;
  awayClubId: string;
  season: number;
  week: number;
  result?: {
    winnerClubId: string | null;
  };
};
