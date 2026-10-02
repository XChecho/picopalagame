import React from "react";

import { Modal, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TDifficulty } from "@core/interfaces/IMatch/IMatch";
import { useModalStore } from "@/presentation/store/useModalStore";
import DifficultyCard from "@/presentation/components/ui/DifficultyCard";

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
  leftColor: string;
  gradientColors: [string, string];
}> = [
  {
    value: "EASY",
    titleKey: "home.game.easy",
    descriptionKey: "home.descriptionEasy",
    icon: "leaf-outline",
    leftColor: "#15803D",
    gradientColors: ["#15803D", "#00D2FF"],
  },
  {
    value: "MEDIUM",
    titleKey: "home.game.medium",
    descriptionKey: "home.descriptionMedium",
    icon: "flash-outline",
    leftColor: "#5A189A",
    gradientColors: ["#5A189A", "#00D2FF"],
  },
  {
    value: "HARD",
    titleKey: "home.game.hard",
    descriptionKey: "home.descriptionHard",
    icon: "flame-outline",
    leftColor: "#BC005B",
    gradientColors: ["#BC005B", "#FF5959"],
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

          <View className="gap-0">
            {DIFFICULTY_OPTIONS.map((option) => (
              <DifficultyCard
                key={option.value}
                title={t(option.titleKey)}
                description={t(option.descriptionKey)}
                icon={option.icon}
                leftColor={option.leftColor}
                gradientColors={option.gradientColors}
                onPress={() => handleSelectDifficulty(option.value)}
              />
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
