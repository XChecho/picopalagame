import React, { ComponentProps } from "react";
import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toggle from "./Toggle";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface SettingRowProps {
  icon?: IoniconsName;
  iconColor?: string;
  title: string;
  description?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  simple?: boolean;
  rightValue?: string;
}

const SettingRow = ({
  icon,
  iconColor = "#9D4EDD",
  title,
  description,
  hasToggle = false,
  toggleValue = false,
  onToggleChange,
  onPress,
  showChevron = false,
  simple = false,
  rightValue,
}: SettingRowProps) => {
  const content = simple ? (
    <View className="flex-row items-center justify-between py-3 px-4">
      <Text className="text-white font-CairoRegular text-base">{title}</Text>
      {rightValue && (
        <Text className="text-textMuted font-CairoRegular text-base">
          {rightValue}
        </Text>
      )}
    </View>
  ) : (
    <View className="flex-row items-center py-3 px-4">
      {icon && (
        <View className="w-10 h-10 rounded-xl bg-surfaceLight justify-center items-center mr-3">
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
      )}

      <View className="flex-1">
        <Text className="text-white font-CairoSemiBold text-base">{title}</Text>
        {description && (
          <Text className="text-textMuted font-CairoRegular text-xs mt-0.5">
            {description}
          </Text>
        )}
      </View>

      {hasToggle && onToggleChange && (
        <Toggle value={toggleValue} onValueChange={onToggleChange} />
      )}

      {showChevron && !hasToggle && (
        <Ionicons name="chevron-forward" size={20} color="#94959B" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    );
  }

  return content;
};

export default SettingRow;
