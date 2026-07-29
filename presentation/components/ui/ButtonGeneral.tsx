import React, { ComponentProps } from "react";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface Props {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  type: "primary" | "secondary" | "tertiary" | "disabled";
  icon?: IoniconsName;
}

const stylesButton = {
  primary: ["#FF5959", "#FF2E95"],
  secondary: ["#9D4EDD", "#00D2FF"],
  tertiary: ["#00D2FF", "#A2D729"],
  disabled: ["#4A4D57", "#4A4D57"],
};

const stylesViewButton = {
  primary: "bg-shadowRose h-[86px] active:h-[80px]",
  secondary: "bg-shadowPurple h-[76px] active:h-[70px]",
  tertiary: "bg-shadowGreen h-[76px] active:h-[70px]",
  disabled: "bg-mainBlue",
};

const stylesText = {
  primary: "#FFD600",
  secondary: "#5E35B1",
  tertiary: "#00D729",
  disabled: "#94959B",
};

const ButtonGeneral = ({ label, onPress, loading, type, icon }: Props) => {
  const styleButton = stylesButton[type];
  const styleViewButton = stylesViewButton[type];
  const styleText = stylesText[type];

  return (
    <Pressable
      className={`w-full max-w-[300px] justify-start items-center rounded-2xl ${styleViewButton}`}
      onPress={onPress}
    >
      <LinearGradient
        colors={[styleButton[0], styleButton[1]]}
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          height: type === "primary" ? 80 : 70,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={styleText} />
        ) : (
          <View className="flex flex-row justify-center items-center">
            {icon ? (
              <Ionicons
                name={icon}
                size={type === "primary" ? 30 : 22}
                color="#fff"
                className="mr-2"
              />
            ) : null}
            <Text
              className={`text-xl font-CairoBold text-center pt-2 text-white uppercase`}
            >
              {label}
            </Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default ButtonGeneral;
