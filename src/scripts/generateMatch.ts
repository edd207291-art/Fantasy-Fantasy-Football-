import { store } from "@/store";
import { getPlayersInClub } from "@/store/clubsSlice";
import { Club } from "@/types/club";
import { Match } from "@/types/match";
import { v4 as uuidv4 } from "uuid";
import { generateTeam } from "./generateTeam";

export const generateMatch = (homeClub: Club, awayClub: Club): Match => {
  const state = store.getState();
  const homeClubPlayers = getPlayersInClub(state, homeClub.id);
  const homeTeam = generateTeam(homeClubPlayers);
  const homeTeamRating = homeTeam.reduce(
    (sum, player) => sum + player.rating,
    0,
  );
  const awayClubPlayers = getPlayersInClub(state, awayClub.id);
  const awayTeam = generateTeam(awayClubPlayers);
  const awayTeamRating = awayTeam.reduce(
    (sum, player) => sum + player.rating,
    0,
  );
  return {
    id: uuidv4(),
    homeClubId: homeClub.id,
    awayClubId: awayClub.id,
    winnerClubId: homeTeamRating > awayTeamRating ? homeClub.id : awayClub.id,
  };
};
