import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameStore } from "@presentation/store/useGameStore";
import { useAuthStore } from "@presentation/store/useAuthStore";
import {
  generateSecretNumber,
  validateGuess,
  calculateFeedback,
  generateEasyAIMove,
  generateMediumAIMove,
  generateHardAIMove,
  isGuessRepeated,
  findPreviousGuessFeedback,
} from "@core/utils/gameLogic";
import { syncOfflineStatsAction } from "@core/actions/stats/stats-action";
import { addToOfflineStatsQueue } from "@core/utils/offlineStatsQueue";
import Ionicons from "@expo/vector-icons/Ionicons";
import GameBoard from "@presentation/components/ui/GameBoard";
import NumberPad from "@presentation/components/ui/NumberPad";
import GameHeader from "@presentation/components/ui/GameHeader";
import GameStatusBar from "@presentation/components/ui/GameStatusBar";
import SecretNumberCard from "@presentation/components/ui/SecretNumberCard";
import GameResultView from "@presentation/components/ui/GameResultView";
import CoinFlip from "@presentation/components/ui/CoinFlip";
import { useBlockHardwareBack } from "@presentation/hooks/useBlockHardwareBack";
import type { TDifficulty } from "@core/interfaces/IMatch/IMatch";
import type { ILocalMove, TActor } from "@core/interfaces/IGame/IGame";

const DIFFICULTY_LABELS = {
  EASY: "home.game.easy",
  MEDIUM: "home.game.medium",
  HARD: "home.game.hard",
} as const;

const VALID_DIFFICULTIES: TDifficulty[] = ["EASY", "MEDIUM", "HARD"];

const AI_MIN_DELAY_MS = 2000;
const TIMER_SECONDS = 60;

type Params = {
  difficulty?: string;
};

type ToastMessage = {
  text: string;
  type: "info" | "error" | "success";
  visible: boolean;
};

