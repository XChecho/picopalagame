import React from "react";
import { View, Text } from "react-native";

import type { ILocalMove } from "@core/interfaces/IGame/IGame";

interface RoundData {
  gameTurn: number;
  playerMove?: ILocalMove;
  opponentMove?: ILocalMove;
}

interface ReviewGuessRowProps {
  round: RoundData;
  playerSecret: string;
  opponentSecret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

const getDigitHighlight = (digit: string, secret: string, index: number): string => {
  if (digit === secret[index]) {
    return "bg-success border-success";
  }
  if (secret.includes(digit)) {
    return "bg-gold border-gold";
  }
  return "bg-background border-border/30";
};

const getDigitTextColor = (digit: string, secret: string, index: number): string => {
  if (digit === secret[index]) {
    return "text-background";
  }
  if (secret.includes(digit)) {
    return "text-background";
  }
  return "text-white";
};

const GuessDisplay = ({
  move,
  secret,
  actor,
  t,
}: {
  move: ILocalMove;
  secret: string;
  actor: "player" | "opponent";
  t: any;
}) => {
  const { guess, feedback } = move;
  const digits = guess.split("");
  const actorLabel = actor === "player" ? t("game.you") : t("game.bot");
  const actorColor = actor === "player" ? "text-mainRed" : "text-mainPurple";

  return (
    <View className="flex-1 bg-surfaceLight rounded-xl border border-border/30 p-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`font-CairoBold text-xs ${actorColor}`}>
          {actorLabel}
        </Text>
        <View className="flex-row gap-1.5">
          <View className="px-2 py-0.5 bg-success/20 rounded-full border border-success/30">
            <Text className="text-success text-[10px] font-CairoBold">
              {feedback.picos}F
            </Text>
          </View>
          <View className="px-2 py-0.5 bg-gold/20 rounded-full border border-gold/30">
            <Text className="text-gold text-[10px] font-CairoBold">
              {feedback.palas}P
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-center gap-1.5">
        {digits.map((digit, index) => {
          const highlight = getDigitHighlight(digit, secret, index);
          const textColor = getDigitTextColor(digit, secret, index);
          return (
            <View
              key={`digit-${index}`}
              className={`w-8 h-9 rounded-md border justify-center items-center ${highlight}`}
            >
              <Text className={`text-lg font-CairoBold ${textColor}`}>
                {digit}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const ReviewGuessRow = ({ round, playerSecret, opponentSecret, t }: ReviewGuessRowProps) => {
  const { gameTurn, playerMove, opponentMove } = round;

  return (
    <View className="mb-3">
      <Text className="text-textMuted font-CairoBold text-xs text-center mb-2">
        {t("game.round")} {gameTurn}
      </Text>
      <View className="flex-row gap-2">
        {playerMove && (
          <GuessDisplay
            move={playerMove}
            secret={opponentSecret}
            actor="player"
            t={t}
          />
        )}
        {opponentMove && (
          <GuessDisplay
            move={opponentMove}
            secret={playerSecret}
            actor="opponent"
            t={t}
          />
        )}
      </View>
    </View>
  );
};

export default ReviewGuessRow;
