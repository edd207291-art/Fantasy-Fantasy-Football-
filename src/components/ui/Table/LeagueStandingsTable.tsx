import Table, { type TableColumn } from "@/components/ui/Table/Table";
import type { LeagueStanding } from "@/scripts/League/getLeagueStandings";
import { Text } from "react-native";

const COLUMNS: TableColumn[] = [
  { key: "rank", label: "#", width: 56 },
  { key: "clubName", label: "Club", width: 200 },
  { key: "played", label: "P", width: 56 },
  { key: "won", label: "W", width: 56 },
  { key: "drawn", label: "D", width: 56 },
  { key: "lost", label: "L", width: 56 },
  { key: "goalsFor", label: "GF", width: 64 },
  { key: "goalsAgainst", label: "GA", width: 64 },
  { key: "goalDifference", label: "GD", width: 64 },
  { key: "points", label: "Pts", width: 64 },
];

type LeagueStandingsTableProps = {
  standings: LeagueStanding[];
  highlightedClubId?: string;
};

export default function LeagueStandingsTable({
  standings,
  highlightedClubId,
}: LeagueStandingsTableProps) {
  return (
    <Table
      columns={COLUMNS}
      data={standings}
      emptyMessage="No clubs in this league yet."
      getRowKey={(standing) => standing.clubId}
      verticalScroll={false}
      renderCell={(standing, column) => {
        const values: Record<string, string | number> = {
          rank: standing.rank,
          clubName: standing.clubName,
          played: standing.played,
          won: standing.won,
          drawn: standing.drawn,
          lost: standing.lost,
          goalsFor: standing.goalsFor,
          goalsAgainst: standing.goalsAgainst,
          goalDifference: standing.goalDifference,
          points: standing.points,
        };
        const isManagerClub = standing.clubId === highlightedClubId;

        return (
          <Text
            numberOfLines={1}
            className={`text-sm ${
              column.key === "points"
                ? "font-bold text-emerald-400"
                : isManagerClub
                  ? "font-semibold text-blue-300"
                  : column.key === "clubName"
                    ? "font-semibold text-slate-100"
                    : "text-slate-300"
            }`}
          >
            {values[column.key]}
          </Text>
        );
      }}
    />
  );
}
