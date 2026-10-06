import { NUMBER_OF_CLUBS_IN_LEAGUE } from "@/static/GlobalVars";
import type { AppThunk } from "@/store";
import { setInitialState } from "@/store/calenderSlice";
import { initializeClubs } from "@/store/clubsSlice";
import { setManagerTeamId } from "@/store/managerSlice";
import { createLeagueMatches } from "@/store/matchesSlice";

export const initializeLeague = (): AppThunk => (dispatch, getState) => {
  dispatch(initializeClubs(NUMBER_OF_CLUBS_IN_LEAGUE));
  const managerClub = getState().clubs.clubs[0];

  if (managerClub) {
    dispatch(setManagerTeamId(managerClub.id));
  }

  dispatch(createLeagueMatches());
  dispatch(setInitialState());
};
