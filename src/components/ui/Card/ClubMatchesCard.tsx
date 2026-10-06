import Card from "@/components/ui/Card/Card";
import {
  BodyText,
  Heading,
  MutedText,
  Subheading,
} from "@/components/ui/Typography";
import type { Club } from "@/types/club";
import type { Match } from "@/types/match";
import { Text, View } from "react-native";

type ClubMatchesCardProps = {
  clubId: string;
  clubs: Club[];
  matches: Match[];
};

export default function ClubMatchesCard({
  clubId,
  clubs,
  matches,
}: ClubMatchesCardProps) {
  const clubNames = new Map(clubs.map((club) => [club.id, club.name]));
  const clubMatches = matches.filter(
    (match) => match.homeClubId === clubId || match.awayClubId === clubId,
  );

  return (
    <Card>
      <View className="mb-4">
        <Heading>Club matches</Heading>
        <Subheading>Match results for this club</Subheading>
      </View>

      {clubMatches.length === 0 ? (
        <MutedText>No matches scheduled yet.</MutedText>
      ) : (
        <View className="gap-3">
          {clubMatches.map((match) => {
            const isHome = match.homeClubId === clubId;
            const opponentId = isHome ? match.awayClubId : match.homeClubId;
            const winnerClubId = match.result?.winnerClubId;
            const status = !match.result
              ? "Not played"
              : winnerClubId === null
                ? "Draw"
                : winnerClubId === clubId
                  ? "Won"
                  : "Lost";
            const statusClassName =
              status === "Won"
                ? "text-emerald-400"
                : status === "Lost"
                  ? "text-red-400"
                  : status === "Draw"
                    ? "text-amber-400"
                    : "text-slate-400";
            const score = match.result?.score ?? match.score;
            const opponentName = clubNames.get(opponentId) || "Unknown club";

            return (
              <View
                key={match.id}
                className="flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
              >
                <View className="flex-1">
                  <BodyText className="font-semibold text-slate-200">
                    {`${isHome ? "Home" : "Away"} vs. ${opponentName}`}
                  </BodyText>
                  <Subheading>Week {match.week}</Subheading>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-white">
                    {score ? `${score.home} - ${score.away}` : "—"}
                  </Text>
                  <Text className={`font-semibold ${statusClassName}`}>
                    {status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}
