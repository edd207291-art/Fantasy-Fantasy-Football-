import { configureStore } from "@reduxjs/toolkit";
import type { Action } from "redux";
import type { ThunkAction } from "redux-thunk";

import clubsReducer from "./clubsSlice";
import matchesReducer from "./matchesSlice";
import playersReducer from "./playersSlice";

export const store = configureStore({
  reducer: {
    clubs: clubsReducer,
    matches: matchesReducer,
    players: playersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
