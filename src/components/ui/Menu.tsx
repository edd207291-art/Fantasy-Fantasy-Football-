import { Pressable, Text, View } from "react-native";

export enum MenuItem {
  Home = "Home",
  Clubs = "Clubs",
  Matchs = "Matchs",
  Players = "Players",
  Game = "Game",
}

type MenuProps = {
  activePage?: MenuItem;
  onNavigate?: (page: MenuItem) => void;
  onReset?: () => void;
};

export default function Menu({
  activePage = MenuItem.Home,
  onNavigate,
  onReset,
}: MenuProps) {
  const menuItems: MenuItem[] = [
    MenuItem.Home,
    MenuItem.Clubs,
    MenuItem.Matchs,
    MenuItem.Players,
    MenuItem.Game,
  ];

  return (
    <View className="flex-row items-center justify-between border-b border-slate-700 bg-slate-900 px-5 py-4">
      <Text className="text-xl font-bold text-white">
        Fantasy Fantasy Football
      </Text>

      <View className="flex-row items-center gap-2">
        {menuItems.map((item) => {
          const isActive = activePage === item;

          return (
            <Pressable
              key={item}
              onPress={() => onNavigate?.(item)}
              className={`rounded-lg px-4 py-2 ${
                isActive ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-medium ${
                  isActive ? "text-white" : "text-slate-300"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={onReset}
          accessibilityRole="button"
          accessibilityLabel="Clear Redux state"
          className="rounded-lg bg-red-600 px-4 py-2"
        >
          <Text className="font-medium text-white">Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
