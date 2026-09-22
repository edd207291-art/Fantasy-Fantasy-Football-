import { Match } from "@/types/match";
import { playMatch } from "./playMatch";

export const playWeeksMatchs = (
  matches: Match[],
  currentWeek: number,
): Match[] => {
  return matches.map((match) =>
    match.week === currentWeek ? playMatch(match) : match,
  );
};
