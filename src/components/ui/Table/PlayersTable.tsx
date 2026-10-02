import Table from "@/components/ui/Table/Table";
import { getPlayerRating } from "@/scripts/Player/getPlayerRating";
import type { Player } from "@/types/player";
import { Text } from "react-native";

type PlayersTableProps = {
  players: Player[];
};

export default function PlayersTable({ players }: PlayersTableProps) {
  return (
    <Table
      columns={[
        { key: "name", label: "Name", width: 192 },
        { key: "position", label: "Position", width: 144 },
        { key: "rating", label: "Rating", width: 96 },
      ]}
      data={players}
      verticalScroll={false}
      getRowKey={(player: Player) => player.id}
      renderCell={(player: Player, column: { key: string }) => (
        <Text className="text-base text-slate-400">
          {column.key === "name"
            ? player.name
            : column.key === "position"
              ? player.positionPreference
              : column.key === "rating"
                ? getPlayerRating(player)
                : ""}
        </Text>
      )}
    />
  );
}
