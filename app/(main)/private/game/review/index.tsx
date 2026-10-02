import React, { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useGameStore } from "@presentation/store/useGameStore";
import GameHeader from "@presentation/components/ui/GameHeader";
import GameReviewBoard from "@presentation/components/ui/GameReviewBoard";
import SecretNumberCard from "@presentation/components/ui/SecretNumberCard";
import type { TGameResult } from "@presentation/components/ui/GameResultView";

const DIFFICULTY_LABELS = {
  EASY: "home.game.easy",
  MEDIUM: "home.game.medium",
  HARD: "home.game.hard",
} as const;

const getResultFromMoves = (moves: { isPlayerMove: boolean; feedback: { isWin: boolean } }[]): TGameResult => {
  const playerWon = moves.some((m) => m.isPlayerMove && m.feedback.isWin);
  const aiWon = moves.some((m) => !m.isPlayerMove && m.feedback.isWin);
  if (playerWon) return "win";
  if (aiWon) return "lose";
  return "draw";
};

const getResultColor = (result: TGameResult): string => {
  if (result === "win") return "text-success";
  if (result === "lose") return "text-error";
  return "text-gold";
};

const getResultIcon = (result: TGameResult): "trophy-outline" | "heart-dislike-outline" | "scale-outline" => {
  if (result === "win") return "trophy-outline";
  if (result === "lose") return "heart-dislike-outline";
  return "scale-outline";
};

export default function ReviewScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { moves, playerNumber, opponentNumber, status, difficulty, roundNumber } = useGameStore();

  useEffect(() => {
    if (status !== "FINISHED" || moves.length === 0) {
      router.back();
    }
  }, [status, moves.length]);

  if (status !== "FINISHED" || moves.length === 0) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-textMuted font-CairoRegular text-base">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  const result = getResultFromMoves(moves);
  const turns = roundNumber - 1;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <GameHeader
        title={t("game.reviewTitle")}
        onBackPress={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Resultado */}
        <View className="items-center py-6">
          <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-3 ${
            result === "win" ? "bg-success" : result === "lose" ? "bg-error" : "bg-gold"
          }`}>
            <Ionicons name={getResultIcon(result)} size={32} color="#FFFFFF" />
          </View>
          <Text className={`text-2xl font-CairoBlack uppercase ${getResultColor(result)}`}>
            {result === "win" ? t("game.win") : result === "lose" ? t("game.lose") : t("game.draw")}
          </Text>
          <Text className="text-textMuted font-CairoRegular text-sm mt-1">
            {t("game.turnsUsed", { turns })}
          </Text>
          {difficulty && (
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("game.difficulty")}: {t(DIFFICULTY_LABELS[difficulty])}
            </Text>
          )}
        </View>

        {/* Números secretos */}
        <View className="px-6 mb-4">
          <SecretNumberCard
            number={playerNumber ?? "----"}
            title={t("game.yourSecretNumber")}
            hint={t("game.secretOnlyYou")}
          />
        </View>

        {opponentNumber && (
          <View className="px-6 mb-6">
            <SecretNumberCard
              number={opponentNumber}
              title={t("game.opponentSecretNumber")}
              hint={t("game.opponentSecretRevealed")}
            />
          </View>
        )}

        {/* Historial de movimientos */}
        <GameReviewBoard
          moves={moves}
          playerSecret={playerNumber ?? ""}
          opponentSecret={opponentNumber ?? ""}
          t={t}
        />

        {/* Botón volver */}
        <View className="px-6 mt-4">
          <Pressable
            onPress={() => router.replace("/private/home")}
            className="w-full h-14 rounded-xl bg-surfaceLight border border-border items-center justify-center active:opacity-80"
          >
            <Text className="text-white font-CairoBold text-base uppercase">
              {t("game.backToMenu")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
