import React from "react";
import { View, Text } from "react-native";

interface GameStatusBarProps {
  gameMode: string;
  difficulty?: string;
  turnNumber: number;
}

const GameStatusBar = ({
  gameMode,
  difficulty,
  turnNumber,
}: GameStatusBarProps) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-surface rounded-b-2xl border-b border-border/30">
      <View className="flex-1">
        <Text className="text-white font-CairoBold text-base">
          {gameMode}
        </Text>
        {difficulty && (
          <Text className="text-success font-CairoBold text-sm mt-0.5">
            {difficulty}
          </Text>
        )}
      </View>

      <View className="bg-surfaceLight px-4 py-1.5 rounded-full border border-border">
        <Text className="text-white font-CairoBold text-xs tracking-widest uppercase">
          Turn {turnNumber}
        </Text>
      </View>
    </View>
  );
};

export default GameStatusBar;
