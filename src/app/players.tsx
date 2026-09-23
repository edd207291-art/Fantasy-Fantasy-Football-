import Layout from "@/components/ui/Layout";
import Table from "@/components/ui/Table";
import { getBestPosition } from "@/scripts/Player/getBestPosition";
import { useAppSelector } from "@/store/hooks";
import { Player } from "@/types/player";
import { Text, View } from "react-native";
import "../global.css";

export default function PlayersScreen() {
  const players = useAppSelector((state) => state.players.players);

  return (
    <Layout>
      <View className="w-full max-w-3xl flex-1">
        <Text className="mb-6 text-3xl font-bold text-white">Players</Text>

        <Table
          columns={[
            { key: "name", label: "Name", width: 256 },
            { key: "position", label: "Best Position", width: 160 },
            { key: "rating", label: "Rating", width: 160 },
          ]}
          data={players}
          getRowKey={(player: Player) => player.id}
          renderCell={(player: Player, column: { key: string }) => (
            <Text className="text-base text-slate-400">
              {column.key === "name"
                ? player.name
                : column.key === "position"
                  ? getBestPosition(player).position
                  : column.key === "rating"
                    ? getBestPosition(player).rating.toString()
                    : ""}
            </Text>
          )}
        />
      </View>
    </Layout>
  );
}
