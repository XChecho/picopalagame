import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GameHeader from "@presentation/components/ui/GameHeader";
import NumberPad from "@presentation/components/ui/NumberPad";
import SecretNumberCard from "@presentation/components/ui/SecretNumberCard";
import { useSecretNumberSelection } from "@presentation/hooks/useSecretNumberSelection";
import { useGameStore } from "@presentation/store/useGameStore";
import type { TDifficulty, TGameMode } from "@core/interfaces/IMatch/IMatch";

type Params = {
  mode?: string;
  difficulty?: string;
};

export default function SelectSecretScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Params>();

  const gameMode = (params.mode || "VERSUS_AI") as TGameMode;
  const difficulty = (params.difficulty || "MEDIUM") as TDifficulty;

  const { initGame } = useGameStore();

  const handleComplete = useCallback(
    (secretNumber: string) => {
      if (gameMode === "VERSUS_AI") {
        initGame(gameMode, secretNumber, difficulty);
        router.replace({
          pathname: "/private/game/versus-ai",
          params: { difficulty },
        });
      } else {
        // Para salas online, guardar el secreto y navegar
        initGame(gameMode, secretNumber);
        router.replace({
          pathname: `/private/game/${gameMode === "PRIVATE" ? "private-room" : "global-room"}`,
        });
      }
    },
    [gameMode, difficulty, initGame],
  );

  const handleExpire = useCallback(() => {
    router.back();
  }, []);

  const {
    selectedDigits,
    timeRemaining,
    isExpired,
    handleDigitPress,
    handleBackspace,
    handleSubmit,
    canSubmit,
  } = useSecretNumberSelection({
    onComplete: handleComplete,
    onExpire: handleExpire,
    timeoutSeconds: 30,
  });

  const secretNumber = selectedDigits.join("").padEnd(4, "-");

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <GameHeader title={t("game.selectSecretNumber")} />

      {/* Timer */}
      {!isExpired && (
        <View className="items-center mt-6">
          <Text
            className={`text-4xl font-CairoBold mb-1 ${
              timeRemaining <= 10 ? "text-mainRed" : "text-white"
            }`}
          >
            {timeRemaining}
          </Text>
          <Text className="text-textMuted font-CairoRegular text-sm">
            {t("game.secondsRemaining")}
          </Text>
        </View>
      )}

      {/* Secret Number Card */}
      <SecretNumberCard
        number={secretNumber}
        title={t("game.yourSecretNumber")}
        hint={t("game.secretOnlyYou")}
      />

      {/* Instructions */}
      {!isExpired && (
        <View className="mx-6 mt-4">
          <View className="bg-surface rounded-2xl px-6 py-4">
            <Text className="text-white font-CairoSemiBold text-base text-center mb-2">
              {t("game.secretNumberInstructions")}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs text-center">
              {t("game.secretNumberInstructionsDetail")}
            </Text>
          </View>
        </View>
      )}

      {/* NumberPad */}
      {!isExpired && (
        <View className="flex-1 justify-end">
          <NumberPad
            selectedDigits={selectedDigits}
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            onSubmit={handleSubmit}
            disabled={!canSubmit}
            mode="secret"
          />
        </View>
      )}

      {isExpired && (
        <View className="bg-surface rounded-t-3xl px-6 py-8 items-center border-t border-border/20">
          <Text className="text-mainRed font-CairoBold text-lg mb-2">
            {t("game.timeExpired")}
          </Text>
          <Text className="text-textMuted font-CairoRegular text-sm">
            {t("game.returningToMenu")}
          </Text>
        </View>
      )}
    </View>
  );
}
