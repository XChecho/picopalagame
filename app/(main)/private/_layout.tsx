import { Stack } from "expo-router";

export default function PrivateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home/index" />
      <Stack.Screen name="game/index" />
      <Stack.Screen name="game/select-secret/index" />
      <Stack.Screen name="game/versus-ai/index" />
      <Stack.Screen name="game/review/index" />
      <Stack.Screen name="game/private-room/index" />
      <Stack.Screen name="game/global-room/index" />
      <Stack.Screen name="record/index" />
      <Stack.Screen name="config/index" />
      <Stack.Screen name="profile/index" />
    </Stack>
  );
}
