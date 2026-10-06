import { Club } from "@/types/club";
import { Match } from "@/types/match";
import { v4 as uuidv4 } from "uuid";

export const generateLeagueMatches = (
  clubsInLeague: Club[],
  season = 1,
): Match[] => {
  const matches: Match[] = [];
  const clubs: (Club | null)[] = [...clubsInLeague];

  if (clubs.length < 2) {
    return matches;
  }

  if (clubs.length % 2 !== 0) {
    clubs.push(null);
  }

  const matchesPerWeek = clubs.length / 2;
  const weeksPerLeg = clubs.length - 1;

  for (let week = 0; week < weeksPerLeg; week += 1) {
    for (let matchIndex = 0; matchIndex < matchesPerWeek; matchIndex += 1) {
      const homeClub = clubs[matchIndex];
      const awayClub = clubs[clubs.length - 1 - matchIndex];

      if (homeClub && awayClub) {
        matches.push({
          id: uuidv4(),
          homeClubId: homeClub.id,
          awayClubId: awayClub.id,
          season,
          week: week + 1,
        });
      }
    }

    const fixedClub = clubs[0];
    const rotatingClubs = clubs.slice(1);
    rotatingClubs.unshift(rotatingClubs.pop() as Club | null);
    clubs.splice(0, clubs.length, fixedClub, ...rotatingClubs);
  }

  const firstLegMatches = [...matches];

  firstLegMatches.forEach((match) => {
    matches.push({
      id: uuidv4(),
      homeClubId: match.awayClubId,
      awayClubId: match.homeClubId,
      season,
      week: match.week + weeksPerLeg,
    });
  });

  return matches;
};
