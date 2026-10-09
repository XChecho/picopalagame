import { useEffect } from "react";
import { Stack } from "expo-router";

import { useAuthStore } from "@presentation/store/useAuthStore";
import { syncOfflineStatsQueue } from "@core/utils/offlineStatsQueue";

export default function PrivateLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Flush matches played while offline or logged out.
  useEffect(() => {
    if (isAuthenticated) void syncOfflineStatsQueue();
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home/index" />
      <Stack.Screen name="game/index" />
      <Stack.Screen name="game/select-secret/index" />
      <Stack.Screen name="game/versus-ai/index" />
      <Stack.Screen name="game/online-match/index" />
      <Stack.Screen name="game/review/index" />
      <Stack.Screen name="game/private-room/index" />
      <Stack.Screen name="game/global-room/index" />
      <Stack.Screen name="record/index" />
      <Stack.Screen name="config/index" />
      <Stack.Screen name="profile/index" />
    </Stack>
  );
}
