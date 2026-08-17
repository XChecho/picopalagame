import { create } from "zustand";

import type { IRoom } from "@core/interfaces/IRoom/IRoom";

interface RoomState {
  currentRoom: IRoom | null;
  matchId: string | null;
  opponent: { id: string; username: string } | null;

  setRoom: (room: IRoom) => void;
  setMatchId: (matchId: string) => void;
  setOpponent: (opponent: { id: string; username: string }) => void;
  clearRoomState: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  matchId: null,
  opponent: null,

  setRoom: (room) => set({ currentRoom: room }),
  setMatchId: (matchId) => set({ matchId }),
  setOpponent: (opponent) => set({ opponent }),
  clearRoomState: () =>
    set({
      currentRoom: null,
      matchId: null,
      opponent: null,
    }),
}));
