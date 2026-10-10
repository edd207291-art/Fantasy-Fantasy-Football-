import Table, { type TableColumn } from "@/components/ui/Table/Table";
import type { LeagueStanding } from "@/scripts/League/getLeagueStandings";
import { useRouter } from "expo-router";
import { Text } from "react-native";

const COLUMNS: TableColumn[] = [
  { key: "rank", label: "#", width: 25 },
  { key: "clubName", label: "Club", width: 120 },
  { key: "played", label: "P", width: 25 },
  { key: "won", label: "W", width: 25 },
  { key: "drawn", label: "D", width: 25 },
  { key: "lost", label: "L", width: 25 },
  { key: "goalDifference", label: "GD", width: 25 },
  { key: "points", label: "Pts", width: 25 },
];

type LeagueStandingsTableProps = {
  standings: LeagueStanding[];
  highlightedClubId?: string;
};

export default function LeagueStandingsTable({
  standings,
  highlightedClubId,
}: LeagueStandingsTableProps) {
  const router = useRouter();

  return (
    <Table
      columns={COLUMNS}
      data={standings}
      emptyMessage="No clubs in this league yet."
      getRowKey={(standing) => standing.clubId}
      onRowPress={(standing) =>
        router.push({
          pathname: "/club/clubOverview",
          params: { id: standing.clubId },
        })
      }
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
