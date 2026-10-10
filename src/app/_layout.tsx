import { Redirect, Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/store";
import { useAppSelector } from "@/store/hooks";

function AppNavigator() {
  const pathname = usePathname();
  const seasonComplete = useAppSelector(
    (state) => state.calendar.seasonComplete,
  );

  if (seasonComplete && pathname !== "/seasonSummary") {
    return <Redirect href="/seasonSummary" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
