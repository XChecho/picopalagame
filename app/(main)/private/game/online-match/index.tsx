import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";

import GameBoard from "@presentation/components/ui/GameBoard";
import GameHeader from "@presentation/components/ui/GameHeader";
import GameResultView, {
  type TGameResult,
} from "@presentation/components/ui/GameResultView";
import GameStatusBar from "@presentation/components/ui/GameStatusBar";
import NumberPad from "@presentation/components/ui/NumberPad";
import SecretNumberCard from "@presentation/components/ui/SecretNumberCard";
import { useBlockHardwareBack } from "@presentation/hooks/useBlockHardwareBack";
import {
  useForfeitMatch,
  useMatch,
  useSubmitMove,
} from "@presentation/hooks/useMatch";
import { useMatchSocket } from "@presentation/hooks/useMatchSocket";
import { useRoomStore } from "@presentation/store/useRoomStore";
import { validateGuess } from "@core/utils/gameLogic";
import type { ILocalMove } from "@core/interfaces/IGame/IGame";
import type { IOnlineMove } from "@core/interfaces/IMove/IMove";
import type { TMatchResult } from "@core/interfaces/IMatch/IMatch";

type Params = { matchId?: string };

// Safety net in case a socket event is missed.
const SAFETY_POLL_MS = 5000;
const CLOCK_TICK_MS = 250;

const RESULT_MAP: Record<TMatchResult, TGameResult> = {
  WIN: "win",
  LOSS: "lose",
  DRAW: "draw",
};

const GUESS_ERRORS = {
  INVALID_LENGTH: "game.invalidLength",
  INVALID_DIGITS: "game.invalidDigits",
  REPEATED_DIGITS: "game.repeatedDigits",
} as const;

