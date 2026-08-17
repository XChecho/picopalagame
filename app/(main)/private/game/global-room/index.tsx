import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import GameHeader from "@presentation/components/ui/GameHeader";
import LeaderboardRow from "@presentation/components/ui/LeaderboardRow";
import SearchLoader from "@presentation/components/ui/SearchLoader";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "ElCifrador_99", wins: 142, winRate: "87%", avatarLetter: "E", avatarColor: "#FF5959" },
  { rank: 2, name: "Pico_Master", wins: 118, winRate: "82%", avatarLetter: "P", avatarColor: "#9D4EDD" },
  { rank: 3, name: "NúmerosDePro", wins: 103, winRate: "79%", avatarLetter: "N", avatarColor: "#FF5959" },
  { rank: 4, name: "CodeBreaker_J", wins: 98, winRate: "76%", avatarLetter: "C", avatarColor: "#4A4D57" },
  { rank: 5, name: "Adivinador7", wins: 87, winRate: "73%", avatarLetter: "A", avatarColor: "#4A4D57" },
];

export default function GlobalRoomScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isSearching, setIsSearching] = useState(false);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {isSearching ? (
        <SearchLoader
          playerName="Jugador_7834"
          estimatedTime={t("globalRoom.estimatedTime")}
          onCancel={() => setIsSearching(false)}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <GameHeader title={t("globalRoom.title")} />

          {/* Online Status */}
          <View className="flex-row items-center justify-center mt-4">
            <View className="flex-row items-center bg-mainGreen/20 px-3 py-1 rounded-full">
              <View className="w-2 h-2 rounded-full bg-success mr-1.5" />
              <Text className="text-success font-CairoSemiBold text-xs">247 {t("globalRoom.online")}</Text>
            </View>
          </View>

          {/* Partida Rápida Card */}
          <View className="mx-6 mt-6 bg-surface rounded-2xl p-5">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-xl bg-mainGreen/20 justify-center items-center mr-3">
                <Ionicons name="globe-outline" size={28} color="#84CC16" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-CairoBold text-lg">{t("globalRoom.quickMatch")}</Text>
                <Text className="text-textMuted font-CairoRegular text-sm">{t("globalRoom.quickMatchDesc")}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setIsSearching(true)}
              className="w-full h-14 rounded-xl justify-center items-center active:opacity-85"
            >
              <LinearGradient
                colors={["#84CC16", "#00D2FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: "100%", height: 56, borderRadius: 12, justifyContent: "center", alignItems: "center" }}
              >
                <Text className="text-white font-CairoBold text-lg">{t("globalRoom.searchGame")}</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Global Leaderboard Section */}
          <View className="mt-6 px-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="trophy-outline" size={20} color="#FFD600" />
              <Text className="text-white font-CairoBold text-base ml-2">{t("globalRoom.leaderboard")}</Text>
            </View>

            {MOCK_LEADERBOARD.map((player) => (
              <LeaderboardRow
                key={player.rank}
                rank={player.rank}
                name={player.name}
                wins={player.wins}
                winRate={player.winRate}
                avatarLetter={player.avatarLetter}
                avatarColor={player.avatarColor}
              />
            ))}
          </View>

          <View className="h-8" />
        </ScrollView>
      )}
    </View>
  );
}
