import React, { ComponentProps, memo, useCallback } from "react";

import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface StatsCardProps {
  icon: IoniconsName;
  label: string;
  value: string;
  iconColor?: string;
  onPress?: () => void;
}

const StatsCard = memo(function StatsCard({
  icon,
  label,
  value,
  iconColor = "#FFD600",
  onPress,
}: StatsCardProps) {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const content = (
    <View className="flex-1 bg-surface rounded-2xl p-3 items-center justify-center min-h-[90px] mx-1">
      <View className="w-10 h-10 rounded-full bg-surfaceLight items-center justify-center mb-2">
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text className="text-textMuted font-CairoRegular text-xs">{label}</Text>
      <Text className="text-white font-CairoBold text-lg mt-1">{value}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={handlePress} className="flex-1 mx-1">
        {content}
      </Pressable>
    );
  }

  return content;
});

export default StatsCard;
