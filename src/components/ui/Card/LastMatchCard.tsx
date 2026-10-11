import Card from "@/components/ui/Card/Card";
import {
    BodyText,
    Heading,
    MutedText,
    Subheading,
} from "@/components/ui/Typography";
import { Text, View } from "react-native";

type ScorerDetail = {
  id: string;
  name: string;
  time?: string;
};

type LastMatchCardProps = {
  match?: {
    season: number;
    week: number;
    homeScore: number;
    awayScore: number;
  };
  homeTeamName: string;
  awayTeamName: string;
  homeScorers: ScorerDetail[];
  awayScorers: ScorerDetail[];
  managerClubName?: string;
};

export default function LastMatchCard({
  match,
  homeTeamName,
  awayTeamName,
  homeScorers,
  awayScorers,
  managerClubName,
}: LastMatchCardProps) {
  return (
    <Card>
      <Heading>Last match</Heading>
      {match ? (
        <>
          <Subheading>
            Season {match.season} / Week {match.week}
          </Subheading>
          <View className="mt-3 flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <BodyText className="font-semibold text-slate-200">
                {homeTeamName}
              </BodyText>
              {homeScorers.length > 0 ? (
                <View className="mt-1 gap-1">
                  {homeScorers.map((scorer) => (
                    <MutedText key={scorer.id} className="text-sm">
                      {scorer.name}
                      {scorer.time ? ` ${scorer.time}'` : ""}
                    </MutedText>
                  ))}
                </View>
              ) : null}
            </View>
            <Text className="font-bold text-white">
              {match.homeScore} - {match.awayScore}
            </Text>
            <View className="flex-1 items-end">
              <BodyText className="text-right font-semibold text-slate-200">
                {awayTeamName}
              </BodyText>
              {awayScorers.length > 0 ? (
                <View className="mt-1 items-end gap-1">
                  {awayScorers.map((scorer) => (
                    <MutedText key={scorer.id} className="text-right text-sm">
                      {scorer.name}
                      {scorer.time ? ` ${scorer.time}'` : ""}
                    </MutedText>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
          {homeScorers.length === 0 && awayScorers.length === 0 ? (
            <View className="mt-3 border-t border-slate-800 pt-3">
              <MutedText>No goals scored.</MutedText>
            </View>
          ) : null}
        </>
      ) : (
        <MutedText className="mt-2">
          No matches played by {managerClubName ?? "your club"} yet.
        </MutedText>
      )}
    </Card>
  );
}
