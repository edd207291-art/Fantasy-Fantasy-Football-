import Layout from "@/components/ui/Layout";
import PlayersTable from "@/components/ui/Table/PlayersTable";
import { PageHeading } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import "../global.css";

export default function PlayersScreen() {
  const players = useAppSelector((state) => state.players.players);

  return (
    <Layout>
      <PageHeading className="mb-6">Players</PageHeading>

      <PlayersTable players={players} />
    </Layout>
  );
}
