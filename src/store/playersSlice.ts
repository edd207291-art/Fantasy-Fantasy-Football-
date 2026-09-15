import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Player } from "@/types/player";

type PlayersState = {
  players: Player[];
};

const initialState: PlayersState = {
  players: [],
};

const playersSlice = createSlice({
  name: "playersSlice",
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    clearPlayers: (state) => {
      state.players = [];
    },
  },
});

export const { addPlayer, setPlayers, clearPlayers } = playersSlice.actions;
export default playersSlice.reducer;
