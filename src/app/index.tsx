import Layout from "@/components/ui/Layout";
import { BodyText, MutedText, PageHeading } from "@/components/ui/Typography";
import { initializeLeague } from "@/scripts/initzlizeLeague";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playCurrentWeek } from "@/store/matchesSlice";
import { TouchableOpacity } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { season, week } = useAppSelector((state) => state.calendar);

  return (
    <Layout>
      <PageHeading className="mb-2">Home Page</PageHeading>
      <BodyText className="mb-4">
        Season {season} - Current Week {week}
      </BodyText>
      <TouchableOpacity
        onPress={() => initializeLeague(dispatch, 2)}
        className="items-center"
      >
        <MutedText>Initialize League</MutedText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => dispatch(playCurrentWeek())}
        className="items-center"
      >
        <MutedText>Play This Weeks Matches</MutedText>
      </TouchableOpacity>
    </Layout>
  );
}
