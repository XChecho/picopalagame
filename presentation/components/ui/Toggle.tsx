import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ value, onValueChange, disabled = false }: ToggleProps) => {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      className={`w-12 h-7 rounded-full justify-center px-1 ${
        value ? "" : "bg-border"
      } ${disabled ? "opacity-50" : ""}`}
    >
      {value ? (
        <LinearGradient
          colors={["#00D2FF", "#0099FF"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View
            className={`w-5 h-5 rounded-full bg-white shadow-sm ${
              value ? "self-end" : "self-start"
            }`}
          />
        </LinearGradient>
      ) : (
        <View
          className={`w-5 h-5 rounded-full bg-white shadow-sm ${
            value ? "self-end" : "self-start"
          }`}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 9999,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
});

export default Toggle;
