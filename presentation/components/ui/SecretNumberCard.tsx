import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SecretNumberCardProps {
  number: string;
  title: string;
  hint: string;
}

const SecretNumberCard = ({ number, title, hint }: SecretNumberCardProps) => {
  const [isRevealed, setIsRevealed] = useState(true);

  const digits = number.split("");

  return (
    <View className="mx-6 my-4">
      <Pressable
        onPress={() => setIsRevealed(!isRevealed)}
        className="bg-background rounded-2xl p-6 border border-border"
      >
        <Text className="text-textMuted font-CairoBold text-xs uppercase tracking-wider text-center mb-4">
          {title}
        </Text>

        <View className="flex-row justify-center gap-4 mb-4">
          {digits.map((digit, index) => {
            const isEmpty = digit === "-";
            return (
              <View
                key={`slot-${index}`}
                className="w-12 h-14 bg-surfaceLight rounded-lg border border-border justify-center items-center"
              >
                <Text
                  className={`font-CairoBlack text-2xl transition-opacity ${
                    isRevealed
                      ? isEmpty
                        ? "text-textMuted opacity-30"
                        : "text-mainRed opacity-100"
                      : "text-mainRed opacity-10"
                  }`}
                  style={{
                    filter: isRevealed ? "none" : "blur(4px)",
                  }}
                >
                  {isEmpty ? "_" : digit}
                </Text>
              </View>
            );
          })}
        </View>

        <View className="flex-row items-center justify-center gap-1.5 opacity-70">
          <Ionicons
            name={isRevealed ? "eye-off" : "eye"}
            size={16}
            color="#94959B"
          />
          <Text className="text-textMuted font-CairoRegular text-xs">
            {hint}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SecretNumberCard;
