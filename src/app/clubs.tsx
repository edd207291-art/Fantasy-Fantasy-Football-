import Layout from "@/components/ui/Layout";
import Table from "@/components/ui/Table/Table";
import { ButtonText, MutedText, PageHeading } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import "../global.css";

export default function ClubsScreen() {
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const router = useRouter();

  return (
    <Layout>
      <PageHeading className="mb-6">Clubs</PageHeading>
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
              onPress={() =>
                router.push({
                  pathname: "/club/clubOverview",
                  params: { id: club.id },
                })
              }
              className="rounded bg-blue-600 px-3 py-1"
            >
              <ButtonText className="text-center">View players</ButtonText>
            </Pressable>
          ) : (
            <MutedText>
              {column.key === "name" ? club.name : club.playerIds.length}
            </MutedText>
          )
        }
      />
    </Layout>
  );
}
