import Layout from "@/components/ui/Layout";
import LeagueStandingsTable from "@/components/ui/Table/LeagueStandingsTable";
import { PageHeading, Subheading } from "@/components/ui/Typography";
import { getLeagueStandings } from "@/scripts/League/getLeagueStandings";
import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";

export default function LeaguesScreen() {
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const matches = useAppSelector((state) => state.matches.matches);
  const season = useAppSelector((state) => state.calendar.season);
  const standings = getLeagueStandings(clubs, matches, season);

  return (
    <Layout>
      <View className="w-full max-w-5xl flex-1 py-8">
        <View className="mb-6 border-b border-slate-800 pb-5">
          <PageHeading>League Table</PageHeading>
          <Subheading>Season {season} standings</Subheading>
        </View>

        <LeagueStandingsTable standings={standings} />
      </View>
    </Layout>
  );
}
