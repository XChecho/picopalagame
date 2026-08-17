import type { IMove } from "../IMove/IMove";

export type TGameMode = "VERSUS_AI" | "PRIVATE" | "GLOBAL";
export type TMatchStatus = "WAITING" | "PLAYING" | "FINISHED";
export type TDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface IMatch {
  id: string;
  mode: TGameMode;
  status: TMatchStatus;
  player1Id: string;
  player2Id: string | null;
  player1Number?: string;
  player2Number?: string;
  currentTurn: number;
  turnCount: number;
  maxTurns: number;
  winnerId: string | null;
  aiDifficulty: TDifficulty | null;
  moves?: IMove[];
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
}

export interface IMatchSummary {
  id: string;
  mode: TGameMode;
  status: TMatchStatus;
  winnerId: string | null;
  turnCount: number;
  startedAt: string;
  finishedAt: string | null;
}

export interface IMatchHistoryResponse {
  matches: IMatchSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface ICreateMatchRequest {
  mode: TGameMode;
  aiDifficulty?: TDifficulty;
  maxTurns?: number;
}
