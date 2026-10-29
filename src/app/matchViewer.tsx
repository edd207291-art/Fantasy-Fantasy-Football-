import Layout from "@/components/ui/Layout";
import { ButtonText, PageHeading } from "@/components/ui/Typography";
import {
  createPitch,
  PITCH_LENGTH,
  PITCH_WIDTH,
} from "@/scripts/Match/Pitch/createPitch";
import { setUpPitchForMatch } from "@/scripts/Match/Pitch/setUpPitchForMatch";
import { generateTeam } from "@/scripts/Team/generateTeam";
import { useAppSelector } from "@/store/hooks";
import type { MatchPitchState } from "@/types/match";
import type { Pitch } from "@/types/pitch";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import "../global.css";

const buildPitchFromState = (state: MatchPitchState): Pitch => {
  const playerIdsByLocation = new Map(
    state.players.map(({ playerId, location }) => [
      `${location.x},${location.y}`,
      playerId,
    ]),
  );

  return createPitch().map((row) =>
    row.map((zone) => {
      const locationKey = `${zone.coordinates.x},${zone.coordinates.y}`;

      return {
        ...zone,
        playerId: playerIdsByLocation.get(locationKey),
        containsBall:
          state.ballLocation?.x === zone.coordinates.x &&
          state.ballLocation.y === zone.coordinates.y,
      };
    }),
  );
};

export default function MatchViewerScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const players = useAppSelector((state) => state.players.players);
  const matches = useAppSelector((state) => state.matches.matches);
  const managerTeamId = useAppSelector((state) => state.manager.managersTeamId);
  const managerLineup = useAppSelector((state) => state.manager.lineup);
  const [previewMode, setPreviewMode] = useState<"setup" | "turns">("setup");
  const [turnIndex, setTurnIndex] = useState(0);

  const clubNames = new Map(clubs.map((club) => [club.id, club.name]));
  const previewMatch = matches.find((match) => match.id === matchId);
  const pitchStates = useMemo(
    () => previewMatch?.result?.pitchStates ?? [],
    [previewMatch],
  );

  useEffect(() => {
    if (previewMode !== "turns" || !pitchStates.length) {
      return;
    }

    const interval = setInterval(() => {
      setTurnIndex((currentIndex) =>
        currentIndex >= pitchStates.length - 1 ? 0 : currentIndex + 1,
      );
    }, 500);

    return () => clearInterval(interval);
  }, [pitchStates, previewMode]);

  const previewPitch = useMemo(() => {
    if (!previewMatch) {
      return null;
    }

    if (previewMode === "turns" && pitchStates.length) {
      const state =
        pitchStates[turnIndex] ?? pitchStates[pitchStates.length - 1];
      return buildPitchFromState(state);
    }

    const homeClub = clubs.find((club) => club.id === previewMatch.homeClubId);
    const awayClub = clubs.find((club) => club.id === previewMatch.awayClubId);

    if (!homeClub || !awayClub) {
      return null;
    }

    const homePlayers = players.filter((player) =>
      homeClub.playerIds.includes(player.id),
    );
    const awayPlayers = players.filter((player) =>
      awayClub.playerIds.includes(player.id),
    );
    const homeTeam = generateTeam(
      homePlayers,
      managerTeamId === previewMatch.homeClubId ? managerLineup : undefined,
    );
    const awayTeam = generateTeam(
      awayPlayers,
      managerTeamId === previewMatch.awayClubId ? managerLineup : undefined,
    );

    return setUpPitchForMatch(homeTeam, awayTeam).pitch;
  }, [
    clubs,
    managerLineup,
    managerTeamId,
    players,
    pitchStates,
    previewMatch,
    previewMode,
    turnIndex,
  ]);

  if (!previewMatch || !previewPitch) {
    return (
      <Layout>
        <PageHeading>Match not found</PageHeading>
      </Layout>
    );
  }

  const previewTitle =
    previewMode === "turns"
      ? `Turn ${turnIndex + 1}/${Math.max(pitchStates.length, 1)}`
      : "Initial match setup";
  const homePlayerIds = new Set(
    clubs.find((club) => club.id === previewMatch.homeClubId)?.playerIds ?? [],
  );

  return (
    <Layout>
      <PageHeading className="mb-6">Match Viewer</PageHeading>

      <View className="w-full max-w-2xl self-center">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            {previewTitle}
          </Text>
          <Text className="text-sm text-slate-500">
            {clubNames.get(previewMatch.homeClubId) ?? "Unknown club"} vs{" "}
            {clubNames.get(previewMatch.awayClubId) ?? "Unknown club"}
          </Text>
        </View>

        <View className="mb-3 flex-row gap-2">
          <Pressable
            onPress={() => {
              setPreviewMode("setup");
              setTurnIndex(0);
            }}
            className={`rounded px-3 py-1 ${previewMode === "setup" ? "bg-blue-600" : "bg-slate-700"}`}
          >
            <ButtonText className="text-center">Initial setup</ButtonText>
          </Pressable>
          <Pressable
            onPress={() => {
              setPreviewMode("turns");
              setTurnIndex(0);
            }}
            disabled={!pitchStates.length}
            className={`rounded px-3 py-1 ${previewMode === "turns" ? "bg-blue-600" : "bg-slate-700"}`}
            style={{ opacity: pitchStates.length ? 1 : 0.5 }}
          >
            <ButtonText className="text-center">Turn-by-turn</ButtonText>
          </Pressable>
        </View>

        <View
          className="w-full overflow-hidden rounded-xl border-2 border-white/70 bg-emerald-700"
          style={{ aspectRatio: PITCH_LENGTH / PITCH_WIDTH }}
        >
          {Array.from({ length: PITCH_WIDTH }, (_, x) => (
            <View key={x} className="flex-1 flex-row">
              {previewPitch.map((row) => {
                const zone = row[x];
                const player = players.find(
                  (item) => item.id === zone.playerId,
                );
                const hasBall = zone.containsBall;
                const playerColor = homePlayerIds.has(player?.id ?? "")
                  ? "#60a5fa"
                  : "#f87171";

                const cellBackground =
                  player && !hasBall
                    ? playerColor
                    : hasBall
                      ? "#facc15"
                      : zone.homeGoalMouth || zone.awayGoalMouth
                        ? "#d7b98c"
                        : zone.inHomeGoalArea || zone.inAwayGoalArea
                          ? "rgba(255, 255, 255, 0.12)"
                          : zone.inHomePenaltyArea || zone.inAwayPenaltyArea
                            ? "rgba(255, 255, 255, 0.06)"
                            : zone.inCenterCircle
                              ? "rgba(255, 255, 255, 0.1)"
                              : "transparent";

                return (
                  <View
                    key={`${zone.coordinates.x}-${zone.coordinates.y}`}
                    className="flex-1 items-center justify-center"
                    style={{
                      backgroundColor: cellBackground,
                      borderColor: zone.inCenterCircle
                        ? "rgba(255, 255, 255, 0.45)"
                        : "rgba(255, 255, 255, 0.12)",
                      borderWidth: 0.25,
                    }}
                  >
                    {player && !hasBall ? (
                      <Text style={{ fontSize: 8, color: "#0f172a" }}>
                        {player.name.charAt(0).toUpperCase()}
                      </Text>
                    ) : null}
                    {hasBall ? (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          backgroundColor: "#facc15",
                          borderWidth: 1,
                          borderColor: "#7c5a00",
                        }}
                      />
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </Layout>
  );
}
