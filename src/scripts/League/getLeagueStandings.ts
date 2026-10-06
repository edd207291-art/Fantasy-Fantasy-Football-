import type { Club } from "@/types/club";
import type { Match } from "@/types/match";

export type LeagueStanding = {
  rank: number;
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export const getLeagueStandings = (
  clubs: Club[],
  matches: Match[],
  season: number,
): LeagueStanding[] => {
  const standings = new Map(
    clubs.map((club) => [
      club.id,
      {
        clubId: club.id,
        clubName: club.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      },
    ]),
  );

  matches.forEach((match) => {
    if (match.season !== season || !match.result) {
      return;
    }

    const home = standings.get(match.homeClubId);
    const away = standings.get(match.awayClubId);
    if (!home || !away) {
      return;
    }

    const { home: homeGoals, away: awayGoals } = match.result.score;
    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (match.result.winnerClubId === null) {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    } else if (match.result.winnerClubId === home.clubId) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    }
  });

  return [...standings.values()]
    .map((standing) => ({
      ...standing,
      goalDifference: standing.goalsFor - standing.goalsAgainst,
    }))
    .sort(
      (first, second) =>
        second.points - first.points ||
        second.goalDifference - first.goalDifference ||
        second.goalsFor - first.goalsFor ||
        first.clubName.localeCompare(second.clubName),
    )
    .map((standing, index) => ({ ...standing, rank: index + 1 }));
};
