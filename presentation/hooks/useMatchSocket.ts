import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { SecureStorageAdapter } from "@core/adapters/secure-storage.adapter";

const API_URL =
  process.env.EXPO_PUBLIC_REACT_API || "http://localhost:4001/api/v1";
// The REST base ends with /api/v1; the socket namespace lives on the origin.
const SOCKET_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, "");

type TMatchSocketEvent =
  | "opponent_ready"
  | "match_started"
  | "opponent_move"
  | "match_finished"
  | "opponent_disconnected"
  | "opponent_reconnected";

interface IUseMatchSocketOptions {
  matchId: string | null;
  /** Called on every server event; the server stays the source of truth. */
  onEvent: (event: TMatchSocketEvent) => void;
  /** Called after every (re)connection, once join_match was sent. */
  onReconnect?: () => void;
}

const EVENTS: TMatchSocketEvent[] = [
  "opponent_ready",
  "match_started",
  "opponent_move",
  "match_finished",
  "opponent_disconnected",
  "opponent_reconnected",
];

/**
 * Keeps a /match socket joined to the room of `matchId`. `join_match` is
 * emitted on every `connect`, which is what clears the server-side
 * disconnect flag after a reload or a network blip.
 */
export function useMatchSocket({
  matchId,
  onEvent,
  onReconnect,
}: IUseMatchSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [opponentOnline, setOpponentOnline] = useState(true);
  const onEventRef = useRef(onEvent);
  const onReconnectRef = useRef(onReconnect);

  useEffect(() => {
    onEventRef.current = onEvent;
    onReconnectRef.current = onReconnect;
  });

  useEffect(() => {
    if (!matchId) return undefined;

    const socket: Socket = io(`${SOCKET_ORIGIN}/match`, {
      transports: ["websocket"],
      reconnection: true,
      // Read the token on each attempt so a refreshed one is picked up.
      auth: (cb) => {
        SecureStorageAdapter.getItem("token").then((token) => cb({ token }));
      },
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_match", { matchId });
      onReconnectRef.current?.();
    });
    socket.on("disconnect", () => setIsConnected(false));

    for (const name of EVENTS) {
      socket.on(name, () => {
        if (name === "opponent_disconnected") setOpponentOnline(false);
        if (name === "opponent_reconnected") setOpponentOnline(true);
        onEventRef.current(name);
      });
    }

    return () => {
      socket.emit("leave_match", { matchId });
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [matchId]);

  return { isConnected, opponentOnline };
}
