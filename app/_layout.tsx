import React from 'react';

import { Platform } from 'react-native';

import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//Helpers
import { queryClient } from '@/core/helper/queryClient';

//React Query
import { QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 0, backgroundColor: '#001730' }}>
        <SafeAreaProvider>
          {/* <StatusBar  /> */}
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}