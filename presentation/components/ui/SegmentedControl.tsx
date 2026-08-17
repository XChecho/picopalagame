import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const SegmentedControl = ({
  options,
  selectedValue,
  onValueChange,
}: SegmentedControlProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
    >
      <View className="flex-row gap-2 px-4 py-2">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <Pressable
              key={option.value}
              onPress={() => onValueChange(option.value)}
              className={`px-4 py-2 rounded-full ${
                isSelected
                  ? "bg-mainPurple"
                  : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-CairoSemiBold text-sm ${
                  isSelected ? "text-white" : "text-textMuted"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default SegmentedControl;
