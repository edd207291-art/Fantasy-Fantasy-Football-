import { createSlice } from "@reduxjs/toolkit";

import { generateLeagueMatches } from "@/scripts/generateLeagueMatches";
import { playWeeksMatchs } from "@/scripts/playWeekMatchs";
import type { Match } from "@/types/match";
import type { AppThunk } from ".";
import {
  nextWeek,
  setSeason,
  setSeasonComplete,
  setWeek,
} from "./calenderSlice";
import { setLoadingText } from "./managerSlice";

type MatchesState = {
  matches: Match[];
};

const initialState: MatchesState = {
  matches: [],
};

const matchesSlice = createSlice({
  name: "matchesSlice",
  initialState,
  reducers: {
    setMatches: (state, action: { payload: Match[] }) => {
      state.matches = action.payload;
    },
  },
});

export const { setMatches } = matchesSlice.actions;

export const playCurrentWeek =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const { matches } = getState().matches;
    const { season, week } = getState().calendar;
    const seasonClubs = getState().clubs.clubs;
    const seasonMatches = matches.filter((match) => match.season === season);
    const finalWeek = Math.max(0, ...seasonMatches.map((match) => match.week));
    const isFinalWeek = seasonMatches.length > 0 && week >= finalWeek;

    try {
      const updatedMatches = await playWeeksMatchs(
        matches,
        season,
        week,
        (match, index, total) => {
          const homeName =
            seasonClubs.find((club) => club.id === match.homeClubId)?.name ??
            "Home club";
          const awayName =
            seasonClubs.find((club) => club.id === match.awayClubId)?.name ??
            "Away club";

          dispatch(
            setLoadingText({
              loadingText: `Playing match ${index} of ${total}`,
              subText: `${homeName} vs. ${awayName}`,
            }),
          );
        },
        (playedMatches) => dispatch(setMatches(playedMatches)),
      );

      dispatch(setMatches(updatedMatches));
      dispatch(nextWeek());
      if (isFinalWeek) {
        dispatch(setSeasonComplete(true));
      }
    } finally {
      dispatch(setLoadingText({}));
    }
  };

export const startNextSeason = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const nextSeason = state.calendar.season + 1;
  const nextSeasonMatches = generateLeagueMatches(
    state.clubs.clubs,
    nextSeason,
  );

  dispatch(setMatches([...state.matches.matches, ...nextSeasonMatches]));
  dispatch(setSeason(nextSeason));
  dispatch(setWeek(1));
  dispatch(setSeasonComplete(false));
  dispatch(setLoadingText({}));
};

export const createLeagueMatches = (): AppThunk => (dispatch, getState) => {
  const clubs = [...getState().clubs.clubs];

  const matches = generateLeagueMatches(clubs);
  dispatch(setMatches(matches));
};

export default matchesSlice.reducer;
