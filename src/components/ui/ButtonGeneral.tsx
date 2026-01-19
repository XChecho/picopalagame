import React from "react";

import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

interface Props {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  type: "primary" | "secondary" | "tertiary" | "disabled";
}

const stylesButton = {
  primary: ["#FF5959", "#C31432"],
  secondary: ["#43EAFB", "#108DC7"],
  tertiary: ["#9D4EDD", "#5A189A"],
  disabled: "bg-mainBlue",
};

const stylesViewButton = {
  primary: "bg-shadowRed",
  secondary: "bg-seaBlue",
  tertiary: "bg-shadowGreen",
  disabled: "bg-mainBlue",
};

const stylesText = {
  primary: "text-gold",
  secondary: "text-shadowPurple",
  tertiary: "text-cian",
  disabled: "text-softWhite",
};

const ButtonGeneral = ({ label, onPress, loading, type }: Props) => {
  const styleButton = stylesButton[type];
  const styleViewButton = stylesViewButton[type];
  const styleText = stylesText[type];

  return (
    <Pressable
      className={`w-full max-w-[300px] h-[56px] active:h-[50px] justify-start items-center rounded-xl ${styleViewButton}`}
      onPress={onPress}
    >
      <LinearGradient
        colors={[styleButton[0], styleButton[1]]}
        style={styles.mainContainer}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={styleText} />
        ) : (
          <Text
            className={`text-2xl font-CairoSemiBold text-center pt-2 ${styleText}`}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default ButtonGeneral;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
