import Layout from "@/components/ui/Layout";
import { Spinner } from "@/components/ui/Spinner";
import { BodyText, MutedText, PageHeading } from "@/components/ui/Typography";
import { initializeLeague } from "@/scripts/initzlizeLeague";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playCurrentWeek } from "@/store/matchesSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { season, week } = useAppSelector((state) => state.calendar);
  const hasLeague = useAppSelector((state) => state.clubs.clubs.length > 0);
  const matches = useAppSelector((state) => state.matches.matches);
  const { loadingText, loadingSubtext } = useAppSelector(
    (state) => state.manager,
  );
  const [isPlayingWeek, setIsPlayingWeek] = useState(false);

  const handlePlayCurrentWeek = async () => {
    const seasonMatches = matches.filter((match) => match.season === season);
    const finalWeek = Math.max(0, ...seasonMatches.map((match) => match.week));
    const isFinalWeek = seasonMatches.length > 0 && week >= finalWeek;

    setIsPlayingWeek(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 50));

    try {
      await dispatch(playCurrentWeek());
      if (isFinalWeek) {
        router.replace("/seasonSummary");
      }
    } finally {
      setIsPlayingWeek(false);
    }
  };

  return (
    <>
      <Layout>
        {hasLeague ? (
          <>
            <PageHeading className="mb-2">Home Page</PageHeading>
            <BodyText className="mb-4">
              Season {season} - Current Week {week}
            </BodyText>
            <TouchableOpacity
              onPress={handlePlayCurrentWeek}
              disabled={isPlayingWeek}
              className={`rounded bg-blue-600 px-5 py-3 ${
                isPlayingWeek ? "opacity-70" : ""
              }`}
            >
              <MutedText className="text-center font-semibold text-white">
                {isPlayingWeek
                  ? "Playing matches..."
                  : "Play This Weeks Matches"}
              </MutedText>
            </TouchableOpacity>
          </>
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
      <Spinner
        visible={isPlayingWeek}
        mainText={loadingText ?? "Playing matches..."}
        subText={loadingSubtext ?? `Simulating week ${week}`}
      />
    </>
  );
}
