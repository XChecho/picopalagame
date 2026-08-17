import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  wins: number;
  winRate: string;
  avatarLetter: string;
  avatarColor: string;
}

const LeaderboardRow = ({
  rank,
  name,
  wins,
  winRate,
  avatarLetter,
  avatarColor,
}: LeaderboardRowProps) => {
  const { t } = useTranslation();

  const getRankColor = () => {
    if (rank === 1) return "text-gold";
    if (rank === 2) return "text-white";
    if (rank === 3) return "text-mainRed";
    return "text-textMuted";
  };

  const rankColorClass = getRankColor();

  return (
    <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 mb-2">
      <Text className={`w-8 text-center font-CairoBlack text-lg ${rankColorClass}`}>
        {rank}
      </Text>

      <View
        className="w-10 h-10 rounded-full justify-center items-center mr-3"
        style={{ backgroundColor: avatarColor }}
      >
        <Text className="text-white font-CairoBold text-sm">
          {avatarLetter}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-white font-CairoSemiBold text-sm">{name}</Text>
        <Text className="text-textMuted font-CairoRegular text-xs">
          {wins} {t("record.wins").toLowerCase()}
        </Text>
      </View>

      <Text className={`font-CairoBold text-base ${rankColorClass}`}>
        {winRate}
      </Text>
    </View>
  );
};

export default LeaderboardRow;
