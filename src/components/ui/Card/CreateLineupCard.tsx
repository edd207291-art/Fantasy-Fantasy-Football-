import Card from "@/components/ui/Card/Card";
import {
    BodyText,
    Heading,
    SectionLabel,
    Subheading,
} from "@/components/ui/Typography";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { saveManagerLineup } from "@/store/managerSlice";
import {
    LINEUP_FORMATIONS,
    type LineupFormation,
    type ManagerLineup,
} from "@/types/lineup";
import type { Player } from "@/types/player";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Dropdown from "../Dropdown";

type Selection = {
  goalkeeper: string[];
  defenders: string[];
  midfielders: string[];
  forwards: string[];
};

type SelectionKey = keyof Selection;

const SECTIONS: {
  key: SelectionKey;
  label: string;
}[] = [
  { key: "goalkeeper", label: "Goalkeeper" },
  { key: "defenders", label: "Defenders" },
  { key: "midfielders", label: "Midfielders" },
  { key: "forwards", label: "Forwards" },
];

const FORMATIONS = Object.keys(LINEUP_FORMATIONS) as LineupFormation[];

const getInitialSelection = (
  players: Player[],
  lineup?: ManagerLineup,
  formation: LineupFormation = lineup?.formation ?? "4-3-3",
): Selection => {
  const availableIds = new Set(players.map((player) => player.id));
  const usedIds = new Set<string>();
  const slots = LINEUP_FORMATIONS[formation];
  const restoreSelection = (playerIds: string[], count: number) =>
    Array.from({ length: count }, (_, index) => {
      const playerId = playerIds[index];

      if (!playerId || !availableIds.has(playerId) || usedIds.has(playerId)) {
        return "";
      }

      usedIds.add(playerId);
      return playerId;
    });

  return {
    goalkeeper: restoreSelection(
      lineup ? [lineup.goalkeeperId] : [],
      slots.goalkeeper,
    ),
    defenders: restoreSelection(lineup?.defendersIds ?? [], slots.defenders),
    midfielders: restoreSelection(
      lineup?.midfieldersIds ?? [],
      slots.midfielders,
    ),
    forwards: restoreSelection(lineup?.forwardsIds ?? [], slots.forwards),
  };
};

export default function CreateLineupCard({ players }: { players: Player[] }) {
  const dispatch = useAppDispatch();
  const savedLineup = useAppSelector((state) => state.manager.lineup);
  const [formation, setFormation] = useState<LineupFormation>(
    () => savedLineup?.formation ?? "4-3-3",
  );
  const [selection, setSelection] = useState<Selection>(() =>
    getInitialSelection(players, savedLineup, formation),
  );

  const selectedCount = SECTIONS.reduce(
    (count, section) => count + selection[section.key].filter(Boolean).length,
    0,
  );
  const totalSlots = SECTIONS.reduce(
    (count, section) => count + LINEUP_FORMATIONS[formation][section.key],
    0,
  );
  const selectedIds = SECTIONS.flatMap((section) =>
    selection[section.key].filter(Boolean),
  );
  const lineupIsComplete =
    SECTIONS.every(
      (section) =>
        selection[section.key].length ===
          LINEUP_FORMATIONS[formation][section.key] &&
        selection[section.key].every(Boolean),
    ) && new Set(selectedIds).size === totalSlots;

  const changeFormation = (nextFormation: LineupFormation) => {
    setFormation(nextFormation);
    setSelection((current) => {
      const resizeSelection = (key: SelectionKey) =>
        Array.from(
          { length: LINEUP_FORMATIONS[nextFormation][key] },
          (_, index) => current[key][index] ?? "",
        );

      return {
        goalkeeper: resizeSelection("goalkeeper"),
        defenders: resizeSelection("defenders"),
        midfielders: resizeSelection("midfielders"),
        forwards: resizeSelection("forwards"),
      };
    });
  };

  const setPlayerInSlot = (
    section: SelectionKey,
    slotIndex: number,
    playerId: string,
  ) => {
    setSelection((current) => ({
      ...current,
      [section]: current[section].map((selectedId, index) =>
        index === slotIndex ? playerId : selectedId,
      ),
    }));
  };

  const saveLineup = () => {
    const [goalkeeperId] = selection.goalkeeper;
    if (!lineupIsComplete || !goalkeeperId) {
      return;
    }

    dispatch(
      saveManagerLineup({
        formation,
        goalkeeperId,
        defendersIds: selection.defenders,
        midfieldersIds: selection.midfielders,
        forwardsIds: selection.forwards,
      }),
    );
  };

  return (
    <Card>
      <View className="mb-5">
        <Heading>Create lineup</Heading>
        <Subheading>
          {selectedCount}/{totalSlots} selected
          {savedLineup ? " · saved lineup loaded" : ""}
        </Subheading>
      </View>

      <View className="mb-5">
        <SectionLabel>Formation</SectionLabel>
        <View className="flex-row flex-wrap gap-2">
          {FORMATIONS.map((option) => {
            const isSelected = formation === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => changeFormation(option)}
                className={`rounded-md border px-4 py-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-600"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-5">
        {SECTIONS.map((section) => {
          const slotCount = LINEUP_FORMATIONS[formation][section.key];

          return (
            <View key={section.key}>
              <SectionLabel>
                {section.label} ({selection[section.key].filter(Boolean).length}
                /{slotCount})
              </SectionLabel>
              <View className="gap-2">
                {Array.from({ length: slotCount }, (_, slotIndex) => {
                  const selectedPlayerId =
                    selection[section.key][slotIndex] ?? "";
                  const selectedElsewhere = new Set(
                    SECTIONS.flatMap((candidateSection) =>
                      selection[candidateSection.key].filter(
                        (playerId, index) =>
                          playerId !== "" &&
                          (candidateSection.key !== section.key ||
                            index !== slotIndex),
                      ),
                    ),
                  );
                  const availablePlayers = players.filter(
                    (player) =>
                      !selectedElsewhere.has(player.id) ||
                      player.id === selectedPlayerId,
                  );
                  const playerOptions = availablePlayers.map((player) => ({
                    label: player.name,
                    value: player.id,
                  }));

                  return (
                    <Dropdown<string>
                      key={`${section.key}-${slotIndex}`}
                      options={playerOptions}
                      selectedValue={selectedPlayerId}
                      onChange={(playerId) =>
                        setPlayerInSlot(section.key, slotIndex, playerId)
                      }
                    />
                  );
                })}
                {players.length === 0 ? (
                  <BodyText>No players available.</BodyText>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !lineupIsComplete }}
        disabled={!lineupIsComplete}
        onPress={saveLineup}
        className={`mt-6 items-center rounded-md px-4 py-3 ${
          lineupIsComplete ? "bg-emerald-700" : "bg-slate-700 opacity-60"
        }`}
      >
        <Text className="font-semibold text-white">Save lineup</Text>
      </Pressable>
    </Card>
  );
}
