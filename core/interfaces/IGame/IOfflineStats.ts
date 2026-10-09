import type { TDifficulty } from "../IMatch/IMatch";

export type TOfflineResult = "WIN" | "LOSS" | "DRAW";

export interface IOfflineMove {
  // 1 = the human player, 2 = the AI.
  seat: 1 | 2;
  // Per-seat sequence (1..n), not the global turn counter.
  turnNumber: number;
  guess: string;
  picos: number;
  palas: number;
  isWin: boolean;
}

/** A finished local match, in the exact shape `POST /stats/sync` expects. */
export interface IOfflineMatchPayload {
  clientMatchId: string;
  aiDifficulty: TDifficulty;
  result: TOfflineResult;
  attemptsUsed: number;
  maxTurns: number;
  totalPicos: number;
  totalPalas: number;
  durationSec: number;
  finishedAt: string;
  moves: IOfflineMove[];
  playerSecret?: string;
  aiSecret?: string;
}

export interface IOfflineStatsEntry extends IOfflineMatchPayload {
  // Failed sync attempts; the entry is dropped after MAX_SYNC_ATTEMPTS.
  failedAttempts?: number;
}
