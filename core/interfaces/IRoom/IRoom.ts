export interface IRoom {
  id: string;
  code: string;
  type: "PRIVATE" | "GLOBAL";
  hostId: string;
  guestId: string | null;
  matchId: string | null;
  maxTurns: number;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface ICreatePrivateRoomResponse {
  id: string;
  code: string;
  type: "PRIVATE";
  hostId: string;
  maxTurns: number;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface IJoinPrivateRoomRequest {
  code: string;
}

export interface IJoinPrivateRoomResponse {
  room: {
    id: string;
    code: string;
    hostId: string;
    guestId: string;
    status: string;
    matchId: string;
  };
  match: {
    id: string;
    mode: "PRIVATE";
    status: "PLAYING";
    player1Id: string;
    player2Id: string;
    currentTurn: number;
    maxTurns: number;
  };
}

export interface IGlobalQueueResponse {
  status: "queued";
  queuePosition: number;
  estimatedWait: number;
}

/** `GET /room/private/:code` (host or guest only). */
export interface IRoomStatusResponse {
  id: string;
  code: string;
  hostId: string;
  guestId: string | null;
  status: "WAITING" | "IN_GAME" | "CLOSED" | "EXPIRED";
  maxTurns: number;
  expiresAt: string;
  matchId: string | null;
  matchStatus: "WAITING" | "PLAYING" | "FINISHED" | "CANCELLED" | null;
}
