import Layout from "@/components/ui/Layout";
import { PageHeading } from "@/components/ui/Typography";
import {
    createPitch,
    PITCH_LENGTH,
    PITCH_WIDTH,
} from "@/scripts/Match/Pitch/createPitch";
import { useState } from "react";
import { Text, View } from "react-native";
import "../global.css";

export default function GameScreen() {
  const [pitch] = useState(createPitch);

  return (
    <Layout>
      <PageHeading className="mb-6">Game</PageHeading>

      <View className="w-full max-w-4xl">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Generated pitch
          </Text>
          <Text className="text-sm text-slate-500">
            {PITCH_WIDTH} x {PITCH_LENGTH} spaces
          </Text>
        </View>

        <View
          className="w-full overflow-hidden rounded-xl border-2 border-white/70 bg-emerald-700"
          style={{ aspectRatio: PITCH_WIDTH / PITCH_LENGTH }}
        >
          {pitch.map((row, y) => (
            <View key={y} className="flex-1 flex-row">
              {row.map((zone) => (
                <View
                  key={`${zone.coordinates.x}-${zone.coordinates.y}`}
                  className="flex-1"
                  style={{
                    backgroundColor:
                      zone.homeGoalMouth || zone.awayGoalMouth
                        ? "#d7b98c"
                        : zone.inHomeGoalArea || zone.inAwayGoalArea
                          ? "rgba(255, 255, 255, 0.12)"
                          : zone.inHomePenaltyArea || zone.inAwayPenaltyArea
                            ? "rgba(255, 255, 255, 0.06)"
                            : zone.inCenterCircle
                              ? "rgba(255, 255, 255, 0.1)"
                              : "transparent",
                    borderColor: zone.inCenterCircle
                      ? "rgba(255, 255, 255, 0.45)"
                      : "rgba(255, 255, 255, 0.12)",
                    borderWidth: 0.25,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </Layout>
  );
}
