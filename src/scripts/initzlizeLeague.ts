import { setInitialState } from "@/store/calenderSlice";
import { initializeClubs } from "@/store/clubsSlice";
import { createLeagueMatches } from "@/store/matchesSlice";

export const initializeLeague = (dispatch: any, numberOfClubs: number) => {
  dispatch(initializeClubs(numberOfClubs));
  dispatch(createLeagueMatches());
  dispatch(setInitialState());
};
