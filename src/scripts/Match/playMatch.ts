import { store } from "@/store";
import { getPlayersInClub } from "@/store/clubsSlice";
import { createEvent } from "@/store/eventSlice";
import type { Match, MatchPitchState } from "@/types/match";
import type { Pitch } from "@/types/pitch";
import { generateTeam } from "../Team/generateTeam";
import { setUpPitchForMatch } from "./Pitch/setUpPitchForMatch";
import { playTurn } from "./Turn/playTurn";

const snapshotPitch = (pitch: Pitch): MatchPitchState => {
  const players: MatchPitchState["players"] = [];
  let ballLocation: MatchPitchState["ballLocation"] = null;

  pitch.forEach((row) => {
    row.forEach((zone) => {
      if (zone.playerId) {
        players.push({
          playerId: zone.playerId,
          location: { ...zone.coordinates },
        });
      }

      if (zone.containsBall) {
        ballLocation = { ...zone.coordinates };
      }
    });
  });

  return { players, ballLocation };
};

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
  const pitchHistory: MatchPitchState[] = [snapshotPitch(pitch)];
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
      turnsInMatch: TOTAL_TURNS,
    });

    pitch = turnResult.pitch;
    homeGoals = turnResult.homeGoals;
    awayGoals = turnResult.awayGoals;
    turnResult.events.forEach((event) => store.dispatch(createEvent(event)));
    pitchHistory.push(snapshotPitch(pitch));
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
      pitchStates: pitchHistory,
    },
  };
};
