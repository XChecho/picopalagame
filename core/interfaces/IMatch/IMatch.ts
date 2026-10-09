import type { IMove, IOnlineMove } from "../IMove/IMove";

export type TGameMode = "VERSUS_AI" | "PRIVATE" | "GLOBAL";
export type TMatchStatus = "WAITING" | "PLAYING" | "FINISHED" | "CANCELLED";
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
  moves?: (IMove | IOnlineMove)[];
  // Present on online matches: seat of the viewer and the server-side clock
  // (secret selection while WAITING, current turn while PLAYING).
  mySeat?: number | null;
  endReason?: string | null;
  participants?: {
    seat: number;
    playerId: string | null;
    isAi: boolean;
    result: TMatchResult | null;
    attemptsUsed: number;
  }[];
  currentSeat?: number | null;
  turnDeadlineAt?: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
}

export type TMatchResult = "WIN" | "LOSS" | "DRAW";

export interface IMatchSummaryParticipant {
  seat: number;
  playerId: string | null;
  isAi: boolean;
  result: TMatchResult | null;
  attemptsUsed: number;
  eloBefore: number | null;
  eloAfter: number | null;
  player: { username: string; avatarUrl: string | null } | null;
}

/** Row of `GET /player/me/matches` (secret numbers are never included). */
export interface IMatchSummary {
  id: string;
  mode: TGameMode;
  status: TMatchStatus;
  endReason: string | null;
  isRanked: boolean;
  maxTurns: number;
  aiDifficulty: TDifficulty | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  participants: IMatchSummaryParticipant[];
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

export interface ISetSecretRequest {
  secret?: string;
  random?: boolean;
}
