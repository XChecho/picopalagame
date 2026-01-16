import React, { useEffect } from 'react';

import { Platform } from 'react-native';

import { Slot, SplashScreen } from 'expo-router';
import { setBackgroundColorAsync, } from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as NavigationBar from 'expo-navigation-bar';

//Helpers
import { queryClient } from '@/core/helper/queryClient';

//React Query
import { QueryClientProvider } from '@tanstack/react-query';

//Components
import ModalManager from '@/src/components/modals/ModalManager';

import './global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
      setBackgroundColorAsync('#181A2A');
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 0, backgroundColor: '#fff' }}>
        <SafeAreaProvider>
          {/* <StatusBar  /> */}
          <Slot />
          <ModalManager />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}