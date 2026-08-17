import React, { useRef } from "react";
import { ScrollView, View, Text } from "react-native";
import { useTranslation } from "react-i18next";

import type { ILocalMove } from "@core/interfaces/IGame/IGame";
import GuessRow from "./GuessRow";

interface GameBoardProps {
  moves: ILocalMove[];
}

const GameBoard = ({ moves }: GameBoardProps) => {
  const { t } = useTranslation();
  const botScrollRef = useRef<ScrollView>(null);
  const playerScrollRef = useRef<ScrollView>(null);

  const movesWithIndex = moves.map((move, index) => ({
    move,
    globalIndex: index,
    gameTurn: Math.floor(index / 2) + 1,
  }));

  const botMoves = movesWithIndex.filter((m) => !m.move.isPlayerMove);
  const playerMoves = movesWithIndex.filter((m) => m.move.isPlayerMove);

  return (
    <View className="h-72 flex-row px-6 gap-3">
      {/* AI Column */}
      <View className="flex-1">
        <Text className="text-[10px] font-CairoBold uppercase tracking-widest text-mainPurple opacity-70 text-center mb-2">
          {t("game.aiHistory")}
        </Text>
        {botMoves.length === 0 ? (
          <View className="flex-1 justify-center items-center px-3">
            <Text className="text-textMuted font-CairoRegular text-xs text-center">
              {t("game.waitingBotMoves")}
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={botScrollRef}
            className="flex-1"
            onContentSizeChange={() =>
              botScrollRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          >
            {botMoves.map(({ move, gameTurn }, index) => (
              <GuessRow
                key={`bot-move-${move.turnNumber}-${index}`}
                move={move}
                isPlayer={false}
                gameTurn={gameTurn}
              />
            ))}
            <View className="h-2" />
          </ScrollView>
        )}
      </View>

      {/* Player Column */}
      <View className="flex-1">
        <Text className="text-[10px] font-CairoBold uppercase tracking-widest text-mainRed opacity-70 text-center mb-2">
          {t("game.yourHistory")}
        </Text>
        {playerMoves.length === 0 ? (
          <View className="flex-1 justify-center items-center px-3">
            <Text className="text-textMuted font-CairoRegular text-xs text-center">
              {t("game.waitingPlayerMoves")}
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={playerScrollRef}
            className="flex-1"
            onContentSizeChange={() =>
              playerScrollRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          >
            {playerMoves.map(({ move, gameTurn }, index) => (
              <GuessRow
                key={`player-move-${move.turnNumber}-${index}`}
                move={move}
                isPlayer={true}
                gameTurn={gameTurn}
              />
            ))}
            <View className="h-2" />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default GameBoard;
