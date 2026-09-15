import { createSlice } from "@reduxjs/toolkit";

import { generateClubWithPlayers } from "@/scripts/generateClub";
import { Club } from "@/types/club";
import type { Player } from "@/types/player";
import type { AppThunk, RootState } from ".";
import { setPlayers } from "./playersSlice";

type ClubsState = {
  clubs: Club[];
};

const initialState: ClubsState = {
  clubs: [],
};

const clubsSlice = createSlice({
  name: "clubsSlice",
  initialState,
  reducers: {
    setClubs: (state, action: { payload: Club[] }) => {
      state.clubs = action.payload;
    },
  },
});

export const { setClubs } = clubsSlice.actions;

export const getPlayersInClub = (
  state: RootState,
  clubId: string,
): Player[] => {
  const club = state.clubs.clubs.find((club) => club.id === clubId);

  if (!club) {
    return [];
  }

  return state.players.players.filter((player) =>
    club.playerIds.includes(player.id),
  );
};

export const initializeClubs = (): AppThunk => (dispatch) => {
  const allPlayers: Player[] = [];
  const allClubs: Club[] = [];

  for (let i = 0; i < 10; i++) {
    allClubs.push(generateClubWithPlayers((player) => allPlayers.push(player)));
  }

  dispatch(setClubs(allClubs));
  dispatch(setPlayers(allPlayers));
};

export default clubsSlice.reducer;
