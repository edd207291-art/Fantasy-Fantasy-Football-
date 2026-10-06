import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CalendarState = {
  week: number;
  season: number;
  seasonComplete: boolean;
};

const initialState: CalendarState = {
  week: 1,
  season: 1,
  seasonComplete: false,
};

const calendarSlice = createSlice({
  name: "calendarSlice",
  initialState,
  reducers: {
    setInitialState: (state) => {
      state.week = 1;
      state.season = 1;
      state.seasonComplete = false;
    },
    setWeek: (state, action: PayloadAction<number>) => {
      state.week = action.payload;
    },
    setSeason: (state, action: PayloadAction<number>) => {
      state.season = action.payload;
    },
    setSeasonComplete: (state, action: PayloadAction<boolean>) => {
      state.seasonComplete = action.payload;
    },
    nextWeek: (state) => {
      state.week += 1;
    },
  },
});

export const {
  setInitialState,
  setWeek,
  setSeason,
  setSeasonComplete,
  nextWeek,
} = calendarSlice.actions;
export default calendarSlice.reducer;
