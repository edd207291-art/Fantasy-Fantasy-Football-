import { store } from "@/store";
import { getPlayersInClub } from "@/store/clubsSlice";
import { Match } from "@/types/match";
import { generateTeam } from "./Team/generateTeam";

export const playMatch = (match: Match): Match => {
  const state = store.getState();
  const homeClubPlayers = getPlayersInClub(state, match.homeClubId);
  const homeTeam = Object.values(
    generateTeam(homeClubPlayers).teamPlayers,
  ).flat();
  const homeTeamRating = homeTeam.reduce(
    (sum, player) => sum + player.rating,
    0,
  );
  const awayClubPlayers = getPlayersInClub(state, match.awayClubId);
  const awayTeam = Object.values(
    generateTeam(awayClubPlayers).teamPlayers,
  ).flat();
  const awayTeamRating = awayTeam.reduce(
    (sum, player) => sum + player.rating,
    0,
  );

  return {
    id: match.id,
    homeClubId: match.homeClubId,
    awayClubId: match.awayClubId,
    season: match.season,
    week: match.week,
    result: {
      winnerClubId:
        homeTeamRating > awayTeamRating ? match.homeClubId : match.awayClubId,
    },
  };
};
