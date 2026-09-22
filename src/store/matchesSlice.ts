import { createSlice } from "@reduxjs/toolkit";

import { generateLeagueMatches } from "@/scripts/generateLeagueMatches";
import { playWeeksMatchs } from "@/scripts/playWeekMatchs";
import type { Match } from "@/types/match";
import type { AppThunk } from ".";
import { nextWeek } from "./calenderSlice";

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

export const playCurrentWeek = (): AppThunk => (dispatch, getState) => {
  const { matches } = getState().matches;
  const { week } = getState().calendar;

  dispatch(setMatches(playWeeksMatchs(matches, week)));
  dispatch(nextWeek());
};

export const createLeagueMatches = (): AppThunk => (dispatch, getState) => {
  const clubs = [...getState().clubs.clubs];

  const matches = generateLeagueMatches(clubs);
  dispatch(setMatches(matches));
};

export default matchesSlice.reducer;
