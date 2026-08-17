import { create } from "zustand";

import { SecureStorageAdapter } from "@core/adapters/secure-storage.adapter";
import type {
  TGameMode,
  TDifficulty,
  TMatchStatus,
} from "@core/interfaces/IMatch/IMatch";
import type { ILocalMove, TActor } from "@core/interfaces/IGame/IGame";

const GAME_STATE_KEY = "gameState";

interface GameState {
  mode: TGameMode | null;
  playerNumber: string | null;
  opponentNumber: string | null;
  moves: ILocalMove[];
  currentTurn: number;
  status: TMatchStatus;
  difficulty: TDifficulty | null;
  maxAttempts: number;
  playerAttemptsLeft: number;
  aiAttemptsLeft: number;
  roundNumber: number;
  starter: TActor | null;
  currentPlayerTurn: TActor | null;
  matchId: string | null;

  initGame: (
    mode: TGameMode,
    playerNumber: string,
    difficulty?: TDifficulty,
    maxAttempts?: number,
  ) => void;
  addMove: (move: ILocalMove) => void;
  setOpponentNumber: (number: string) => void;
  setStatus: (status: TMatchStatus) => void;
  setMatchId: (matchId: string) => void;
  setStarter: (starter: TActor) => void;
  setCurrentPlayerTurn: (actor: TActor) => void;
  decrementPlayerAttempts: () => void;
  decrementAIAttempts: () => void;
  incrementRoundNumber: () => void;
  resetGame: () => void;
  clearGameState: () => Promise<void>;
  loadGameState: () => Promise<void>;
  saveGameState: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  mode: null,
  playerNumber: null,
  opponentNumber: null,
  moves: [],
  currentTurn: 1,
  status: "WAITING" as TMatchStatus,
  difficulty: null,
  maxAttempts: 12,
  playerAttemptsLeft: 12,
  aiAttemptsLeft: 12,
  roundNumber: 1,
  starter: null,
  currentPlayerTurn: null,
  matchId: null,

  initGame: (mode, playerNumber, difficulty, maxAttempts = 12) =>
    set({
      mode,
      playerNumber,
      difficulty: difficulty ?? null,
      maxAttempts,
      opponentNumber: null,
      moves: [],
      currentTurn: 1,
      status: "PLAYING",
      matchId: null,
      playerAttemptsLeft: maxAttempts,
      aiAttemptsLeft: maxAttempts,
      roundNumber: 1,
      starter: null,
      currentPlayerTurn: null,
    }),

  addMove: (move) =>
    set((state) => ({
      moves: [...state.moves, move],
      currentTurn: state.currentTurn + 1,
    })),

  setOpponentNumber: (number) => set({ opponentNumber: number }),
  setStatus: (status) => set({ status }),
  setMatchId: (matchId) => set({ matchId }),
  setStarter: (starter) => set({ starter }),
  setCurrentPlayerTurn: (actor) => set({ currentPlayerTurn: actor }),
  decrementPlayerAttempts: () =>
    set((state) => ({ playerAttemptsLeft: state.playerAttemptsLeft - 1 })),
  decrementAIAttempts: () =>
    set((state) => ({ aiAttemptsLeft: state.aiAttemptsLeft - 1 })),
  incrementRoundNumber: () =>
    set((state) => ({ roundNumber: state.roundNumber + 1 })),

  resetGame: () =>
    set({
      mode: null,
      playerNumber: null,
      opponentNumber: null,
      moves: [],
      currentTurn: 1,
      status: "WAITING",
      difficulty: null,
      maxAttempts: 12,
      playerAttemptsLeft: 12,
      aiAttemptsLeft: 12,
      roundNumber: 1,
      starter: null,
      currentPlayerTurn: null,
      matchId: null,
    }),

  clearGameState: async () => {
    get().resetGame();
    await SecureStorageAdapter.removeItem(GAME_STATE_KEY);
  },

  loadGameState: async () => {
    const json = await SecureStorageAdapter.getItem(GAME_STATE_KEY);
    if (json) {
      try {
        const state = JSON.parse(json);
        set(state);
      } catch {
        return;
      }
    }
  },

  saveGameState: async () => {
    const {
      mode,
      playerNumber,
      opponentNumber,
      moves,
      currentTurn,
      status,
      difficulty,
      maxAttempts,
      playerAttemptsLeft,
      aiAttemptsLeft,
      roundNumber,
      starter,
      currentPlayerTurn,
      matchId,
    } = get();
    const state = {
      mode,
      playerNumber,
      opponentNumber,
      moves,
      currentTurn,
      status,
      difficulty,
      maxAttempts,
      playerAttemptsLeft,
      aiAttemptsLeft,
      roundNumber,
      starter,
      currentPlayerTurn,
      matchId,
    };
    await SecureStorageAdapter.setItem(GAME_STATE_KEY, JSON.stringify(state));
  },
}));
