import { createSlice } from "@reduxjs/toolkit";

import { generateMatch } from "@/scripts/generateMatch";
import type { Match } from "@/types/match";
import type { AppThunk } from ".";

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

export const playFriendlyMatches = (): AppThunk => (dispatch, getState) => {
  const clubs = [...getState().clubs.clubs];

  for (let index = clubs.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clubs[index], clubs[randomIndex]] = [clubs[randomIndex], clubs[index]];
  }

  const matches: Match[] = [];
  for (let index = 0; index + 1 < clubs.length; index += 2) {
    matches.push(generateMatch(clubs[index], clubs[index + 1]));
  }

  const previousMatches = getState().matches.matches;
  dispatch(setMatches([...previousMatches, ...matches]));
};

export default matchesSlice.reducer;
