import type { TDifficulty } from "../IMatch/IMatch";

export interface IOfflineStatsEntry {
  result: "win" | "lose" | "draw";
  difficulty: TDifficulty;
  totalPicos: number;
  totalPalas: number;
  turns: number;
  playedAt: string;
}
