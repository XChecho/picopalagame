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

/** Move as returned inside `GET /match/:id` for online matches. */
export interface IOnlineMove extends IMove {
  seat: number | null;
  isAi: boolean;
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
