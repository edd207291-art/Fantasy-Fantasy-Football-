import Card from "@/components/ui/Card/Card";
import {
    BodyText,
    Heading,
    MutedText,
    SectionLabel,
    Subheading,
} from "@/components/ui/Typography";
import type { LeagueStanding } from "@/scripts/League/getLeagueStandings";
import { Text, View } from "react-native";

type LeaguePositionCardProps = {
  standing?: LeagueStanding;
  leagueSize: number;
};

export default function LeaguePositionCard({
  standing,
  leagueSize,
}: LeaguePositionCardProps) {
  if (!standing) {
    return null;
  }

  return (
    <Card>
      <View className="mb-4">
        <Heading>League position</Heading>
        <Subheading>{standing.clubName}</Subheading>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="min-w-20 items-center rounded bg-slate-800 px-4 py-3">
          <SectionLabel className="mb-0">Rank</SectionLabel>
          <Text className="text-3xl font-bold text-emerald-400">
            {standing.rank}
          </Text>
        </View>
        <View className="flex-1 gap-1">
          <BodyText className="font-semibold">of {leagueSize} clubs</BodyText>
          <MutedText>
            {standing.points} pts | {standing.won}W {standing.drawn}D{" "}
            {standing.lost}L
          </MutedText>
          <MutedText>{standing.played} matches played</MutedText>
        </View>
      </View>
    </Card>
  );
}
