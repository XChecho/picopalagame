import React, { useCallback, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GameHeader from "@presentation/components/ui/GameHeader";
import NumberPad from "@presentation/components/ui/NumberPad";
import SecretNumberCard from "@presentation/components/ui/SecretNumberCard";
import { useSecretNumberSelection } from "@presentation/hooks/useSecretNumberSelection";
import { useMatch, useSetMatchSecret } from "@presentation/hooks/useMatch";
import { useGameStore } from "@presentation/store/useGameStore";
import type { TDifficulty, TGameMode } from "@core/interfaces/IMatch/IMatch";

type Params = {
  mode?: string;
  difficulty?: string;
  matchId?: string;
};

const MATCH_POLL_MS = 1500;

export default function SelectSecretScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Params>();

  const gameMode = (params.mode || "VERSUS_AI") as TGameMode;
  const difficulty = (params.difficulty || "MEDIUM") as TDifficulty;
  const matchId = params.matchId ?? "";
  // Online private match: the server owns the clock and the secret.
  const isOnline = gameMode === "PRIVATE" && matchId !== "";

  const { initGame } = useGameStore();
  const matchQuery = useMatch(isOnline ? matchId : "", {
    refetchInterval: isOnline ? MATCH_POLL_MS : false,
  });
  const setSecretMutation = useSetMatchSecret();

  const match = matchQuery.data;
  const mySecret =
    match?.mySeat === 1
      ? match.player1Number
      : match?.mySeat === 2
        ? match.player2Number
        : undefined;
  const hasSentSecret = Boolean(mySecret) || setSecretMutation.isSuccess;
  const matchStarted = match?.status === "PLAYING";
  const deadlineAt = match?.turnDeadlineAt
    ? Date.parse(match.turnDeadlineAt)
    : undefined;

  // Both secrets are in: the server started the match.
  useEffect(() => {
    if (isOnline && matchStarted) {
      router.replace({
        pathname: "/private/game/online-match",
        params: { matchId },
      });
    }
  }, [isOnline, matchStarted, matchId]);

  const leaveRoom = useCallback(() => {
    router.replace("/private/home");
  }, []);

  // Rival left or the room died before the match started.
  useEffect(() => {
    if (!isOnline || !match) return;
    if (match.status === "FINISHED" || match.status === "CANCELLED") {
      Alert.alert(t("common.error"), t("privateRoom.matchCancelled"));
      leaveRoom();
    }
  }, [isOnline, match, leaveRoom, t]);

  const sendSecret = useCallback(
    (payload: { secret?: string; random?: boolean }) => {
      setSecretMutation.mutate(
        { matchId, ...payload },
        {
          onError: () => {
            Alert.alert(t("common.error"), t("errors.generic"));
          },
        },
      );
    },
    [matchId, setSecretMutation, t],
  );

  const handleComplete = useCallback(
    (secretNumber: string) => {
      if (isOnline) {
        sendSecret({ secret: secretNumber });
      } else if (gameMode === "VERSUS_AI") {
        initGame(gameMode, secretNumber, difficulty);
        router.replace({
          pathname: "/private/game/versus-ai",
          params: { difficulty },
        });
      } else {
        // Salas globales: el servidor asigna los secretos.
        initGame(gameMode, secretNumber);
        router.replace({ pathname: "/private/game/global-room" });
      }
    },
    [isOnline, gameMode, difficulty, initGame, sendSecret],
  );

  const handleExpire = useCallback(() => {
    // Online: the server assigns a random secret and starts the match.
    if (!isOnline) router.back();
  }, [isOnline]);

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
    deadlineAt: isOnline ? deadlineAt : undefined,
  });

  const secretNumber = (
    hasSentSecret && mySecret ? mySecret : selectedDigits.join("")
  ).padEnd(4, "-");
  const isPicking = !isExpired && !hasSentSecret && !matchStarted;
  // Online with the clock still unknown: nothing to pick against yet.
  const isLoadingOnline = isOnline && !match;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <GameHeader title={t("game.selectSecretNumber")} />

      {/* Timer */}
      {isPicking && !isLoadingOnline && (
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
      {isPicking && (
        <View className="mx-6 mt-4">
          <View className="bg-surface rounded-2xl px-6 py-4">
            <Text className="text-white font-CairoSemiBold text-base text-center mb-2">
              {t("game.secretNumberInstructions")}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs text-center">
              {t("game.secretNumberInstructionsDetail")}
            </Text>
          </View>

          {isOnline && (
            <Pressable
              onPress={() => sendSecret({ random: true })}
              disabled={setSecretMutation.isPending}
              className="mt-3 py-3 rounded-xl items-center border border-border/40 active:opacity-70"
            >
              <Text className="text-white font-CairoSemiBold text-base">
                {t("privateRoom.randomSecret")}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Waiting states (online) */}
      {isOnline && !isPicking && (
        <View className="bg-surface rounded-3xl mx-6 mt-4 px-6 py-6 items-center">
          <Text
            className={`font-CairoBold text-lg text-center ${
              matchStarted ? "text-success" : "text-white"
            }`}
          >
            {matchStarted
              ? t("privateRoom.matchReady")
              : hasSentSecret
                ? t("privateRoom.waitingOpponentSecret")
                : t("privateRoom.assigningRandom")}
          </Text>
          {hasSentSecret && !matchStarted && (
            <Text className="text-textMuted font-CairoRegular text-sm mt-1">
              {t("privateRoom.secretLocked")}
            </Text>
          )}
        </View>
      )}

      {/* NumberPad */}
      {isPicking && !isLoadingOnline && (
        <View className="flex-1 justify-end">
          <NumberPad
            selectedDigits={selectedDigits}
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            onSubmit={handleSubmit}
            disabled={!canSubmit || setSecretMutation.isPending}
            mode="secret"
            hideDisplay
          />
        </View>
      )}

      {isExpired && !isOnline && (
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
