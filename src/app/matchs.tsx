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
          { key: "score", label: "Score", width: 64 },
          { key: "winner", label: "Winner", width: 192 },
          { key: "actions", label: "", width: 160 },
        ]}
        data={matches}
        emptyMessage="No matches played yet. Generate clubs to create matches."
        getRowKey={(match) => match.id}
        renderCell={(match, column) => {
          if (column.key === "actions") {
            return (
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
            );
          }

          let cellValue: string;

          switch (column.key) {
            case "home":
              cellValue = clubNames.get(match.homeClubId) ?? "Unknown club";
              break;
            case "away":
              cellValue = clubNames.get(match.awayClubId) ?? "Unknown club";
              break;
            case "week":
              cellValue = match.week.toString();
              break;
            case "score": {
              const score = match.result?.score ?? match.score;
              cellValue = score ? `${score.home} - ${score.away}` : "-";
              break;
            }
            case "winner": {
              if (!match.result) {
                cellValue = "-";
              } else if (match.result.winnerClubId === null) {
                cellValue = "Draw";
              } else {
                cellValue =
                  clubNames.get(match.result.winnerClubId) ?? "Unknown club";
              }
              break;
            }
            default:
              cellValue = "";
          }

          return <MutedText>{cellValue}</MutedText>;
        }}
      />
    </Layout>
  );
}
