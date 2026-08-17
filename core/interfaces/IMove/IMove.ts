export interface IMove {
  id: string;
  matchId: string;
  playerId: string | null;
  turnNumber: number;
  guess: string;
  palas: number;
  picos: number;
  isWin: boolean;
  createdAt: string;
}

export interface IMoveFeedback {
  palas: number;
  picos: number;
  isWin: boolean;
}

export interface ISubmitMoveRequest {
  guess: string;
}

export interface ISubmitMoveResponse {
  move: IMove;
  matchStatus: string;
  nextTurn: number;
  aiMove?: {
    guess: string;
    palas: number;
    picos: number;
    isWin: boolean;
  };
}
