import Layout from "@/components/ui/Layout";
import { initializeLeague } from "@/scripts/initzlizeLeague";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playCurrentWeek } from "@/store/matchesSlice";
import { Text, TouchableOpacity } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { season, week } = useAppSelector((state) => state.calendar);

  return (
    <Layout>
      <Text className="mb-2 text-3xl font-bold text-white">Home Page</Text>
      <Text className="mb-4 text-base text-slate-300">
        Season {season} - Current Week {week}
      </Text>
      <TouchableOpacity
        onPress={() => initializeLeague(dispatch, 10)}
        className="items-center"
      >
        <Text className="text-base text-slate-400">Initialize League</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => dispatch(playCurrentWeek())}
        className="items-center"
      >
        <Text className="text-base text-slate-400">
          Play This Weeks Matches
        </Text>
      </TouchableOpacity>
    </Layout>
  );
}
