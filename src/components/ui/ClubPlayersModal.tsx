import Table from "@/components/ui/Table";
import { Club } from "@/types/club";
import { Player } from "@/types/player";
import { Modal, Pressable, Text, View } from "react-native";

type ClubPlayersModalProps = {
  club: Club | null;
  players: Player[];
  onClose: () => void;
};

export default function ClubPlayersModal({
  club,
  players,
  onClose,
}: ClubPlayersModalProps) {
  return (
    <Modal
      visible={club !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="max-h-[80%] w-full max-w-xl rounded-lg bg-slate-900 p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">
              {club?.name} players
            </Text>
            <Pressable
              onPress={onClose}
              className="rounded bg-slate-700 px-3 py-2"
            >
              <Text className="font-medium text-white">Close</Text>
            </Pressable>
          </View>

          <Table
            columns={[
              { key: "name", label: "Name", width: 192 },
              { key: "position", label: "Position", width: 144 },
              { key: "rating", label: "Rating", width: 96 },
            ]}
            data={players}
            getRowKey={(player: Player) => player.id}
            renderCell={(player: Player, column: { key: string }) => (
              <Text className="text-base text-slate-400">
                {column.key === "name"
                  ? player.name
                  : column.key === "position"
                    ? player.position
                    : player.rating}
              </Text>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
