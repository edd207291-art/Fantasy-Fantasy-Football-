import Table from "@/components/ui/Table/Table";
import type { Player } from "@/types/player";
import { useRouter } from "expo-router";
import { Text } from "react-native";

type PlayersTableProps = {
  players: Player[];
};

export default function PlayersTable({ players }: PlayersTableProps) {
  const router = useRouter();

  return (
    <Table
      columns={[
        { key: "name", label: "Name", width: 150 },
        { key: "position", label: "Position", width: 100 },
        { key: "Defending", label: "Def", width: 50 },
        { key: "Dribbling", label: "Dri", width: 50 },
        { key: "Pace", label: "Pac", width: 50 },
        { key: "Passing", label: "Pas", width: 50 },
        { key: "Physical", label: "Phy", width: 50 },
        { key: "Shooting", label: "Sho", width: 50 },
      ]}
      data={players}
      verticalScroll={false}
      getRowKey={(player: Player) => player.id}
      onRowPress={(player) =>
        router.push({ pathname: "/player", params: { id: player.id } })
      }
      renderCell={(player: Player, column: { key: string }) => {
        let tableText: string | number = "";
        switch (column.key) {
          case "name":
            tableText = player.name;
            break;
          case "position":
            tableText = player.positionPreference;
            break;
          case "Defending":
            tableText = player.attributes.Defending;
            break;
          case "Dribbling":
            tableText = player.attributes.Dribbling;
            break;
          case "Pace":
            tableText = player.attributes.Pace;
            break;
          case "Passing":
            tableText = player.attributes.Passing;
            break;
          case "Physical":
            tableText = player.attributes.Physical;
            break;
          case "Shooting":
            tableText = player.attributes.Shooting;
            break;
          default:
            break;
        }

        return <Text className="text-base text-slate-400">{tableText}</Text>;
      }}
    />
  );
}
