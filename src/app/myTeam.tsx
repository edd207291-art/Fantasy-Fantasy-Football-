import ClubMatchesCard from "@/components/ui/Card/ClubMatchesCard";
import CreateLineupCard from "@/components/ui/Card/CreateLineupCard";
import PlayersCard from "@/components/ui/Card/PlayersCard";
import Layout from "@/components/ui/Layout";
import { BodyText } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import { Text, View } from "react-native";

export default function MyTeamScreen() {
  const managerTeamId = useAppSelector((state) => state.manager.managersTeamId);
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const allPlayers = useAppSelector((state) => state.players.players);
  const matches = useAppSelector((state) => state.matches.matches);

  const club = clubs.find((candidate) => candidate.id === managerTeamId);
  const players = club
    ? allPlayers.filter((player) => club.playerIds.includes(player.id))
    : [];

  return (
    <Layout>
      <View className="w-full max-w-4xl flex-1 py-8">
        <View className="mb-6 border-b border-slate-800 pb-6">
          <Text className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Manager&apos;s club
          </Text>
          <Text className="mt-2 text-3xl font-bold text-white">
            {club?.name ?? "My Team"}
          </Text>
          <BodyText className="mt-2">
            {club
              ? `${players.length} ${players.length === 1 ? "player" : "players"} in your squad`
              : "No team is assigned to your manager profile."}
          </BodyText>
        </View>

        {club ? (
          <>
            <CreateLineupCard players={players} />
            <ClubMatchesCard clubId={club.id} clubs={clubs} matches={matches} />
            <PlayersCard players={players} />
          </>
        ) : null}
      </View>
    </Layout>
  );
}
