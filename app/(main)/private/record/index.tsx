import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import ScreenHeader from "@presentation/components/ui/ScreenHeader";
import SegmentedControl from "@presentation/components/ui/SegmentedControl";
import { useAuthStore } from "@presentation/store/useAuthStore";
import {
  usePlayerMatches,
  usePlayerStats,
} from "@presentation/hooks/usePlayer";
import type {
  IMatchSummary,
  TDifficulty,
  TMatchResult,
} from "@core/interfaces/IMatch/IMatch";

const FILTER_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Versus IA", value: "VERSUS_AI" },
  { label: "Sala Privada", value: "PRIVATE" },
  { label: "Sala Global", value: "GLOBAL" },
];

const HISTORY_PAGE_SIZE = 20;

const DIFFICULTY_LABELS = {
  EASY: "home.game.easy",
  MEDIUM: "home.game.medium",
  HARD: "home.game.hard",
} as const;

type TRecordResult = "win" | "lose" | "draw";

const RESULT_MAP: Record<TMatchResult, TRecordResult> = {
  WIN: "win",
  LOSS: "lose",
  DRAW: "draw",
};

interface MatchRecord {
  id: string;
  mode: string;
  result: TRecordResult | null;
  date: string;
  turns: number;
  difficulty?: TDifficulty | null;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function toMatchRecord(
  match: IMatchSummary,
  playerId: string | undefined,
): MatchRecord {
  const me = match.participants.find((p) => p.playerId === playerId);
  const playedAt = new Date(match.finishedAt ?? match.createdAt);
  return {
    id: match.id,
    mode: match.mode,
    result: me?.result ? RESULT_MAP[me.result] : null,
    date: playedAt.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    }),
    turns: me?.attemptsUsed ?? 0,
    difficulty: match.aiDifficulty,
  };
}

