import Menu, { MenuItem } from "@/components/ui/Menu";
import { usePathname, useRouter } from "expo-router";
import { View } from "react-native";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-slate-950">
      <Menu activePage={activePage} onNavigate={handleNavigate} />

      <View className="flex-1 items-center justify-center px-6">
        {children}
      </View>
    </View>
  );
}
