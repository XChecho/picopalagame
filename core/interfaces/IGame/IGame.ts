import { TGameMode, TDifficulty, TMatchStatus } from "../IMatch/IMatch";
import { IMoveFeedback } from "../IMove/IMove";

export type TActor = "PLAYER" | "AI";

export interface IGameState {
  mode: TGameMode;
  playerNumber: string;
  opponentNumber: string | null;
  moves: ILocalMove[];
  currentTurn: number;
  status: TMatchStatus;
  difficulty: TDifficulty | null;
  maxAttempts: number;
  playerAttemptsLeft: number;
  aiAttemptsLeft: number;
  roundNumber: number;
  starter: TActor;
  currentPlayerTurn: TActor;
}

export interface ILocalMove {
  turnNumber: number;
  guess: string;
  feedback: IMoveFeedback;
  isPlayerMove: boolean;
}

export interface IGuessValidation {
  valid: boolean;
  errorCode?: string;
}
