import Layout from "@/components/ui/Layout";
import Table from "@/components/ui/Table";
import { useAppSelector } from "@/store/hooks";
import { Text, View } from "react-native";
import "../global.css";

export default function MatchesScreen() {
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const matches = useAppSelector((state) => state.matches.matches);

  const clubNames = new Map(clubs.map((club) => [club.id, club.name]));

  return (
    <Layout>
      <View className="w-full max-w-3xl flex-1">
        <Text className="mb-6 text-3xl font-bold text-white">Matches</Text>

        <Table
          columns={[
            { key: "home", label: "Home", width: 192 },
            { key: "away", label: "Away", width: 192 },
            { key: "week", label: "Week", width: 64 },
            { key: "winner", label: "Winner", width: 192 },
          ]}
          data={matches}
          emptyMessage="No matches played yet. Generate clubs to create matches."
          getRowKey={(match) => match.id}
          renderCell={(match, column) => (
            <Text className="text-base text-slate-400">
              {column.key === "home"
                ? (clubNames.get(match.homeClubId) ?? "Unknown club")
                : column.key === "away"
                  ? (clubNames.get(match.awayClubId) ?? "Unknown club")
                  : column.key === "week"
                    ? match.week.toString()
                    : clubNames.get(match.result?.winnerClubId ?? "")}
            </Text>
          )}
        />
      </View>
    </Layout>
  );
}
