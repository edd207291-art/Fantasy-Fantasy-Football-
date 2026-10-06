import Card from "@/components/ui/Card/Card";
import {
  BodyText,
  Heading,
  SectionLabel,
  Subheading,
} from "@/components/ui/Typography";
import { generateTeam } from "@/scripts/Team/generateTeam";
import type { Player } from "@/types/player";
import { Text, View } from "react-native";

type BestTeamCardProps = {
  players: Player[];
};

type TeamPlayerGroup = {
  label: string;
  players: Player[];
};

export default function BestTeamCard({ players }: BestTeamCardProps) {
  if (players.length === 0) {
    return (
      <Card>
        <Heading>Team</Heading>
        <Subheading>No players available to build a team.</Subheading>
      </Card>
    );
  }

  const { formation, teamPlayers } = generateTeam(players);
  const groups: TeamPlayerGroup[] = [
    { label: "Goalkeeper", players: [teamPlayers.Goalkeeper] },
    { label: "Defenders", players: teamPlayers.Defenders },
    { label: "Midfielders", players: teamPlayers.Midfielders },
    { label: "Forwards", players: teamPlayers.Forwards },
  ];

  return (
    <Card className="mb-6">
      <View className="mb-4 flex-row items-end justify-between gap-4">
        <View>
          <Heading>Team</Heading>
          <Subheading>Clubs lineup</Subheading>
        </View>
        <Text className="text-lg font-bold text-blue-400">{formation}</Text>
      </View>

      <View className="gap-3">
        {groups.map((group) => (
          <View
            key={group.label}
            className="border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
          >
            <SectionLabel>{group.label}</SectionLabel>
            <BodyText>
              {group.players
                .map(
                  (player) => `${player.name} (${player.positionPreference})`,
                )
                .join(", ") || "No eligible players"}
            </BodyText>
          </View>
        ))}
      </View>
    </Card>
  );
}
