import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export enum MenuItem {
  Home = "Home",
  MyTeam = "My Team",
  Leagues = "Leagues",
  Matches = "Matches",
}

type MenuProps = {
  activePage?: MenuItem;
  hasLeague: boolean;
  onNavigate?: (page: MenuItem) => void;
  onReset?: () => void;
};

export default function Menu({
  activePage = MenuItem.Home,
  hasLeague,
  onNavigate,
  onReset,
}: MenuProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isCompact = width < 768;
  const menuItems: MenuItem[] = hasLeague
    ? [MenuItem.Home, MenuItem.MyTeam, MenuItem.Leagues, MenuItem.Matches]
    : [MenuItem.Home];

  const menuControls = (
    <View className="flex-row items-center gap-2 py-4">
      {menuItems.map((item) => {
        const isActive = activePage === item;

        return (
          <Pressable
            key={item}
            onPress={() => {
              !isActive && onNavigate?.(item);
            }}
            accessibilityRole="button"
            className={`rounded-lg px-3 py-2 ${
              isActive ? "bg-blue-600" : "bg-transparent"
            }`}
          >
            <Text
              numberOfLines={1}
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
        className="rounded-lg bg-red-600 px-3 py-2"
      >
        <Text className="font-medium text-white">Reset</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      {isCompact ? (
        <>
          <View className="border-b border-slate-700 bg-slate-900 px-4">
            <Text className="text-xl font-bold text-white" numberOfLines={1}>
              Fantasy Fantasy Football
            </Text>
          </View>
          <View
            className="absolute left-0 right-0 z-10 border-t border-slate-700 bg-slate-900 px-2 pt-2"
            style={{ bottom: 0, paddingBottom: insets.bottom }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 8 }}
            >
              {menuControls}
            </ScrollView>
          </View>
        </>
      ) : (
        <View className="flex-row items-center justify-between border-b border-slate-700 bg-slate-900 px-5 py-4">
          <Text className="text-xl font-bold text-white">
            Fantasy Fantasy Football
          </Text>
          {menuControls}
        </View>
      )}
    </>
  );
}
