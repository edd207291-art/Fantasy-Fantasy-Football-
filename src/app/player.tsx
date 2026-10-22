import { EventsCard } from "@/components/ui/Card/EventsCard";
import Layout from "@/components/ui/Layout";
import { useAppSelector } from "@/store/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function PlayerPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const player = useAppSelector((state) =>
    state.players.players.find((candidate) => candidate.id === id),
  );

  return (
    <Layout>
      <View className="w-full max-w-4xl flex-1 py-8">
        <View className="mb-6 flex-row items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <View className="flex-1">
            <Text className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Player profile
            </Text>
            <Text className="mt-2 text-3xl font-bold text-white">
              {player?.name ?? "Player not found"}
            </Text>
            {player ? (
              <Text className="mt-2 text-base text-slate-400">
                {player.positionPreference}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => router.back()}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 active:bg-slate-700"
          >
            <Text className="font-semibold text-slate-200">Back</Text>
          </Pressable>
        </View>

        {player ? (
          <>
            <View className="mb-6 flex-row flex-wrap gap-3">
              {Object.entries(player.attributes).map(([key, value]) => (
                <View
                  key={key}
                  className="min-w-[140px] flex-1 border-b border-slate-800 py-4"
                >
                  <Text className="text-sm text-slate-400">{key}</Text>
                  <Text className="mt-1 text-2xl font-bold text-white">
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            <EventsCard playerId={player.id} />
          </>
        ) : (
          <Text className="text-base text-slate-400">
            This player could not be found.
          </Text>
        )}
      </View>
    </Layout>
  );
}
