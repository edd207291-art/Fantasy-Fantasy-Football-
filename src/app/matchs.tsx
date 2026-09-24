import Layout from "@/components/ui/Layout";
import Table from "@/components/ui/Table/Table";
import { ButtonText, MutedText, PageHeading } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import "../global.css";

export default function MatchesScreen() {
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const matches = useAppSelector((state) => state.matches.matches);
  const router = useRouter();

  const clubNames = new Map(clubs.map((club) => [club.id, club.name]));

  return (
    <Layout>
      <PageHeading className="mb-6">Matches</PageHeading>

      <Table
        columns={[
          { key: "home", label: "Home", width: 192 },
          { key: "away", label: "Away", width: 192 },
          { key: "week", label: "Week", width: 64 },
          { key: "winner", label: "Winner", width: 192 },
          { key: "actions", label: "", width: 160 },
        ]}
        data={matches}
        emptyMessage="No matches played yet. Generate clubs to create matches."
        getRowKey={(match) => match.id}
        renderCell={(match, column) =>
          column.key === "actions" ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/matchViewer" as never,
                  params: { matchId: match.id },
                })
              }
              className="rounded bg-blue-600 px-3 py-1"
            >
              <ButtonText className="text-center">View match</ButtonText>
            </Pressable>
          ) : (
            <MutedText>
              {column.key === "home"
                ? (clubNames.get(match.homeClubId) ?? "Unknown club")
                : column.key === "away"
                  ? (clubNames.get(match.awayClubId) ?? "Unknown club")
                  : column.key === "week"
                    ? match.week.toString()
                    : (clubNames.get(match.result?.winnerClubId ?? "") ?? "-")}
            </MutedText>
          )
        }
      />
    </Layout>
  );
}
