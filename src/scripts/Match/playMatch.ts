import { store } from "@/store";
import { getPlayersInClub } from "@/store/clubsSlice";
import { Match } from "@/types/match";
import { Pitch } from "@/types/pitch";
import { generateTeam } from "../Team/generateTeam";
import { setUpPitchForMatch } from "./Pitch/setUpPitchForMatch";
import { playTurn } from "./Turn/playTurn";

const clonePitch = (pitch: Pitch): Pitch =>
  pitch.map((row) =>
    row.map((zone) => ({
      ...zone,
      coordinates: { ...zone.coordinates },
    })),
  );

const TOTAL_TURNS = 500;

export const playMatch = (match: Match): Match => {
  const state = store.getState();
  const homeClubPlayers = getPlayersInClub(state, match.homeClubId);
  const homeClubTeam = generateTeam(
    homeClubPlayers,
    state.manager.managersTeamId === match.homeClubId
      ? state.manager.lineup
      : undefined,
  );
  const awayClubPlayers = getPlayersInClub(state, match.awayClubId);
  const awayClubTeam = generateTeam(
    awayClubPlayers,
    state.manager.managersTeamId === match.awayClubId
      ? state.manager.lineup
      : undefined,
  );

  let pitch = setUpPitchForMatch(homeClubTeam, awayClubTeam).pitch;
  const pitchHistory: Pitch[] = [clonePitch(pitch)];
  let homeGoals = 0;
  let awayGoals = 0;

  for (let turn = 0; turn < TOTAL_TURNS; turn += 1) {
    const turnResult = playTurn({
      pitch,
      homeClubTeam,
      awayClubTeam,
      turn,
      matchId: match.id,
      homeGoals,
      awayGoals,
    });

    pitch = turnResult.pitch;
    homeGoals = turnResult.homeGoals;
    awayGoals = turnResult.awayGoals;
    pitchHistory.push(clonePitch(pitch));
  }

  const score = { home: homeGoals, away: awayGoals };
  const winnerClubId =
    homeGoals === awayGoals
      ? null
      : homeGoals > awayGoals
        ? match.homeClubId
        : match.awayClubId;

  console.log(
    `Match ${match.id} ended. Final Score: Home ${homeGoals} - Away ${awayGoals}. Winner: ${winnerClubId ?? "Draw"}`,
  );

  return {
    ...match,
    score,
    // pitchHistory,
    result: {
      winnerClubId,
      score,
      // pitchStates: pitchHistory,
    },
  };
};