export default function OnlineMatchScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<Params>();
  const storedMatchId = useRoomStore((state) => state.matchId);
  const matchId = params.matchId ?? storedMatchId ?? "";

  const matchQuery = useMatch(matchId, { refetchInterval: SAFETY_POLL_MS });
  const submitMove = useSubmitMove();
  const forfeit = useForfeitMatch();
  const match = matchQuery.data;

  const [selectedDigits, setSelectedDigits] = useState<number[]>([]);
  const [isPadVisible, setIsPadVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const refetchMatch = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["match", matchId] });
  }, [queryClient, matchId]);

  const { isConnected, opponentOnline } = useMatchSocket({
    matchId: matchId || null,
    onEvent: refetchMatch,
    onReconnect: refetchMatch,
  });

  // Local ticker only draws the countdown; the deadline itself is the server's.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const mySeat = match?.mySeat ?? null;
  const status = match?.status;
  const isMyTurn =
    status === "PLAYING" && mySeat !== null && match?.currentSeat === mySeat;
  const mySecret =
    mySeat === 1
      ? match?.player1Number
      : mySeat === 2
        ? match?.player2Number
        : null;

  const moves: ILocalMove[] = useMemo(
    () =>
      ((match?.moves ?? []) as IOnlineMove[]).map((move) => ({
        turnNumber: move.turnNumber,
        guess: move.guess,
        feedback: {
          picos: move.picos,
          palas: move.palas,
          isWin: move.isWin,
        },
        isPlayerMove: move.seat === mySeat,
      })),
    [match?.moves, mySeat],
  );
  const myGuesses = useMemo(
    () => moves.filter((m) => m.isPlayerMove).map((m) => m.guess),
    [moves],
  );

  const secondsLeft = match?.turnDeadlineAt
    ? Math.max(0, Math.ceil((Date.parse(match.turnDeadlineAt) - now) / 1000))
    : null;

  // The turn changed (mine played or the server auto-played): reset the pad.
  // Adjusting state during render avoids an extra effect-driven render.
  const currentSeat = match?.currentSeat;
  const [padSeat, setPadSeat] = useState(currentSeat);
  if (padSeat !== currentSeat) {
    setPadSeat(currentSeat);
    setIsPadVisible(false);
    setSelectedDigits([]);
    setError(null);
  }

  // Cancelled before it started: nothing to play.
  useEffect(() => {
    if (status === "CANCELLED") {
      Alert.alert(t("common.error"), t("privateRoom.matchCancelled"));
      router.replace("/private/home");
    }
  }, [status, t]);

  // Still collecting secrets (e.g. resumed): go back to that step.
  useEffect(() => {
    if (status === "WAITING") {
      router.replace({
        pathname: "/private/game/select-secret",
        params: { mode: "PRIVATE", matchId },
      });
    }
  }, [status, matchId]);

  const handleDigitPress = useCallback((digit: number) => {
    setError(null);
    setSelectedDigits((prev) =>
      prev.includes(digit) || prev.length >= 4 ? prev : [...prev, digit],
    );
  }, []);

  const handleBackspace = useCallback(() => {
    setError(null);
    setSelectedDigits((prev) => prev.slice(0, -1));
  }, []);

  const handleClosePad = useCallback(() => {
    setIsPadVisible(false);
    setSelectedDigits([]);
    setError(null);
  }, []);

  const handleSubmit = useCallback(() => {
    const guess = selectedDigits.join("");
    const validation = validateGuess(guess);
    if (!validation.valid) {
      const key =
        GUESS_ERRORS[validation.errorCode as keyof typeof GUESS_ERRORS] ??
        "game.invalidNumber";
      setError(t(key));
      return;
    }
    if (myGuesses.includes(guess)) {
      setError(t("game.guessAlreadyUsed"));
      return;
    }

    submitMove.mutate(
      { matchId, guess },
      {
        onError: () => {
          // Most likely the clock expired or the turn moved on: resync.
          setError(t("errors.generic"));
          refetchMatch();
        },
      },
    );
  }, [selectedDigits, myGuesses, matchId, submitMove, refetchMatch, t]);

  const handleLeave = useCallback(() => {
    if (status !== "PLAYING") {
      router.replace("/private/home");
      return;
    }
    Alert.alert(t("game.leaveGame"), t("game.leaveGameConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("game.leaveGame"),
        style: "destructive",
        onPress: () => {
          forfeit.mutate(matchId, {
            onSuccess: () => router.replace("/private/home"),
            onError: () => Alert.alert(t("common.error"), t("errors.generic")),
          });
        },
      },
    ]);
  }, [status, matchId, forfeit, t]);

  useBlockHardwareBack(status === "PLAYING", handleLeave);

  if (!match || status === "WAITING") {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-textMuted font-CairoRegular text-base">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  if (status === "FINISHED") {
    const me = match.participants?.find((p) => p.seat === mySeat);
    const result: TGameResult = me?.result ? RESULT_MAP[me.result] : "draw";
    return (
      <View
        className="flex-1 bg-background justify-center"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <GameResultView
          result={result}
          opponentNumber={null}
          playerNumber={mySecret ?? "----"}
          turns={me?.attemptsUsed ?? 0}
          onPlayAgain={() => router.replace("/private/game/private-room")}
          onBackToMenu={() => router.replace("/private/home")}
          t={t}
        />
      </View>
    );
  }

  const myAttempts =
    match.participants?.find((p) => p.seat === mySeat)?.attemptsUsed ?? 0;
  const timerLow = secondsLeft !== null && secondsLeft <= 10;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <GameHeader
        onBackPress={handleLeave}
        rightElement={
          <Pressable
            onPress={handleLeave}
            className="w-10 h-10 justify-center items-center"
          >
            <Ionicons name="exit-outline" size={22} color="#94959B" />
          </Pressable>
        }
      />

      <GameStatusBar
        gameMode={t("home.game.privateRoom")}
        turnNumber={myAttempts + (isMyTurn ? 1 : 0)}
      />

      {(!isConnected || !opponentOnline) && (
        <View className="mx-6 mt-3 rounded-xl bg-gold/20 px-4 py-2">
          <Text className="text-gold font-CairoSemiBold text-sm text-center">
            {!isConnected
              ? t("game.reconnecting")
              : t("game.opponentDisconnected")}
          </Text>
        </View>
      )}

      <SecretNumberCard
        number={mySecret ?? "----"}
        title={t("game.yourSecretNumber")}
        hint={t("game.secretOnlyYou")}
      />

      {/* Turn + server countdown */}
      <View className="flex-row items-center justify-between mx-6 mb-2">
        <Text
          className={`font-CairoBold text-base ${
            isMyTurn ? "text-success" : "text-textMuted"
          }`}
        >
          {isMyTurn ? t("game.yourTurn") : t("game.opponentTurn")}
        </Text>
        {secondsLeft !== null && (
          <Text
            className={`font-CairoBlack text-2xl ${
              timerLow ? "text-mainRed" : "text-white"
            }`}
          >
            {secondsLeft}s
          </Text>
        )}
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <GameBoard moves={moves} opponentLabel={t("game.opponentHistory")} />
        </ScrollView>
      </View>

      {isMyTurn ? (
        isPadVisible ? (
          <NumberPad
            selectedDigits={selectedDigits}
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            onSubmit={handleSubmit}
            disabled={selectedDigits.length !== 4 || submitMove.isPending}
            error={error}
            onClose={handleClosePad}
          />
        ) : (
          <Pressable
            onPress={() => setIsPadVisible(true)}
            className="mx-6 mb-4 bg-mainRose rounded-xl py-4 justify-center items-center active:opacity-80"
          >
            <Text className="text-white font-CairoBold text-base">
              {t("game.submitGuess")}
            </Text>
          </Pressable>
        )
      ) : (
        <View className="bg-surface rounded-t-3xl px-6 py-6 items-center">
          <Text className="text-textMuted font-CairoSemiBold text-base">
            {t("game.opponentTurnWait")}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
