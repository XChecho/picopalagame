import React, { useEffect, useState } from "react";

import { Platform } from "react-native";

import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { setBackgroundColorAsync } from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

//Helpers
import { queryClient } from "@/core/helper/queryClient";

//React Query
import { QueryClientProvider } from "@tanstack/react-query";

//Components
import ModalManager from "@/presentation/components/modals/ModalManager";
import { initI18n } from "@/presentation/i18n";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    CairoExtraLight: require("../presentation/assets/fonts/Cairo-ExtraLight.ttf"),
    CairoLight: require("../presentation/assets/fonts/Cairo-Light.ttf"),
    CairoRegular: require("../presentation/assets/fonts/Cairo-Regular.ttf"),
    CairoSemiBold: require("../presentation/assets/fonts/Cairo-SemiBold.ttf"),
    CairoBold: require("../presentation/assets/fonts/Cairo-Bold.ttf"),
    CairoBlack: require("../presentation/assets/fonts/Cairo-Black.ttf"),
  });

  useEffect(() => {
    initI18n()
      .then(() => {
        setI18nReady(true);
      })
      .catch(() => {
        setI18nReady(false);
      });
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      setBackgroundColorAsync("#181A2A");
    }
  }, []);

  useEffect(() => {
    if (fontError) throw fontError;
    if (fontsLoaded && i18nReady) SplashScreen.hideAsync();
  }, [fontsLoaded, i18nReady, fontError]);

  if (!fontsLoaded || !i18nReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          paddingTop: 0,
          backgroundColor: "#1A1C22",
        }}
      >
        <SafeAreaProvider>
          {/* <StatusBar  /> */}
          <Slot />
          <ModalManager />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
