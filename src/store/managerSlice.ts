import { generateTeam } from "@/scripts/Team/generateTeam";
import { getPlayersInClub } from "@/store/clubsSlice";
import type { ManagerLineup } from "@/types/lineup";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from ".";

type ManagersState = {
  managersTeamId?: string;
  lineup?: ManagerLineup;
  loadingText?: string;
  loadingSubtext?: string;
};

const initialState: ManagersState = {};

const managerSlice = createSlice({
  name: "managerSlice",
  initialState,
  reducers: {
    setManagerTeam: (
      state,
      action: PayloadAction<{ teamId: string; lineup?: ManagerLineup }>,
    ) => {
      state.managersTeamId = action.payload.teamId;
      state.lineup = action.payload.lineup;
    },
    saveManagerLineup: (state, action: PayloadAction<ManagerLineup>) => {
      state.lineup = action.payload;
    },
    clearManager: (state) => {
      state.managersTeamId = undefined;
      state.lineup = undefined;
      state.loadingText = undefined;
      state.loadingSubtext = undefined;
    },
    setLoadingText: (
      state,
      action: PayloadAction<{ loadingText?: string; subText?: string }>,
    ) => {
      state.loadingText = action.payload.loadingText;
      state.loadingSubtext = action.payload.subText;
    },
  },
});

const { setManagerTeam, saveManagerLineup, clearManager } =
  managerSlice.actions;

export const setManagerTeamId =
  (teamId: string): AppThunk =>
  (dispatch, getState) => {
    const clubPlayers = getPlayersInClub(getState(), teamId);
    const generatedTeam =
      clubPlayers.length > 0 ? generateTeam(clubPlayers) : undefined;
    const goalkeeper = generatedTeam?.teamPlayers.Goalkeeper.player;
    const lineup: ManagerLineup | undefined =
      generatedTeam && goalkeeper
        ? {
            formation: generatedTeam.formation,
            goalkeeperId: goalkeeper.id,
            defendersIds: generatedTeam.teamPlayers.Defenders.map(
              ({ player }) => player.id,
            ),
            midfieldersIds: generatedTeam.teamPlayers.Midfielders.map(
              ({ player }) => player.id,
            ),
            forwardsIds: generatedTeam.teamPlayers.Forwards.map(
              ({ player }) => player.id,
            ),
          }
        : undefined;

    dispatch(setManagerTeam({ teamId, lineup }));
  };

export { clearManager, saveManagerLineup };
export const { setLoadingText } = managerSlice.actions;
export default managerSlice.reducer;
