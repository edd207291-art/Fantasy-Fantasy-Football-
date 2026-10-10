import Layout from "@/components/ui/Layout";
import LeagueStandingsTable from "@/components/ui/Table/LeagueStandingsTable";
import { PageHeading, Subheading } from "@/components/ui/Typography";
import { getLeagueStandings } from "@/scripts/League/getLeagueStandings";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startNextSeason } from "@/store/matchesSlice";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const getOrdinal = (rank: number) => {
  const lastTwoDigits = rank % 100;
  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? "th"
      : rank % 10 === 1
        ? "st"
        : rank % 10 === 2
          ? "nd"
          : rank % 10 === 3
            ? "rd"
            : "th";

  return `${rank}${suffix}`;
};

export default function SeasonSummaryScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const matches = useAppSelector((state) => state.matches.matches);
  const season = useAppSelector((state) => state.calendar.season);
  const managerTeamId = useAppSelector((state) => state.manager.managersTeamId);
  const standings = getLeagueStandings(clubs, matches, season);
  const managerStanding = standings.find(
    (standing) => standing.clubId === managerTeamId,
  );

  const handleNextSeason = () => {
    dispatch(startNextSeason());
    router.replace("/");
  };

  return (
    <Layout>
      <View className="w-full max-w-5xl py-8">
        <View className="mb-6 border-b border-slate-800 pb-6">
          <PageHeading>Season Complete</PageHeading>
          <Subheading>Season {season} final standings</Subheading>
          {managerStanding ? (
            <Text className="mt-5 text-2xl font-bold text-emerald-400">
              {managerStanding.clubName} finished{" "}
              {getOrdinal(managerStanding.rank)}
            </Text>
          ) : (
            <Text className="mt-5 text-base text-slate-400">
              Your team is not in the final standings.
            </Text>
          )}
          {managerStanding ? (
            <Text className="mt-2 text-base text-slate-300">
              {managerStanding.points} points · {managerStanding.won} wins ·{" "}
              {managerStanding.drawn} draws · {managerStanding.lost} losses
            </Text>
          ) : null}
          <Pressable
            onPress={handleNextSeason}
            className="mt-6 self-start rounded-md bg-emerald-700 px-5 py-3 active:bg-emerald-600"
          >
            <Text className="font-semibold text-white">Next Season</Text>
          </Pressable>
        </View>

        <LeagueStandingsTable
          standings={standings}
          highlightedClubId={managerTeamId}
        />
      </View>
    </Layout>
  );
}
