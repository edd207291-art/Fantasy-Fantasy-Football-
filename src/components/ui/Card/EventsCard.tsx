import Card from "@/components/ui/Card/Card";
import { Heading, MutedText } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import { EventType } from "@/types/event";
import { Text, View } from "react-native";

type EventsCardProps = {
  playerId: string;
};

export const EventsCard = ({ playerId }: EventsCardProps) => {
  const events = useAppSelector((state) => state.events.events);
  const matches = useAppSelector((state) => state.matches.matches);
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const playerEvents = events
    .filter((event) => event.playerId === playerId)
    .sort((first, second) => {
      const firstMatch = matches.find((match) => match.id === first.matchId);
      const secondMatch = matches.find((match) => match.id === second.matchId);

      if (!firstMatch || !secondMatch) {
        return 0;
      }

      return (
        secondMatch.season - firstMatch.season ||
        secondMatch.week - firstMatch.week ||
        Number(second.time ?? 0) - Number(first.time ?? 0)
      );
    });

  return (
    <Card>
      <Heading>Player events</Heading>
      {playerEvents.length > 0 ? (
        <View className="mt-3">
          {playerEvents.map((event, index) => {
            const match = matches.find(
              (candidate) => candidate.id === event.matchId,
            );
            const homeClub = clubs.find(
              (club) => club.id === match?.homeClubId,
            );
            const awayClub = clubs.find(
              (club) => club.id === match?.awayClubId,
            );

            return (
              <View
                key={`${event.matchId ?? "event"}-${event.time ?? index}-${index}`}
                className="border-b border-slate-800 py-3 last:border-b-0"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="font-semibold text-slate-100">
                    {event.type === EventType.SCORE_GOAL
                      ? "Goal"
                      : "Match event"}
                  </Text>
                  {event.time ? (
                    <Text className="font-semibold text-emerald-400">
                      {`${event.time}'`}
                    </Text>
                  ) : null}
                </View>
                <MutedText className="mt-1 text-sm">
                  {match
                    ? `Season ${match.season} / Week ${match.week} - ${homeClub?.name ?? "Unknown club"} vs ${awayClub?.name ?? "Unknown club"}`
                    : "Match details unavailable"}
                </MutedText>
              </View>
            );
          })}
        </View>
      ) : (
        <MutedText className="mt-2">
          No events recorded for this player yet.
        </MutedText>
      )}
    </Card>
  );
};
