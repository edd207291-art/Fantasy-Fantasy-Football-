import Card from "@/components/ui/Card/Card";
import PlayersTable from "@/components/ui/Table/PlayersTable";
import { Heading, Subheading } from "@/components/ui/Typography";
import type { Player } from "@/types/player";
import { View } from "react-native";

type PlayersCardProps = {
  players: Player[];
};

export default function PlayersCard({ players }: PlayersCardProps) {
  return (
    <Card>
      <View className="mb-4">
        <Heading>Players</Heading>
        <Subheading>Current squad ratings and positions</Subheading>
      </View>

      <PlayersTable players={players} />
    </Card>
  );
}
