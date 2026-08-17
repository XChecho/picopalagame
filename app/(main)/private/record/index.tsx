import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import ScreenHeader from "@presentation/components/ui/ScreenHeader";
import SegmentedControl from "@presentation/components/ui/SegmentedControl";

const FILTER_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Versus IA", value: "VERSUS_AI" },
  { label: "Sala Privada", value: "PRIVATE" },
  { label: "Sala Global", value: "GLOBAL" },
];

interface MatchRecord {
  id: string;
  mode: string;
  result: "win" | "lose" | "draw";
  date: string;
  turns: number;
  difficulty?: string;
}

const MOCK_RECORDS: MatchRecord[] = [
  {
    id: "1",
    mode: "VERSUS_AI",
    result: "win",
    date: "29 jul",
    turns: 6,
    difficulty: "Media",
  },
  {
    id: "2",
    mode: "VERSUS_AI",
    result: "lose",
    date: "28 jul",
    turns: 10,
    difficulty: "Difícil",
  },
  {
    id: "3",
    mode: "PRIVATE",
    result: "win",
    date: "27 jul",
    turns: 4,
  },
];

export default function RecordScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");

  const filteredRecords =
    filter === "all"
      ? MOCK_RECORDS
      : MOCK_RECORDS.filter((r) => r.mode === filter);

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
      <ScreenHeader
        title={t("record.title")}
        subtitle={t("record.subtitle")}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Estadísticas principales */}
        <View className="flex-row gap-3 px-4 mt-3">
          <View className="flex-1 bg-statBlue border border-statBlueBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="bar-chart-outline" size={24} color="#00D2FF" />
            <Text className="text-white font-CairoBlack text-3xl mt-2">7</Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.gamesPlayed")}
            </Text>
          </View>
          <View className="flex-1 bg-statGreen border border-statGreenBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="trophy-outline" size={24} color="#A2D729" />
            <Text className="text-success font-CairoBlack text-3xl mt-2">4</Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.wins")}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 px-4 mt-3">
          <View className="flex-1 bg-statBrown border border-statBrownBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="analytics-outline" size={24} color="#FFD600" />
            <Text className="text-gold font-CairoBlack text-3xl mt-2">57%</Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.winRate")}
            </Text>
          </View>
          <View className="flex-1 bg-statRed border border-statRedBorder rounded-2xl p-4 min-h-[110px]">
            <Ionicons name="flash-outline" size={24} color="#FF5959" />
            <Text className="text-mainRed font-CairoBlack text-3xl mt-2">3</Text>
            <Text className="text-textMuted font-CairoRegular text-xs mt-1">
              {t("record.currentStreak")}
            </Text>
          </View>
        </View>

        {/* Estadísticas secundarias */}
        <View className="flex-row gap-3 px-4 mt-3">
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-error font-CairoBold text-2xl mb-1">2</Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.losses")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-gold font-CairoBold text-2xl mb-1">1</Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.draws")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-cian font-CairoBold text-2xl mb-1">3</Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.bestResult")}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 px-4 mt-3">
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-mainRed font-CairoBold text-2xl mb-1">8</Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.longestStreak")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-limeGreen font-CairoBold text-2xl mb-1">
              2m 18s
            </Text>
            <Text className="text-textMuted font-CairoRegular text-xs">
              {t("record.averageTime")}
            </Text>
          </View>
          <View className="bg-surface rounded-xl p-3 flex-1 min-h-[80px]">
            <Text className="text-mainPurple font-CairoBold text-2xl mb-1">
              276
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

          {filteredRecords.map((record) => {
            const result = record.result;
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
                  <Ionicons
                    name={resultIcon}
                    size={20}
                    color={resultColor}
                  />
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
                          {record.difficulty}
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
                    {getResultLabel(result)}
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
