import React, { useEffect, useState } from "react";

import { Platform } from "react-native";

import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { setBackgroundColorAsync } from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as NavigationBar from "expo-navigation-bar";

//Helpers
import { queryClient } from "@/core/helper/queryClient";

//React Query
import { QueryClientProvider } from "@tanstack/react-query";

//Components
import ModalManager from "@/src/components/modals/ModalManager";
import { initI18n } from "@/src/i18n";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    CairoExtraLight: require("../src/assets/fonts/Cairo-ExtraLight.ttf"),
    CairoLight: require("../src/assets/fonts/Cairo-Light.ttf"),
    CairoRegular: require("../src/assets/fonts/Cairo-Regular.ttf"),
    CairoSemiBold: require("../src/assets/fonts/Cairo-SemiBold.ttf"),
    CairoBold: require("../src/assets/fonts/Cairo-Bold.ttf"),
    CairoBlack: require("../src/assets/fonts/Cairo-Black.ttf"),
  });

  useEffect(() => {
    initI18n()
      .then(() => {
        setI18nReady(true);
      })
      .catch((err) => {
        console.error("Error inicializando i18n:", err);
      });
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync("dark");
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
          paddingTop: Platform.OS === "ios" ? 0 : 0,
          backgroundColor: "#fff",
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
