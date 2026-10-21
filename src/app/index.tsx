import HomeLeaguePage from "@/components/page/HomeLeaguePage";
import Layout from "@/components/ui/Layout";
import { MutedText, PageHeading } from "@/components/ui/Typography";
import { initializeLeague } from "@/scripts/initzlizeLeague";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { TouchableOpacity } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const clubs = useAppSelector((state) => state.clubs.clubs);
  const hasLeague = clubs.length > 0;

  return (
    <Layout>
      {hasLeague ? (
        <HomeLeaguePage />
      ) : (
        <>
          <PageHeading className="mb-2">Create Your League</PageHeading>
          <TouchableOpacity
            onPress={() => dispatch(initializeLeague())}
            className="items-center rounded bg-blue-600 px-5 py-3"
          >
            <MutedText className="font-semibold text-white">
              Create League
            </MutedText>
          </TouchableOpacity>
        </>
      )}
    </Layout>
  );
}