export default function RecordScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");
  const playerId = useAuthStore((state) => state.player?.id);

  const statsQuery = usePlayerStats();
  const matchesQuery = usePlayerMatches(
    HISTORY_PAGE_SIZE,
    0,
    filter === "all" ? undefined : filter,
    "FINISHED",
  );
  const stats = statsQuery.data;
  const records = (matchesQuery.data?.matches ?? []).map((m) =>
    toMatchRecord(m, playerId),
  );
  const winRate =
    stats && stats.totalGames > 0
      ? Math.round((stats.wins / stats.totalGames) * 100)
      : 0;

  const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return "trophy-outline" as const;
      case "lose":
        return "time-outline" as const;
      case "draw":
        return "close-circle-outline" as const;
      default:
        return "help-circle-outline" as const;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "#A2D729";
      case "lose":
        return "#FF4D4D";
      case "draw":
        return "#FFD600";
      default:
        return "#94959B";
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case "win":
        return t("record.wins");
      case "lose":
        return t("record.losses");
      case "draw":
        return t("record.draws");
      default:
        return result;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "VERSUS_AI":
        return t("record.versusAI");
      case "PRIVATE":
        return t("record.privateRoom");
      case "GLOBAL":
        return t("record.globalRoom");
      default:
        return mode;
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScreenHeader title={t("record.title")} subtitle={t("record.subtitle")} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Estadísticas principales */}
        <View className="flex-row gap-3 px-4 mt-3">
          <View className="flex-1 bg-statBlue border border-statBlueBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="bar-chart-outline" size={24} color="#00D2FF" />
            <Text className="text-white font-CairoBlack text-3xl mt-2">
              {stats?.totalGames ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.gamesPlayed")}
            </Text>
          </View>
          <View className="flex-1 bg-statGreen border border-statGreenBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="trophy-outline" size={24} color="#A2D729" />
            <Text className="text-success font-CairoBlack text-3xl mt-2">
              {stats?.wins ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.wins")}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 px-4 mt-3">
          <View className="flex-1 bg-statBrown border border-statBrownBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="analytics-outline" size={24} color="#FFD600" />
            <Text className="text-gold font-CairoBlack text-3xl mt-2">
              {winRate}%
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.winRate")}
            </Text>
          </View>
          <View className="flex-1 bg-statRed border border-statRedBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="flash-outline" size={24} color="#FF5959" />
            <Text className="text-mainRed font-CairoBlack text-3xl mt-2">
              {stats?.currentStreak ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.currentStreak")}
            </Text>
          </View>
        </View>

        {/* Estadísticas secundarias */}
        <View className="flex-row gap-3 px-4 mt-3">
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-error font-CairoBold text-2xl mb-1">
              {stats?.losses ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.losses")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-gold font-CairoBold text-2xl mb-1">
              {stats?.draws ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.draws")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-cian font-CairoBold text-2xl mb-1">
              {stats?.bestAttempts ?? "-"}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.bestResult")}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 px-4 mt-3">
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-mainRed font-CairoBold text-2xl mb-1">
              {stats?.bestStreak ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.longestStreak")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-limeGreen font-CairoBold text-2xl mb-1">
              {formatDuration(stats?.avgTimePerGame ?? 0)}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.averageTime")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-mainPurple font-CairoBold text-2xl mb-1">
              {stats?.totalPalas ?? 0}
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.totalPalas")}
            </Text>
          </View>
        </View>

        {/* Filtros */}
        <View className="mt-6">
          <SegmentedControl
            options={FILTER_OPTIONS}
            selectedValue={filter}
            onValueChange={setFilter}
          />
        </View>

        {/* Partidas recientes */}
        <View className="mt-4 px-4">
          <Text className="text-white font-CairoBold text-lg mb-3">
            {t("record.recentGames")}
          </Text>

          {matchesQuery.isLoading && (
            <Text className="text-textMuted font-CairoRegular text-sm">
              {t("common.loading")}
            </Text>
          )}
          {matchesQuery.isError && (
            <Text
              className="text-error font-CairoRegular text-sm"
              onPress={() => matchesQuery.refetch()}
            >
              {t("common.retry")}
            </Text>
          )}
          {matchesQuery.isSuccess && records.length === 0 && (
            <Text className="text-textMuted font-CairoRegular text-sm">
              {t("record.noGames")}
            </Text>
          )}

          {records.map((record) => {
            const result = record.result ?? "";
            const resultColor = getResultColor(result);
            const resultIcon = getResultIcon(result);

            return (
              <View
                key={record.id}
                className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center"
              >
                {/* Icon */}
                <View
                  className={`w-10 h-10 rounded-full justify-center items-center mr-3 ${
                    result === "win"
                      ? "bg-success/20"
                      : result === "lose"
                        ? "bg-error/20"
                        : "bg-gold/20"
                  }`}
                >
                  <Ionicons name={resultIcon} size={20} color={resultColor} />
                </View>

                {/* Info */}
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name={
                        record.mode === "VERSUS_AI"
                          ? "rocket-outline"
                          : "key-outline"
                      }
                      size={14}
                      color="#94959B"
                    />
                    <Text className="text-white font-CairoSemiBold text-sm ml-1 mr-2">
                      {getModeLabel(record.mode)}
                    </Text>
                    {record.difficulty && (
                      <View className="bg-mainPurple/20 px-2 py-0.5 rounded-full">
                        <Text className="text-mainPurple font-CairoRegular text-xs">
                          {t(DIFFICULTY_LABELS[record.difficulty])}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-textMuted font-CairoRegular text-xs">
                    {record.date} · {record.turns} {t("record.turns")}
                  </Text>
                </View>

                {/* Result badge */}
                <View
                  className={`px-3 py-1 rounded-full ${
                    result === "win" ? "bg-success/20" : "bg-error/20"
                  }`}
                >
                  <Text
                    className={`font-CairoSemiBold text-sm ${
                      result === "win" ? "text-success" : "text-error"
                    }`}
                  >
                    {result ? getResultLabel(result) : "-"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
