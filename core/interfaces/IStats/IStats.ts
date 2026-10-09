import type { IOfflineMatchPayload } from "../IGame/IOfflineStats";

export interface IPlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  // Fewest attempts needed to win; null until the first win.
  bestAttempts: number | null;
  totalAttempts: number;
  totalPicos: number;
  totalPalas: number;
  totalDurationSec: number;
  avgTimePerGame: number;
}

export interface ISyncStatsRequest {
  matches: IOfflineMatchPayload[];
}
