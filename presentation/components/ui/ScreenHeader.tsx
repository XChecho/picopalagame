import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  difficultyBadge?: string;
  turnInfo?: string;
  rightCounter?: { value: string; label: string };
  turnTimer?: { seconds: number; color: string };
}

const ScreenHeader = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  rightElement,
  difficultyBadge,
  turnInfo,
  rightCounter,
  turnTimer,
}: ScreenHeaderProps) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {showBackButton ? (
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 justify-center items-center"
        >
          <View className="w-8 h-8 rounded-full bg-surfaceLight justify-center items-center">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </View>
        </Pressable>
      ) : (
        <View className="w-10" />
      )}

      <View className="flex-1 items-center px-2">
        {difficultyBadge ? (
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-CairoBold text-lg">{title}</Text>
            <View className="bg-mainPurple/30 px-2 py-0.5 rounded-full">
              <Text className="text-mainPurple font-CairoSemiBold text-xs">
                {difficultyBadge}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-white font-CairoBold text-lg text-center">
            {title}
          </Text>
        )}

        {turnInfo ? (
          <Text className="text-textMuted font-CairoSemiBold text-sm text-center mt-0.5">
            {turnInfo}
          </Text>
        ) : (
          subtitle && (
            <Text className="text-textMuted font-CairoRegular text-xs text-center mt-0.5">
              {subtitle}
            </Text>
          )
        )}
      </View>

      {turnTimer ? (
        <View className="w-10 items-end">
          <Text
            className="font-CairoBlack text-2xl"
            style={{ color: turnTimer.color }}
          >
            {turnTimer.seconds}
          </Text>
        </View>
      ) : rightElement ? (
        <View className="w-10">{rightElement}</View>
      ) : rightCounter ? (
        <View className="items-end">
          <Text className="text-white font-CairoBlack text-2xl">
            {rightCounter.value}
          </Text>
          <Text className="text-textMuted font-CairoRegular text-[10px]">
            {rightCounter.label}
          </Text>
        </View>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
};

export default ScreenHeader;
