import React from "react";
import { View, Text } from "react-native";

import type { ILocalMove } from "@core/interfaces/IGame/IGame";

interface GuessRowProps {
  move: ILocalMove;
  isPlayer: boolean;
  gameTurn: number;
}

const GuessRow = ({ move, isPlayer, gameTurn }: GuessRowProps) => {
  const { guess, feedback } = move;
  const digits = guess.split("");

  return (
    <View className={`mb-3 bg-surfaceLight rounded-xl border border-border/30 p-3`}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-textMuted font-CairoBold text-xs">
          T{gameTurn}
        </Text>
        <View className="flex-row gap-2">
          <View className="px-2 py-1 bg-success/20 rounded-full border border-success/30">
            <Text className="text-success text-xs font-CairoBold">
              {feedback.picos}F
            </Text>
          </View>
          <View className="px-2 py-1 bg-gold/20 rounded-full border border-gold/30">
            <Text className="text-gold text-xs font-CairoBold">
              {feedback.palas}P
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-center gap-2">
        {digits.map((digit, index) => (
          <View
            key={`digit-${index}`}
            className="w-9 h-10 bg-background rounded-md border border-border/30 justify-center items-center"
          >
            <Text className="text-white text-xl font-CairoBold">
              {digit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GuessRow;
