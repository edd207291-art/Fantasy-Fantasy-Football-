import ClubPlayersModal from "@/components/ui/ClubPlayersModal";
import Layout from "@/components/ui/Layout";
import Table from "@/components/ui/Table";
import { getPlayersInClub } from "@/store/clubsSlice";
import { useAppSelector } from "@/store/hooks";
import { Club } from "@/types/club";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import "../global.css";

export default function ClubsScreen() {
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const selectedClubPlayers = useAppSelector((state) =>
    selectedClub ? getPlayersInClub(state, selectedClub.id) : [],
  );

  return (
    <Layout>
      <View className="w-full max-w-3xl">
        <Text className="mb-6 text-3xl font-bold text-white">Clubs</Text>

        <Table
          columns={[
            { key: "name", label: "Club", width: 256 },
            { key: "players", label: "Players", width: 128 },
            { key: "actions", label: "", width: 160 },
          ]}
          data={clubs}
          getRowKey={(club, index) => `${club.name}-${index}`}
          renderCell={(club, column) =>
            column.key === "actions" ? (
              <Pressable
                onPress={() => setSelectedClub(club)}
                className="rounded bg-blue-600 px-3 py-1"
              >
                <Text className="text-center text-sm font-medium text-white">
                  View players
                </Text>
              </Pressable>
            ) : (
              <Text className="text-base text-slate-400">
                {column.key === "name" ? club.name : club.playerIds.length}
              </Text>
            )
          }
        />
      </View>

      <ClubPlayersModal
        club={selectedClub}
        players={selectedClubPlayers}
        onClose={() => setSelectedClub(null)}
      />
    </Layout>
  );
}
