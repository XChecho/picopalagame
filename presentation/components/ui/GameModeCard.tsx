import React, { ComponentProps, memo, useCallback } from "react";

import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface GameModeCardProps {
  title: string;
  description: string;
  icon: IoniconsName;
  gradientColors: [string, string];
  onPress: () => void;
  size?: "large" | "small";
  difficulty?: string;
}

const GameModeCard = memo(function GameModeCard({
  title,
  description,
  icon,
  gradientColors,
  onPress,
  size = "small",
  difficulty,
}: GameModeCardProps) {
  const isLarge = size === "large";

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      className={`w-full mb-4 active:opacity-90 ${isLarge ? "h-[140px]" : "h-[100px]"}`}
    >
      <LinearGradient
        colors={[gradientColors[1], gradientColors[0]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`w-full h-full rounded-3xl overflow-hidden ${isLarge ? "p-5" : "p-4"}`}
      >
        <View className="flex flex-row h-full items-center">
          {/* Icon Container */}
          <View
            className={`${isLarge ? "w-16 h-16" : "w-12 h-12"} rounded-2xl bg-white/20 justify-center items-center mr-4`}
          >
            <Ionicons
              name={icon}
              size={isLarge ? 32 : 24}
              color="#FFFFFF"
            />
          </View>

          {/* Text Content */}
          <View className="flex-1">
            <Text
              className={`text-white font-CairoBold ${isLarge ? "text-2xl" : "text-lg"}`}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-white/80 font-CairoRegular text-sm mt-1"
              numberOfLines={isLarge ? 2 : 1}
            >
              {description}
            </Text>
            {isLarge && difficulty && (
              <View className="flex flex-row mt-3">
                <View className="bg-white/20 px-3 py-1 rounded-full mr-2">
                  <Text className="text-white text-xs font-CairoSemiBold">{difficulty}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Arrow Icon */}
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#FFFFFF"
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
});

export default GameModeCard;
