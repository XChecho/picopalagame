import React, { useRef } from "react";
import { ScrollView, View, Text } from "react-native";
import { useTranslation } from "react-i18next";

import type { ILocalMove } from "@core/interfaces/IGame/IGame";
import GuessRow from "./GuessRow";

interface GameBoardProps {
  moves: ILocalMove[];
  /** Header of the left column; defaults to the AI history. */
  opponentLabel?: string;
}

const GameBoard = ({ moves, opponentLabel }: GameBoardProps) => {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const movesWithIndex = moves.map((move, index) => ({
    move,
    globalIndex: index,
    gameTurn: Math.floor(index / 2) + 1,
  }));

  const botMoves = movesWithIndex.filter((m) => !m.move.isPlayerMove);
  const playerMoves = movesWithIndex.filter((m) => m.move.isPlayerMove);

  const maxMoves = Math.max(botMoves.length, playerMoves.length);

  return (
    <View className="flex-1 px-6 gap-3">
      {/* Headers */}
      <View className="flex-row">
        <View className="flex-1">
          <Text className="text-[10px] font-CairoBold uppercase tracking-widest text-mainPurple opacity-70 text-center mb-2">
            {opponentLabel ?? t("game.aiHistory")}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[10px] font-CairoBold uppercase tracking-widest text-mainRed opacity-70 text-center mb-2">
            {t("game.yourHistory")}
          </Text>
        </View>
      </View>

      {/* Content */}
      {moves.length === 0 ? (
        <View className="flex-1 justify-center items-center px-3">
          <Text className="text-textMuted font-CairoRegular text-xs text-center">
            {t("game.waitingPlayerMoves")}
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row">
            {/* AI Column */}
            <View className="flex-1">
              {Array.from({ length: maxMoves }).map((_, index) => {
                const botMove = botMoves[index];
                if (!botMove) {
                  return <View key={`bot-empty-${index}`} className="h-20" />;
                }
                return (
                  <GuessRow
                    key={`bot-move-${botMove.move.turnNumber}-${index}`}
                    move={botMove.move}
                    isPlayer={false}
                    gameTurn={botMove.gameTurn}
                  />
                );
              })}
            </View>

            {/* Player Column */}
            <View className="flex-1 ml-3">
              {Array.from({ length: maxMoves }).map((_, index) => {
                const playerMove = playerMoves[index];
                if (!playerMove) {
                  return <View key={`player-empty-${index}`} className="h-20" />;
                }
                return (
                  <GuessRow
                    key={`player-move-${playerMove.move.turnNumber}-${index}`}
                    move={playerMove.move}
                    isPlayer={true}
                    gameTurn={playerMove.gameTurn}
                  />
                );
              })}
            </View>
          </View>
          <View className="h-2" />
        </ScrollView>
      )}
    </View>
  );
};

export default GameBoard;