export default function VersusAIScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Params>();
  const difficultyParam = (params.difficulty || "MEDIUM").toUpperCase();
  const difficulty: TDifficulty = VALID_DIFFICULTIES.includes(difficultyParam as TDifficulty)
    ? (difficultyParam as TDifficulty)
    : "MEDIUM";

  const {
    opponentNumber,
    playerNumber,
    moves,
    currentTurn,
    status,
    roundNumber,
    starter,
    currentPlayerTurn,
    addMove,
    setOpponentNumber,
    setStatus,
    setStarter,
    setCurrentPlayerTurn,
    decrementPlayerAttempts,
    decrementAIAttempts,
    incrementRoundNumber,
    loadGameState,
    saveGameState,
  } = useGameStore();

  const { isAuthenticated } = useAuthStore();
  const [selectedDigits, setSelectedDigits] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [showDecidingAnimation, setShowDecidingAnimation] = useState(false);
  const [showStarterModal, setShowStarterModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [previousFeedback, setPreviousFeedback] = useState<{ picos: number; palas: number } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_SECONDS);
  const [isGuessInputVisible, setIsGuessInputVisible] = useState(false);

  const isInitializedRef = useRef(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiStarterTriggeredRef = useRef(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleAutoSubmitRef = useRef<(() => void) | undefined>(undefined);

  const showToast = useCallback((text: string, type: "info" | "error" | "success" = "info") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ text, type, visible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  }, []);

  const handleSyncStats = useCallback(
    async (
      result: "win" | "lose" | "draw",
      totalPicos: number,
      totalPalas: number,
    ) => {
      try {
        if (result === "win") {
          await syncOfflineStatsAction({ wins: 1, losses: 0, draws: 0, totalPicos, totalPalas });
        } else if (result === "lose") {
          await syncOfflineStatsAction({ wins: 0, losses: 1, draws: 0, totalPicos, totalPalas });
        } else {
          await syncOfflineStatsAction({ wins: 0, losses: 0, draws: 1, totalPicos, totalPalas });
        }
      } catch {
        await addToOfflineStatsQueue({
          result,
          difficulty,
          totalPicos,
          totalPalas,
          turns: currentTurn - 1,
          playedAt: new Date().toISOString(),
        });
      }
    },
    [difficulty, currentTurn],
  );

  const handleGameOver = useCallback(
    async (result: "win" | "lose" | "draw") => {
      setGameResult(result);
      setStatus("FINISHED");

      const currentMoves = useGameStore.getState().moves;
      const totalPicos = currentMoves.reduce((sum, m) => sum + m.feedback.picos, 0);
      const totalPalas = currentMoves.reduce((sum, m) => sum + m.feedback.palas, 0);

      if (isAuthenticated) {
        await handleSyncStats(result, totalPicos, totalPalas);
      } else {
        await addToOfflineStatsQueue({
          result,
          difficulty,
          totalPicos,
          totalPalas,
          turns: currentTurn - 1,
          playedAt: new Date().toISOString(),
        });
      }
    },
    [isAuthenticated, difficulty, currentTurn, handleSyncStats, setStatus],
  );

  const executeAITurn = useCallback(async () => {
    const currentState = useGameStore.getState();
    if (currentState.status !== "PLAYING") {
      setIsAIThinking(false);
      return;
    }

    const playerSecret = currentState.playerNumber;
    if (!playerSecret) {
      setIsAIThinking(false);
      return;
    }

    setIsAIThinking(true);

    const startTime = Date.now();

    const aiMoves = currentState.moves.filter((m) => !m.isPlayerMove);
    const aiMoveGuesses = aiMoves.map((m) => m.guess);

    let aiGuess: string;
    if (difficulty === "EASY") {
      aiGuess = generateEasyAIMove(aiMoveGuesses);
    } else if (difficulty === "MEDIUM") {
      aiGuess = generateMediumAIMove(aiMoves);
    } else {
      aiGuess = generateHardAIMove(aiMoves);
    }

    const elapsed = Date.now() - startTime;
    const remainingDelay = Math.max(0, AI_MIN_DELAY_MS - elapsed);

    setTimeout(() => {
      const stateAfterDelay = useGameStore.getState();
      if (stateAfterDelay.status !== "PLAYING") {
        setIsAIThinking(false);
        return;
      }

      const aiFeedback = calculateFeedback(aiGuess, playerSecret);
      const aiMove: ILocalMove = {
        turnNumber: stateAfterDelay.currentTurn,
        guess: aiGuess,
        feedback: aiFeedback,
        isPlayerMove: false,
      };
      addMove(aiMove);
      decrementAIAttempts();

      if (aiFeedback.isWin) {
        setIsAIThinking(false);
        handleGameOver("lose");
        return;
      }

      const newAiAttemptsLeft = stateAfterDelay.aiAttemptsLeft - 1;
      if (newAiAttemptsLeft <= 0 && stateAfterDelay.playerAttemptsLeft - 1 <= 0) {
        setIsAIThinking(false);
        handleGameOver("draw");
        return;
      }

      incrementRoundNumber();
      setCurrentPlayerTurn("PLAYER");
      setIsAIThinking(false);
    }, remainingDelay);
  }, [difficulty, addMove, decrementAIAttempts, incrementRoundNumber, setCurrentPlayerTurn, handleGameOver]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const repairMissingFields = () => {
      const state = useGameStore.getState();

      if (!state.starter) {
        const repairedStarter: TActor = Math.random() < 0.5 ? "PLAYER" : "AI";
        setStarter(repairedStarter);
        setCurrentPlayerTurn(repairedStarter);
      } else if (!state.currentPlayerTurn) {
        setCurrentPlayerTurn(state.starter);
      }

      if (!state.opponentNumber) {
        setOpponentNumber(generateSecretNumber());
      }

      const stateAfter = useGameStore.getState();
      if (!stateAfter.currentPlayerTurn) {
        setCurrentPlayerTurn("PLAYER");
      }
    };

    const showDecidingAnimationFlow = (_starterValue: TActor) => {
      setShowDecidingAnimation(true);
    };

    const init = async () => {
      try {
        const stateBeforeLoad = useGameStore.getState();
        const hasValidInMemoryState =
          stateBeforeLoad.mode === "VERSUS_AI" &&
          stateBeforeLoad.status === "PLAYING" &&
          stateBeforeLoad.playerNumber !== null;

        if (hasValidInMemoryState) {
          repairMissingFields();
          const stateAfterRepair = useGameStore.getState();
          showDecidingAnimationFlow(stateAfterRepair.currentPlayerTurn ?? "PLAYER");
          return;
        }

        await loadGameState();
        const state = useGameStore.getState();

        if (state.mode === "VERSUS_AI" && state.status === "PLAYING" && state.playerNumber) {
          repairMissingFields();
          setIsInitialized(true);
          return;
        }

        const aiNum = generateSecretNumber();
        setOpponentNumber(aiNum);

        const newStarter: TActor = Math.random() < 0.5 ? "PLAYER" : "AI";
        setStarter(newStarter);
        setCurrentPlayerTurn(newStarter);

        showDecidingAnimationFlow(newStarter);
      } catch {
        const aiNum = generateSecretNumber();
        setOpponentNumber(aiNum);
        const newStarter: TActor = Math.random() < 0.5 ? "PLAYER" : "AI";
        setStarter(newStarter);
        setCurrentPlayerTurn(newStarter);
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!showStarterModal) return;
    const timer = setTimeout(() => {
      setShowStarterModal(false);
      setIsInitialized(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showStarterModal]);

  useEffect(() => {
    if (!isInitialized || status !== "PLAYING") return;
    saveGameState();
  }, [moves, status, isInitialized, saveGameState]);

  useEffect(() => {
    if (isInitialized && starter === "AI" && moves.length === 0 && status === "PLAYING" && !aiStarterTriggeredRef.current) {
      aiStarterTriggeredRef.current = true;
      setTimeout(() => {
        executeAITurn();
      }, 100);
    }
  }, [isInitialized, starter, moves.length, status, executeAITurn]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (difficulty !== "HARD" || status !== "PLAYING" || currentPlayerTurn !== "PLAYER") {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    queueMicrotask(() => setTimeRemaining(TIMER_SECONDS));

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          handleAutoSubmitRef.current?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [difficulty, status, currentPlayerTurn]);

  const processPlayerGuess = useCallback(
    async (guess: string): Promise<boolean> => {
      const currentState = useGameStore.getState();
      if (currentState.status !== "PLAYING" || currentState.currentPlayerTurn !== "PLAYER") return false;

      setError(null);
      setPreviousFeedback(null);

      const validation = validateGuess(guess);
      if (!validation.valid) return false;

      if (isGuessRepeated(guess, currentState.moves.filter((m) => m.isPlayerMove))) {
        const prevFeedback = findPreviousGuessFeedback(guess, currentState.moves);
        if (prevFeedback) {
          setPreviousFeedback(prevFeedback);
        }
        return false;
      }

      const currentOpponentNumber = currentState.opponentNumber;
      if (!currentOpponentNumber) {
        setError(t("game.gameError"));
        return false;
      }

      const playerFeedback = calculateFeedback(guess, currentOpponentNumber);
      const playerMove: ILocalMove = {
        turnNumber: currentState.currentTurn,
        guess,
        feedback: playerFeedback,
        isPlayerMove: true,
      };
      addMove(playerMove);
      decrementPlayerAttempts();

      if (playerFeedback.isWin) {
        await handleGameOver("win");
        return true;
      }

      const newPlayerAttemptsLeft = currentState.playerAttemptsLeft - 1;
      if (newPlayerAttemptsLeft <= 0 && currentState.aiAttemptsLeft <= 0) {
        await handleGameOver("draw");
        return true;
      }

      setCurrentPlayerTurn("AI");

      setTimeout(() => {
        executeAITurn();
      }, 500);

      return true;
    },
    [t, addMove, decrementPlayerAttempts, setCurrentPlayerTurn, handleGameOver, executeAITurn],
  );

  const handleSubmit = useCallback(async () => {
    if (status !== "PLAYING" || currentPlayerTurn !== "PLAYER") return;

    const guess = selectedDigits.join("");
    setSelectedDigits([]);

    const validation = validateGuess(guess);
    if (!validation.valid) {
      if (validation.errorCode === "INVALID_LENGTH") {
        setError(t("game.invalidLength"));
      } else if (validation.errorCode === "INVALID_DIGITS") {
        setError(t("game.invalidDigits"));
      } else if (validation.errorCode === "REPEATED_DIGITS") {
        setError(t("game.repeatedDigits"));
      } else {
        setError(t("game.invalidNumber"));
      }
      return;
    }

    const currentState = useGameStore.getState();

    if (isGuessRepeated(guess, currentState.moves.filter((m) => m.isPlayerMove))) {
      const prevFeedback = findPreviousGuessFeedback(guess, currentState.moves);
      if (prevFeedback) {
        setPreviousFeedback(prevFeedback);
        showToast(t("game.guessAlreadyUsed"), "info");
      }
      return;
    }

    await processPlayerGuess(guess);
  }, [status, selectedDigits, currentPlayerTurn, t, showToast, processPlayerGuess]);

  const handleAutoSubmit = useCallback(async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const currentState = useGameStore.getState();
    const playerMoves = currentState.moves
      .filter((m) => m.isPlayerMove)
      .map((m) => m.guess);
    const autoGuess = generateEasyAIMove(playerMoves);

    showToast(t("game.timeUpAutoGuess"), "info");
    await processPlayerGuess(autoGuess);
  }, [t, processPlayerGuess, showToast]);

  useEffect(() => {
    handleAutoSubmitRef.current = handleAutoSubmit;
  });

  const handleDigitPress = useCallback(
    (digit: number) => {
      setError(null);
      setPreviousFeedback(null);

      if (selectedDigits.includes(digit)) return;
      if (selectedDigits.length >= 4) return;

      setSelectedDigits((prev) => [...prev, digit]);
    },
    [selectedDigits],
  );

  const handleBackspace = useCallback(() => {
    setError(null);
    setPreviousFeedback(null);
    setSelectedDigits((prev) => prev.slice(0, -1));
  }, []);

  const handleNewGame = useCallback(() => {
    router.replace({
      pathname: "/private/game/select-secret",
      params: { mode: "VERSUS_AI", difficulty },
    });
  }, [difficulty]);

  const handleViewGame = useCallback(() => {
    router.push("/private/game/review");
  }, []);

  const handleBackToMenu = useCallback(() => {
    router.replace("/private/home");
  }, []);

  const handleLeaveGame = useCallback(() => {
    if (status === "PLAYING") {
      Alert.alert(
        t("game.leaveGame"),
        t("game.leaveGameConfirm"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("game.leaveGame"),
            style: "destructive",
            onPress: async () => {
              await saveGameState();
              router.back();
            },
          },
        ],
      );
    } else {
      router.back();
    }
  }, [status, t, saveGameState]);

  useBlockHardwareBack(status === "PLAYING", handleLeaveGame);

  const handleCloseGuessInput = useCallback(() => {
    setIsGuessInputVisible(false);
    setSelectedDigits([]);
    setError(null);
  }, []);

  const currentGameTurn = Math.floor(moves.length / 2) + 1;

  const handleSubmitAndClose = useCallback(async () => {
    await handleSubmit();
    setIsGuessInputVisible(false);
    setSelectedDigits([]);
    setError(null);
  }, [handleSubmit]);

  if (!isInitialized && !showDecidingAnimation) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-textMuted font-CairoRegular text-base">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  if (showDecidingAnimation) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <CoinFlip
          visible={showDecidingAnimation}
          resultSide={currentPlayerTurn === "PLAYER" ? "PLAYER" : "OPPONENT"}
          decidingLabel={t("game.decidingWhoStarts")}
          duration={2500}
          onAnimationEnd={() => {
            setShowDecidingAnimation(false);
            setShowStarterModal(true);
          }}
        />
      </View>
    );
  }

  if (showStarterModal) {
    const isPlayerStarter = currentPlayerTurn === "PLAYER";
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-mainPurple/20 justify-center items-center mb-6">
            <Ionicons
              name={isPlayerStarter ? "play-circle" : "hourglass-outline"}
              size={48}
              color="#9D4EDD"
            />
          </View>
          <Text className="text-white font-CairoBlack text-2xl uppercase tracking-tight">
            {isPlayerStarter ? t("game.youStart") : t("game.aiStarts")}
          </Text>
        </View>
      </View>
    );
  }

  if (gameResult) {
    return (
      <View
        className="flex-1 bg-background justify-center"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <GameResultView
          result={gameResult}
          opponentNumber={opponentNumber ?? "----"}
          playerNumber={playerNumber ?? "----"}
          turns={roundNumber - 1}
          difficulty={t(DIFFICULTY_LABELS[difficulty])}
          onPlayAgain={handleNewGame}
          onBackToMenu={handleBackToMenu}
          onViewGame={handleViewGame}
          t={t}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <GameHeader
        onBackPress={handleLeaveGame}
        rightElement={
          <Pressable
            onPress={handleLeaveGame}
            className="w-10 h-10 justify-center items-center"
          >
            <Ionicons name="exit-outline" size={22} color="#94959B" />
          </Pressable>
        }
      />

      <GameStatusBar
        gameMode={t("home.game.versusAI")}
        difficulty={t(DIFFICULTY_LABELS[difficulty])}
        turnNumber={currentGameTurn}
      />

      <SecretNumberCard
        number={playerNumber ?? "----"}
        title={t("game.yourSecretNumber")}
        hint={t("game.secretOnlyYou")}
      />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <GameBoard moves={moves} />
        </ScrollView>
      </View>

      {toast && (
        <View className="absolute top-24 left-4 right-4 z-20">
          <View className={`rounded-xl px-4 py-3 ${
            toast.type === "error" ? "bg-error" : toast.type === "success" ? "bg-success" : "bg-mainPurple"
          }`}>
            <Text className="text-white font-CairoSemiBold text-center text-sm">
              {toast.text}
            </Text>
            {previousFeedback && (
              <View className="flex-row justify-center gap-4 mt-2">
                <View className="flex-row items-center gap-1">
                  <View className="w-4 h-4 rounded-full bg-success justify-center items-center">
                    <Text className="text-[8px] font-CairoBold text-background">{previousFeedback.picos}</Text>
                  </View>
                  <Text className="text-white/80 text-xs">P</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <View className="w-4 h-4 rounded-full bg-gold justify-center items-center">
                    <Text className="text-[8px] font-CairoBold text-background">{previousFeedback.palas}</Text>
                  </View>
                  <Text className="text-white/80 text-xs">p</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {isAIThinking ? (
        <View className="bg-surface rounded-t-3xl px-6 py-8 items-center">
          <Text className="text-textMuted font-CairoSemiBold text-base">
            {t("game.thinking")}
          </Text>
        </View>
      ) : status === "PLAYING" && currentPlayerTurn === "PLAYER" ? (
        isGuessInputVisible ? (
          <NumberPad
            selectedDigits={selectedDigits}
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            onSubmit={handleSubmitAndClose}
            disabled={selectedDigits.length !== 4}
            error={error}
            onClose={handleCloseGuessInput}
          />
        ) : (
          <Pressable
            onPress={() => setIsGuessInputVisible(true)}
            className="mx-6 mb-4 bg-mainRose rounded-xl py-4 justify-center items-center active:opacity-80"
          >
            <Text className="text-white font-CairoBold text-base">
              {t("game.submitGuess")}
            </Text>
          </Pressable>
        )
      ) : null}
    </KeyboardAvoidingView>
  );
}
