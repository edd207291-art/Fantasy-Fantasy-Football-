import Menu, { MenuItem } from "@/components/ui/Menu";
import { resetStore } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "expo-router";
import { ScrollView, View, useWindowDimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const hasLeague = useAppSelector((state) => state.clubs.clubs.length > 0);
  const isSeasonSummary = pathname === "/seasonSummary";
  const { width } = useWindowDimensions();
  const hasBottomMenu = width < 768 && !isSeasonSummary;

  let activePage: MenuItem | undefined;

  switch (pathname) {
    case "/":
      activePage = MenuItem.Home;
      break;
    case "/myTeam":
      activePage = MenuItem.MyTeam;
      break;
    case "/leagues":
      activePage = MenuItem.Leagues;
      break;
    case "/matchs":
      activePage = MenuItem.Matches;
      break;
  }

  const handleNavigate = (page: MenuItem) => {
    switch (page) {
      case MenuItem.Matches:
        router.push("/matchs");
        break;
      case MenuItem.Home:
        router.push("/");
        break;
      case MenuItem.MyTeam:
        router.push("/myTeam");
        break;
      case MenuItem.Leagues:
        router.push("/leagues");
        break;
    }
  };

  const handleReset = () => {
    dispatch(resetStore());
    router.push("/");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-950"
      edges={["top", "left", "right"]}
    >
      {isSeasonSummary ? null : (
        <Menu
          activePage={activePage}
          hasLeague={hasLeague}
          onNavigate={handleNavigate}
          onReset={handleReset}
        />
      )}

      <ScrollView
        className="flex-1 px-4 sm:px-6"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: (hasBottomMenu ? 80 : 0) + insets.bottom,
        }}
        showsVerticalScrollIndicator={true}
      >
        <View className="w-full items-center">{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
