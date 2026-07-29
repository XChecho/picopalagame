import React, { useCallback } from "react";

import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import GameModeCard from "@/presentation/components/ui/GameModeCard";
import StatsCard from "@/presentation/components/ui/StatsCard";

const GameScreen = () => {
  const { t } = useTranslation();

  const handleVersusAI = useCallback(() => {
    console.log("Start Versus AI");
  }, []);

  const handlePrivateRoom = useCallback(() => {
    console.log("Start Private Room");
  }, []);

  const handleGlobalRoom = useCallback(() => {
    console.log("Start Global Room");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-8">
        {/* Header */}
        <LinearGradient
          colors={["#5A189A", "#9D4EDD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-4 mt-4 rounded-3xl p-6"
        >
          <View className="items-center">
            <Text className="text-white font-CairoBold text-3xl">
              {t("home.game.title")}
            </Text>
            <Text className="text-white/80 font-CairoRegular text-base mt-2 text-center">
              {t("home.game.subtitle")}
            </Text>
          </View>
        </LinearGradient>

        {/* Game Modes */}
        <View className="px-4 mt-6">
          {/* Versus AI - Large Card */}
          <GameModeCard
            title={t("home.game.versusAI")}
            description={t("home.game.descriptionVersusAI")}
            icon="hardware-chip"
            gradientColors={["#5A189A", "#9D4EDD"]}
            onPress={handleVersusAI}
            size="large"
            difficulty={t("home.game.difficulty")}
          />

          {/* Small Cards Row */}
          <View className="flex flex-row">
            {/* Private Room */}
            <View className="flex-1 mr-2">
              <GameModeCard
                title={t("home.game.privateRoom")}
                description={t("home.game.descriptionPrivate")}
                icon="key"
                gradientColors={["#BC005B", "#FF2E95"]}
                onPress={handlePrivateRoom}
                size="small"
              />
            </View>

            {/* Global Room */}
            <View className="flex-1 ml-2">
              <GameModeCard
                title={t("home.game.globalRoom")}
                description={t("home.game.descriptionGlobal")}
                icon="globe"
                gradientColors={["#15803D", "#84CC16"]}
                onPress={handleGlobalRoom}
                size="small"
              />
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-4 mt-6">
          <Text className="text-white font-CairoBold text-xl mb-4">
            {t("home.game.stats")}
          </Text>
          
          <View className="flex flex-row -mx-1">
            <StatsCard
              icon="trophy"
              label={t("home.game.bestScore")}
              value="8/10"
              iconColor="#FFD600"
            />
            <StatsCard
              icon="flame"
              label={t("home.game.streak")}
              value="5"
              iconColor="#FF5959"
            />
          </View>
          
          <View className="flex flex-row -mx-1 mt-2">
            <StatsCard
              icon="time"
              label={t("home.game.avgTime")}
              value="2m"
              iconColor="#00D2FF"
            />
            <StatsCard
              icon="game-controller"
              label={t("home.game.gamesPlayed")}
              value="42"
              iconColor="#9D4EDD"
            />
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameScreen;
