import { createSlice } from "@reduxjs/toolkit";

import { generateClubWithPlayers } from "@/scripts/generateClub";
import { Club } from "@/types/club";
import type { Player } from "@/types/player";
import type { AppThunk, RootState } from ".";
import { addPlayer } from "./playersSlice";

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
    addClub: (state, action: { payload: Club }) => {
      state.clubs.push(action.payload);
    },
    setClubs: (state, action: { payload: Club[] }) => {
      state.clubs = action.payload;
    },
  },
});

export const { addClub, setClubs } = clubsSlice.actions;

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

export const initializeClubs =
  (numberOfClubs: number): AppThunk =>
  (dispatch, getState) => {
    for (let i = 0; i < numberOfClubs; i++) {
      const existingClubNames = new Set(
        getState().clubs.clubs.map((existingClub) => existingClub.name),
      );

      const club = generateClubWithPlayers((player) => {
        dispatch(addPlayer(player));
      }, existingClubNames);

      dispatch(addClub(club));
    }
  };

export default clubsSlice.reducer;
