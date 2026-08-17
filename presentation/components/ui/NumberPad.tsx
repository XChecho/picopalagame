import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface NumberPadProps {
  selectedDigits: number[];
  onDigitPress: (digit: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled: boolean;
  error?: string | null;
  mode?: "guess" | "secret";
  onClose?: () => void;
}

const NumberPad = ({
  selectedDigits,
  onDigitPress,
  onBackspace,
  onSubmit,
  disabled,
  error,
  mode = "guess",
  onClose,
}: NumberPadProps) => {
  const { t } = useTranslation();

  const handleDigitPress = useCallback(
    (digit: number) => {
      if (selectedDigits.includes(digit)) {
        return;
      }
      onDigitPress(digit);
    },
    [selectedDigits, onDigitPress],
  );

  const submitLabel =
    mode === "secret" ? t("game.confirmNumber") : t("game.submitGuess");

  const isFull = selectedDigits.length >= 4;

  return (
    <View className="bg-surface rounded-t-3xl px-6 pt-4 pb-8 border-t border-border/20">
      {/* Close handle */}
      {onClose && (
        <View className="items-center mb-4">
          <Pressable
            onPress={onClose}
            className="w-10 h-1 rounded-full bg-border/50"
          />
        </View>
      )}

      {/* Active Guess Display */}
      <View className="flex-row justify-center gap-3 mb-6">
        {[0, 1, 2, 3].map((index) => {
          const digit = selectedDigits[index];
          const isActive = index === selectedDigits.length;
          const isFilled = digit !== undefined;

          return (
            <View
              key={`slot-${index}`}
              className={`w-14 h-16 rounded-lg justify-center items-center ${
                isFilled
                  ? "bg-background border-2 border-mainRed"
                  : isActive
                    ? "bg-background border-2 border-mainRed"
                    : "bg-background border border-border"
              }`}
              style={
                isActive
                  ? {
                      shadowColor: "#FF5959",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      elevation: 5,
                    }
                  : undefined
              }
            >
              {isFilled ? (
                <Text className="text-white font-CairoBlack text-2xl">
                  {digit}
                </Text>
              ) : (
                <Text
                  className={`font-CairoBlack text-2xl ${
                    isActive ? "text-white" : "text-textMuted opacity-30"
                  }`}
                >
                  _
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {error && (
        <Text className="text-center text-sm font-CairoSemiBold mb-4 text-error">
          {error}
        </Text>
      )}

      {/* Numpad */}
      <View className="gap-3 mb-6">
        {[0, 1, 2].map((row) => (
          <View key={`row-${row}`} className="flex-row gap-3">
            {DIGITS.slice(row * 3, row * 3 + 3).map((digit) => {
              const isSelected = selectedDigits.includes(digit);
              const isDisabled = isFull && !isSelected;

              return (
                <Pressable
                  key={`digit-${digit}`}
                  onPress={() => handleDigitPress(digit)}
                  disabled={isDisabled}
                  className={`flex-1 h-14 rounded-xl justify-center items-center active:opacity-70 ${
                    isSelected
                      ? "bg-mainRed/20 border border-mainRed/50"
                      : "bg-surfaceLight border border-border/30"
                  }`}
                >
                  <Text
                    className={`font-CairoBold text-2xl ${
                      isSelected
                        ? "text-mainRed/50"
                        : isDisabled
                          ? "text-textMuted"
                          : "text-white"
                    }`}
                  >
                    {digit}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Backspace + Submit */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={onBackspace}
          className="w-[30%] h-14 rounded-xl bg-surfaceLight border border-border/30 justify-center items-center active:opacity-70"
        >
          <Ionicons name="backspace-outline" size={28} color="#FF5959" />
        </Pressable>

        <Pressable
          onPress={onSubmit}
          disabled={disabled}
          className={`flex-1 h-14 rounded-xl justify-center items-center active:opacity-70 ${
            disabled ? "bg-surfaceLight border border-border/30 opacity-50" : "bg-mainRose"
          }`}
        >
          <Text
            className={`font-CairoBold text-base ${
              disabled ? "text-textMuted" : "text-white"
            }`}
          >
            {submitLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NumberPad;
