import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  combineReducers,
  configureStore,
  createAction,
} from "@reduxjs/toolkit";
import type { Action } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import type { ThunkAction } from "redux-thunk";

import calendarReducer from "./calenderSlice";
import clubsReducer from "./clubsSlice";
import matchesReducer from "./matchesSlice";
import playersReducer from "./playersSlice";

const appReducer = combineReducers({
  calendar: calendarReducer,
  clubs: clubsReducer,
  matches: matchesReducer,
  players: playersReducer,
});

export const resetStore = createAction("store/reset");

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Action,
) => {
  if (resetStore.match(action)) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
