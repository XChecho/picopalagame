import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface GameHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

const GameHeader = ({
  title = "GAMEPLAY",
  showBackButton = true,
  onBackPress,
  rightElement,
}: GameHeaderProps) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-background">
      {showBackButton ? (
        <Pressable
          onPress={handleBack}
          className="w-11 h-11 justify-center items-start"
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </Pressable>
      ) : (
        <View className="w-11" />
      )}

      <Text className="text-white font-CairoBlack text-2xl uppercase tracking-tight">
        {title}
      </Text>

      {rightElement ? (
        <View className="flex-row items-center gap-2">
          {rightElement}
        </View>
      ) : (
        <View className="w-10 h-10 rounded-full bg-mainRed justify-center items-center">
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

export default GameHeader;
