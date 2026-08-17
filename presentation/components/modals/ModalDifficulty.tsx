import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TDifficulty } from "@core/interfaces/IMatch/IMatch";
import { useModalStore } from "@/presentation/store/useModalStore";

type DifficultyTitleKey =
  | "home.game.easy"
  | "home.game.medium"
  | "home.game.hard";

type DifficultyDescriptionKey =
  | "home.descriptionEasy"
  | "home.descriptionMedium"
  | "home.descriptionHard";

const DIFFICULTY_OPTIONS: Array<{
  value: TDifficulty;
  titleKey: DifficultyTitleKey;
  descriptionKey: DifficultyDescriptionKey;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  colors: [string, string];
}> = [
  {
    value: "EASY",
    titleKey: "home.game.easy",
    descriptionKey: "home.descriptionEasy",
    icon: "leaf-outline",
    colors: ["#00D2FF", "#15803D"],
  },
  {
    value: "MEDIUM",
    titleKey: "home.game.medium",
    descriptionKey: "home.descriptionMedium",
    icon: "flash-outline",
    colors: ["#9D4EDD", "#00D2FF"],
  },
  {
    value: "HARD",
    titleKey: "home.game.hard",
    descriptionKey: "home.descriptionHard",
    icon: "flame-outline",
    colors: ["#FF5959", "#FF2E95"],
  },
];

export default function ModalDifficulty() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { viewModalDifficulty, closeModalDifficulty } = useModalStore();

  const handleSelectDifficulty = (difficulty: TDifficulty) => {
    closeModalDifficulty();
    router.push({
      pathname: "/private/game/select-secret",
      params: { mode: "VERSUS_AI", difficulty },
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={viewModalDifficulty}
      onRequestClose={closeModalDifficulty}
    >
      <Pressable
        onPress={closeModalDifficulty}
        className="flex-1 items-center justify-center px-4 bg-darkPurple/50"
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="bg-modalSurface w-full max-w-[420px] rounded-[40px] border-2 border-border py-8 px-6"
        >
          <View className="items-center mb-6">
            <Text className="text-white font-CairoSemiBold text-3xl text-center leading-[38px]">
              {t("home.titleModalDifficulty")}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-base text-center mt-1">
              {t("home.subtitleModalDifficulty")}
            </Text>
          </View>

          <View className="gap-3">
            {DIFFICULTY_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelectDifficulty(option.value)}
                accessibilityRole="button"
                accessibilityLabel={t(option.titleKey)}
                className="h-[88px] rounded-2xl overflow-hidden active:opacity-85"
              >
                <LinearGradient
                  colors={option.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <View className="w-12 h-12 rounded-2xl bg-white/20 justify-center items-center mr-4">
                    <Ionicons name={option.icon} size={26} color="#FFFFFF" />
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-white font-CairoBold text-xl">
                      {t(option.titleKey)}
                    </Text>
                    <Text className="text-white/85 font-CairoRegular text-sm">
                      {t(option.descriptionKey)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={closeModalDifficulty}
            accessibilityRole="button"
            className="items-center mt-5 py-2 active:opacity-70"
          >
            <Text className="text-textMuted font-CairoSemiBold text-base">
              {t("common.cancel")}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
