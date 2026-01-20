import React, { ComponentProps } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  title: string;
  description: string;
  type: "versus" | "private" | "public";
}

const stylesColor = {
  versus: {
    primary: "bg-darkPurple",
    colors: ["#5A189A", "#9D4EDD"],
    icon: "rocket",
  },
  private: {
    primary: "bg-darkRose",
    colors: ["#BC005B", "#FF2E95"],
    icon: "key",
  },
  public: {
    primary: "bg-mainGreen",
    colors: ["#15803D", "#84CC16"],
    icon: "globe-outline",
  },
};

const CardGameModal = ({ title, description, type }: Props) => {
  const handleRedirect = () => { };

  const styleMainContainer = stylesColor[type].primary;
  return (
    <Pressable
      onPress={handleRedirect}
      className={`w-full h-[96px] flex flex-row justify-start items-center rounded-3xl active:opacity-85 mb-4 ${styleMainContainer}`}
    >
      <View className="w-[72px] h-full flex justify-center items-center">
        <Ionicons
          name={
            stylesColor[type].icon as ComponentProps<typeof Ionicons>["name"]
          }
          size={30}
          color="#FFF"
        />
      </View>
      <LinearGradient
        colors={[stylesColor[type].colors[1], stylesColor[type].colors[0]]}
        style={styles.mainContainer}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 1, y: 0.8 }}
      >
        <View className="flex-1 h-full flex flex-col justify-center items-start px-4">
          <Text className="text-2xl text-textMain font-CairoBold ">
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
        {/* <View
          className={`relative flex-1 h-full flex flex-row justify-between items-center px-4 rounded-r-3xl ${styleSecondaryContainer}`}
        ></View> */}
      </LinearGradient>
    </Pressable>
  );
};

export default CardGameModal;

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
