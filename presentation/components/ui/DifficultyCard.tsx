import React, { ComponentProps } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  leftColor: string;
  gradientColors: [string, string];
  onPress: () => void;
}

const DifficultyCard = ({
  title,
  description,
  icon,
  leftColor,
  gradientColors,
  onPress,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-full h-[96px] flex flex-row justify-start items-center rounded-3xl active:opacity-85 mb-4"
      style={{ backgroundColor: leftColor }}
    >
      <View className="w-[72px] h-full flex justify-center items-center">
        <Ionicons name={icon} size={30} color="#FFF" />
      </View>
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1]]}
        style={styles.mainContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
      >
        <View className="flex-1 h-full flex flex-col justify-center items-start px-4">
          <Text className="text-2xl text-textMain font-CairoBold">
            {title}
          </Text>
          <Text className="w-2/3 text-base text-textMain font-CairoRegular">
            {description}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={30}
          color="#FFF"
          className="absolute right-2"
        />
      </LinearGradient>
    </Pressable>
  );
};

export default DifficultyCard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderEndEndRadius: 24,
    borderStartEndRadius: 24,
  },
});
