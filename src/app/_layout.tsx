import { Redirect, Stack, usePathname } from "expo-router";
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
