import CreateLeaguePage from "@/components/page/CreateLeaguePage";
import HomeLeaguePage from "@/components/page/HomeLeaguePage";
import Layout from "@/components/ui/Layout";
import { useAppSelector } from "@/store/hooks";
import "../global.css";

export default function HomeScreen() {
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const hasLeague = clubs.length > 0;

  return (
    <Layout>{hasLeague ? <HomeLeaguePage /> : <CreateLeaguePage />}</Layout>
  );
}
