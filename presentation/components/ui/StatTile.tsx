import React from "react";
import { View, Text } from "react-native";

interface StatTileProps {
  icon?: string;
  value: string | number;
  label: string;
  color?: string;
  size?: "small" | "large";
}

const StatTile = ({
  icon,
  value,
  label,
  color = "#FFD600",
  size = "small",
}: StatTileProps) => {
  const isLarge = size === "large";

  return (
    <View
      className={`bg-surface rounded-2xl p-4 ${
        isLarge ? "flex-1 min-h-[120px]" : "flex-1 min-h-[90px]"
      }`}
    >
      {icon && <Text className="text-2xl mb-2">{icon}</Text>}
      <Text
        className={`font-CairoBold ${
          isLarge ? "text-3xl" : "text-2xl"
        } mb-1`}
        style={{ color }}
      >
        {String(value)}
      </Text>
      <Text className="text-textMuted font-CairoRegular text-xs">{label}</Text>
    </View>
  );
};

export default StatTile;
