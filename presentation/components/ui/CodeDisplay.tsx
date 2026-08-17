import React from "react";
import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface CodeDisplayProps {
  code: string;
  onCopy?: () => void;
}

const CodeDisplay = ({ code, onCopy }: CodeDisplayProps) => {
  const characters = code.split("");

  return (
    <View className="flex-row items-center justify-center gap-2">
      {characters.map((char, index) => (
        <View
          key={`char-${index}`}
          className="w-12 h-14 rounded-xl bg-background border-2 border-border justify-center items-center"
        >
          <Text className="text-white font-CairoBlack text-xl">{char}</Text>
        </View>
      ))}

      {onCopy && (
        <Pressable
          onPress={onCopy}
          className="w-12 h-14 rounded-xl bg-surfaceLight justify-center items-center active:opacity-70"
        >
          <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
};

export default CodeDisplay;
