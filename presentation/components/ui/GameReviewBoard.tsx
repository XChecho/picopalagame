import React from "react";
import { View, Text } from "react-native";

import type { ILocalMove } from "@core/interfaces/IGame/IGame";
import ReviewGuessRow from "./ReviewGuessRow";

interface GameReviewBoardProps {
  moves: ILocalMove[];
  playerSecret: string;
  opponentSecret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

interface RoundData {
  gameTurn: number;
  playerMove?: ILocalMove;
  opponentMove?: ILocalMove;
}

const GameReviewBoard = ({ moves, playerSecret, opponentSecret, t }: GameReviewBoardProps) => {
  const rounds: RoundData[] = [];

  moves.forEach((move, index) => {
    const gameTurn = Math.floor(index / 2) + 1;
    const existingRound = rounds.find((r) => r.gameTurn === gameTurn);

    if (existingRound) {
      if (move.isPlayerMove) {
        existingRound.playerMove = move;
      } else {
        existingRound.opponentMove = move;
      }
    } else {
      rounds.push({
        gameTurn,
        playerMove: move.isPlayerMove ? move : undefined,
        opponentMove: !move.isPlayerMove ? move : undefined,
      });
    }
  });

  return (
    <View className="px-6">
      <Text className="text-[10px] font-CairoBold uppercase tracking-widest text-textMuted opacity-70 text-center mb-3">
        {t("game.reviewHistory")}
      </Text>
      <View className="pb-5">
        {rounds.map((round) => (
          <ReviewGuessRow
            key={`review-round-${round.gameTurn}`}
            round={round}
            playerSecret={playerSecret}
            opponentSecret={opponentSecret}
            t={t}
          />
        ))}
      </View>
    </View>
  );
};

export default GameReviewBoard;
