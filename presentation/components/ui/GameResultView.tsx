import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export type TGameResult = "win" | "lose" | "draw";

interface GameResultViewProps {
  result: TGameResult;
  // Hidden when the opponent's secret is not known (online matches).
  opponentNumber?: string | null;
  playerNumber: string;
  turns: number;
  difficulty?: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onViewGame?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

const RESULT_CONFIG = {
  win: {
    titleKey: "game.win",
    icon: "trophy-outline" as const,
    badgeBg: "bg-success",
    badgeGlow: "#A2D729",
    titleColor: "text-success",
    glowColor: "bg-success",
    primaryGradient: ["#FF5959", "#FF2E95"] as [string, string],
    primaryLabelKey: "game.playAgain",
  },
  lose: {
    titleKey: "game.lose",
    icon: "heart-dislike-outline" as const,
    badgeBg: "bg-error",
    badgeGlow: "#FF4D4D",
    titleColor: "text-error",
    glowColor: "bg-error",
    primaryGradient: ["#3E4251", "#3E4251"] as [string, string],
    primaryLabelKey: "game.tryAgain",
  },
  draw: {
    titleKey: "game.draw",
    icon: "scale-outline" as const,
    badgeBg: "bg-gold",
    badgeGlow: "#FFD600",
    titleColor: "text-gold",
    glowColor: "bg-gold",
    primaryGradient: ["#3E4251", "#3E4251"] as [string, string],
    primaryLabelKey: "game.playAgain",
  },
};

const GameResultView = ({
  result,
  opponentNumber,
  playerNumber,
  turns,
  difficulty,
  onPlayAgain,
  onBackToMenu,
  onViewGame,
  t,
}: GameResultViewProps) => {
  const config = RESULT_CONFIG[result];

  return (
    <View className="py-8 justify-center items-center px-6">
      {/* Confeti al ganar */}
      {result === "win" && (
        <View className="absolute inset-0 pointer-events-none">
          <LottieView
            source={require("@assets/animations/confetti.json")}
            autoPlay
            loop={false}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      )}

      {/* Glow ambiental */}
      <View className="absolute inset-0 justify-center items-center pointer-events-none">
        <View
          className={`w-64 h-64 rounded-full ${config.glowColor} opacity-10`}
          style={{
            shadowColor: config.badgeGlow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 60,
          }}
        />
      </View>

      {/* Card principal */}
      <View className="relative w-full max-w-sm bg-surface rounded-3xl p-8 items-center border border-border/30">
        {/* Badge con ícono */}
        <View
          className={`w-20 h-20 rounded-2xl ${config.badgeBg} items-center justify-center mb-6`}
          style={{
            shadowColor: config.badgeGlow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 15,
          }}
        >
          <Ionicons name={config.icon} size={40} color="#FFFFFF" />
        </View>

        {/* Título */}
        <Text className={`text-3xl font-CairoBlack uppercase tracking-tight mb-6 ${config.titleColor}`}>
          {t(config.titleKey)}
        </Text>

        {/* Número del oponente */}
        {opponentNumber ? (
          <View className="bg-background rounded-xl p-4 w-full mb-4 items-center">
            <Text className="text-textMuted font-CairoRegular text-sm mb-1">
              {t("game.opponentNumberWas")}
            </Text>
            <Text className="text-2xl font-CairoBold text-white tracking-[0.2em]">
              {opponentNumber.split("").join(" ")}
            </Text>
          </View>
        ) : null}

        {/* Número del jugador (solo en empate) */}
        {result === "draw" && (
          <View className="bg-background rounded-xl p-4 w-full mb-4 items-center">
            <Text className="text-textMuted font-CairoRegular text-sm mb-1">
              {t("game.yourNumberWas")}
            </Text>
            <Text className="text-2xl font-CairoBold text-mainPurple tracking-[0.2em]">
              {playerNumber.split("").join(" ")}
            </Text>
          </View>
        )}

        {/* Stats pill */}
        <View className="flex-row items-center gap-2 mb-6 bg-surfaceLight rounded-full px-4 py-2">
          <Ionicons name="swap-horizontal" size={18} color="#9D4EDD" />
          <Text className="text-white font-CairoBold text-sm">
            {t("game.turnsUsed", { turns })}
          </Text>
        </View>

        {/* Dificultad (si aplica) */}
        {difficulty && (
          <View className="bg-surfaceLight rounded-full px-4 py-2 mb-6">
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("game.difficulty")}: {difficulty}
            </Text>
          </View>
        )}

        {/* Botones */}
        <View className="flex-col gap-3 w-full">
          {/* Botón primario */}
          <Pressable
            onPress={onPlayAgain}
            className="w-full h-14 rounded-xl active:scale-95"
          >
            <LinearGradient
              colors={config.primaryGradient}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text className="text-white font-CairoBold text-base uppercase">
                  {t(config.primaryLabelKey)}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Botón Ver partida */}
          {onViewGame ? (
            <Pressable
              onPress={onViewGame}
              className="w-full h-14 rounded-xl bg-surfaceLight border border-border/50 items-center justify-center active:opacity-80"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                <Text className="text-white font-CairoBold text-base uppercase">
                  {t("game.viewGame")}
                </Text>
              </View>
            </Pressable>
          ) : null}

          {/* Botón Volver al menú */}
          <Pressable
            onPress={onBackToMenu}
            className="w-full h-14 rounded-xl bg-transparent border border-border items-center justify-center active:opacity-80"
          >
            <Text className="text-textMuted font-CairoSemiBold text-base uppercase">
              {t("game.backToMenu")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default GameResultView;
