import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

interface SearchLoaderProps {
  playerName: string;
  onCancel: () => void;
  estimatedTime?: string;
}

const SearchLoader = ({
  playerName,
  onCancel,
  estimatedTime,
}: SearchLoaderProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background justify-center items-center px-6">
      <View style={styles.gradientCircle}>
        <LinearGradient
          colors={["#84CC16", "#00D2FF"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </LinearGradient>
      </View>

      <Text className="text-white font-CairoBold text-xl mt-6">
        {t("globalRoom.searching")}
      </Text>

      {estimatedTime && (
        <Text className="text-textMuted font-CairoRegular text-sm mt-1">
          {estimatedTime}
        </Text>
      )}

      <View className="flex-row items-center gap-4 mt-8 w-full max-w-sm">
        <View className="flex-1 flex-row items-center bg-surface rounded-xl px-3 py-2">
          <View className="w-8 h-8 rounded-full bg-mainRose justify-center items-center mr-2">
            <Text className="text-white font-CairoBold text-[10px]">{t("globalRoom.you")}</Text>
          </View>
          <Text className="text-white font-CairoSemiBold text-sm">
            {playerName}
          </Text>
        </View>

        <Ionicons name="flash" size={20} color="#FFD600" />

        <View className="flex-1 flex-row items-center bg-surfaceLight/50 rounded-xl px-3 py-2">
          <View className="w-8 h-8 rounded-full bg-border justify-center items-center mr-2">
            <Text className="text-textMuted font-CairoBold text-[10px]">
              ?
            </Text>
          </View>
          <Text className="text-textMuted font-CairoRegular text-sm">
            {t("globalRoom.searching_opp")}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onCancel}
        className="w-full max-w-sm bg-surfaceLight rounded-xl py-3 mt-8 active:opacity-70"
      >
        <Text className="text-textMuted font-CairoSemiBold text-center">
          {t("globalRoom.cancelSearch")}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchLoader;
