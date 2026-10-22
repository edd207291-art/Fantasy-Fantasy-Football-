import LastMatchCard from "@/components/ui/Card/LastMatchCard";
import LeaguePositionCard from "@/components/ui/Card/LeaguePositionCard";
import NextMatchCard from "@/components/ui/Card/NextMatchCard";
import { Spinner } from "@/components/ui/Spinner";
import { BodyText, MutedText, PageHeading } from "@/components/ui/Typography";
import { getLeagueStandings } from "@/scripts/League/getLeagueStandings";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playCurrentWeek } from "@/store/matchesSlice";
import { EventType } from "@/types/event";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function HomeLeaguePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { season, week } = useAppSelector((state) => state.calendar);
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const players = useAppSelector((state) => state.players.players);
  const managerTeamId = useAppSelector((state) => state.manager.managersTeamId);
  const events = useAppSelector((state) => state.events.events);
  const matches = useAppSelector((state) => state.matches.matches);
  const standings = getLeagueStandings(clubs, matches, season);
  const managerStanding = standings.find(
    (standing) => standing.clubId === managerTeamId,
  );
  const nextMatch = matches
    .filter(
      (match) =>
        match.season === season &&
        (match.homeClubId === managerTeamId ||
          match.awayClubId === managerTeamId) &&
        match.week >= week &&
        !Boolean(match.result?.score ?? match.score),
    )
    .sort((first, second) => first.week - second.week)[0];
  const { loadingText, loadingSubtext } = useAppSelector(
    (state) => state.manager,
  );
  const [isPlayingWeek, setIsPlayingWeek] = useState(false);
  const managerClub = clubs.find((club) => club.id === managerTeamId);
  const lastPlayedMatch = matches
    .filter(
      (match) =>
        (match.homeClubId === managerTeamId ||
          match.awayClubId === managerTeamId) &&
        Boolean(match.result?.score ?? match.score),
    )
    .sort((first, second) =>
      second.season === first.season
        ? second.week - first.week
        : second.season - first.season,
    )[0];
  const lastMatchEvents = events.filter(
    (event) => event.matchId === lastPlayedMatch?.id,
  );
  const homeClub = clubs.find(
    (club) => club.id === lastPlayedMatch?.homeClubId,
  );
  const awayClub = clubs.find(
    (club) => club.id === lastPlayedMatch?.awayClubId,
  );
  const getScorersForClub = (clubId?: string) => {
    const club = clubs.find((item) => item.id === clubId);
    if (!club) {
      return [];
    }

    return lastMatchEvents
      .filter(
        (event) =>
          event.type === EventType.SCORE_GOAL &&
          event.playerId &&
          club.playerIds.includes(event.playerId),
      )
      .map((event, index) => ({
        id: `${event.playerId}-${event.time ?? index}-${index}`,
        name:
          players.find((player) => player.id === event.playerId)?.name ??
          "Unknown player",
        time: event.time,
      }));
  };
  const homeScorers = getScorersForClub(lastPlayedMatch?.homeClubId);
  const awayScorers = getScorersForClub(lastPlayedMatch?.awayClubId);
  const matchScore = lastPlayedMatch?.result?.score ?? lastPlayedMatch?.score;

  const handlePlayCurrentWeek = async () => {
    setIsPlayingWeek(true);
    const seasonMatches = matches.filter((match) => match.season === season);
    const finalWeek = Math.max(0, ...seasonMatches.map((match) => match.week));
    const isFinalWeek = seasonMatches.length > 0 && week >= finalWeek;

    await new Promise<void>((resolve) => setTimeout(resolve, 50));

    try {
      await dispatch(playCurrentWeek());
      if (isFinalWeek) {
        router.replace("/seasonSummary");
      }
    } finally {
      setIsPlayingWeek(false);
    }
  };

  return (
    <>
      <View className="w-full max-w-4xl pb-8">
        <PageHeading className="mb-2">Home Page</PageHeading>
        <BodyText className="mb-4">
          Season {season} - Current Week {week}
        </BodyText>
        <LeaguePositionCard
          standing={managerStanding}
          leagueSize={clubs.length}
        />
        <NextMatchCard
          match={nextMatch}
          clubs={clubs}
          managerClubId={managerTeamId}
        />
        <LastMatchCard
          match={
            lastPlayedMatch && matchScore
              ? {
                  season: lastPlayedMatch.season,
                  week: lastPlayedMatch.week,
                  homeScore: matchScore.home,
                  awayScore: matchScore.away,
                }
              : undefined
          }
          homeTeamName={homeClub?.name ?? "Unknown club"}
          awayTeamName={awayClub?.name ?? "Unknown club"}
          homeScorers={homeScorers}
          awayScorers={awayScorers}
          managerClubName={managerClub?.name}
        />
        <TouchableOpacity
          onPress={handlePlayCurrentWeek}
          disabled={isPlayingWeek}
          className={`rounded bg-blue-600 px-5 py-3 ${
            isPlayingWeek ? "opacity-70" : ""
          }`}
        >
          <MutedText className="text-center font-semibold text-white">
            {isPlayingWeek ? "Playing matches..." : "Play This Weeks Matches"}
          </MutedText>
        </TouchableOpacity>
      </View>
      <Spinner
        visible={isPlayingWeek}
        mainText={loadingText ?? "Playing matches..."}
        subText={loadingSubtext ?? `Simulating week ${week}`}
      />
    </>
  );
}
