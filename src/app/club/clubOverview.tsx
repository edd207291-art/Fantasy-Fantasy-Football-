import BestTeamCard from "@/components/ui/Card/BestTeamCard";
import ClubMatchesCard from "@/components/ui/Card/ClubMatchesCard";
import PlayersCard from "@/components/ui/Card/PlayersCard";
import Layout from "@/components/ui/Layout";
import { getPlayersInClub } from "@/store/clubsSlice";
import { useAppSelector } from "@/store/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ClubOverview() {
  const { id: clubId } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const club = useAppSelector((state) =>
    state.clubs.clubs.find((candidate) => candidate.id === clubId),
  );
  const players = useAppSelector((state) =>
    club ? getPlayersInClub(state, club.id) : [],
  );
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const matches = useAppSelector((state) => state.matches.matches);
  const managersClubId = useAppSelector(
    (state) => state.manager.managersTeamId,
  );
  if (managersClubId === club?.id) {
    router.replace("/myTeam");
  }

  return (
    <Layout>
      <View className="w-full max-w-4xl flex-1 py-8">
        <View className="mb-6 flex-row items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <View className="flex-1">
            <Text className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Club squad
            </Text>
            <Text className="mt-2 text-3xl font-bold text-white">
              {club?.name ?? "NAME NOT FOUND"}
            </Text>
            <Text className="mt-2 text-base text-slate-400">
              {players.length} {players.length === 1 ? "player" : "players"}{" "}
              registered
            </Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 active:bg-slate-700"
          >
            <Text className="font-semibold text-slate-200">Back to clubs</Text>
          </Pressable>
        </View>

        <BestTeamCard players={players} />
        <ClubMatchesCard
          clubId={clubId ?? ""}
          clubs={clubs}
          matches={matches}
        />
        <PlayersCard players={players} />
      </View>
    </Layout>
  );
}
