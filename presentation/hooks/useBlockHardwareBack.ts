import { useCallback } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";

export function useBlockHardwareBack(enabled: boolean, onBack: () => void) {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return undefined;

      const handler = () => {
        onBack();
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", handler);
      return () => subscription.remove();
    }, [enabled, onBack]),
  );
}
