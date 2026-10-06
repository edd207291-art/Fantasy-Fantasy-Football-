import { Match } from "@/types/match";
import { playMatch } from "./Match/playMatch";

export const playWeeksMatchs = (
  matches: Match[],
  currentSeason: number,
  currentWeek: number,
  onMatchStarting: (match: Match, index: number, total: number) => void,
  onMatchPlayed: (matches: Match[]) => void,
): Promise<Match[]> => {
  const matchesToPlay = matches
    .map((match, index) => ({ match, index }))
    .filter(
      ({ match }) =>
        match.season === currentSeason && match.week === currentWeek,
    );
  const updatedMatches = [...matches];

  return (async () => {
    for (const [matchNumber, { match, index }] of matchesToPlay.entries()) {
      onMatchStarting(match, matchNumber + 1, matchesToPlay.length);
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      updatedMatches[index] = playMatch(match);
      onMatchPlayed([...updatedMatches]);
    }

    return updatedMatches;
  })();
};
