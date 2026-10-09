import Table from "@/components/ui/Table/Table";
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
            tableText = player.Defending;
            break;
          case "Dribbling":
            tableText = player.Dribbling;
            break;
          case "Pace":
            tableText = player.Pace;
            break;
          case "Passing":
            tableText = player.Passing;
            break;
          case "Physical":
            tableText = player.Physical;
            break;
          case "Shooting":
            tableText = player.Shooting;
            break;
          default:
            break;
        }

        return <Text className="text-base text-slate-400">{tableText}</Text>;
      }}
    />
  );
}
