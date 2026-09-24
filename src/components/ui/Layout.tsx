import Menu, { MenuItem } from "@/components/ui/Menu";
import { resetStore } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { usePathname, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  let activePage: MenuItem | undefined;

  switch (pathname) {
    case "/":
      activePage = MenuItem.Home;
      break;
    case "/clubs":
      activePage = MenuItem.Clubs;
      break;
    case "/matchs":
      activePage = MenuItem.Matchs;
      break;
    case "/players":
      activePage = MenuItem.Players;
      break;
  }

  const handleNavigate = (page: MenuItem) => {
    switch (page) {
      case MenuItem.Clubs:
        router.push("/clubs");
        break;
      case MenuItem.Matchs:
        router.push("/matchs");
        break;
      case MenuItem.Players:
        router.push("/players");
        break;
      case MenuItem.Home:
        router.push("/");
        break;
    }
  };

  const handleReset = () => {
    dispatch(resetStore());
  };

  return (
    <View className="flex-1 bg-slate-950">
      <Menu
        activePage={activePage}
        onNavigate={handleNavigate}
        onReset={handleReset}
      />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View className="w-full items-center">{children}</View>
      </ScrollView>
    </View>
  );
}
