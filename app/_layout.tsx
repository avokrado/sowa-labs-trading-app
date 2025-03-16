import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { store } from "@/store";
import { wsService } from "@/services/websocket";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    wsService.connect();

    // Cleanup WebSocket connection when component unmounts
    return () => {
      wsService.disconnect();
    };
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ header: () => <Header /> }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </Provider>
  );
}
