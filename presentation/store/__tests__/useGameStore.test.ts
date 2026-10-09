import { useGameStore } from "@presentation/store/useGameStore";
import { memoryStore } from "@core/__tests__/memoryStorage";
import type { ILocalMove } from "@core/interfaces/IGame/IGame";

jest.mock("@core/adapters/secure-storage.adapter", () =>
  jest.requireActual("@core/__tests__/memoryStorage").createAdapterMock(),
);

const move: ILocalMove = {
  turnNumber: 1,
  guess: "1234",
  feedback: { picos: 1, palas: 2, isWin: false },
  isPlayerMove: true,
};

const state = () => useGameStore.getState();

beforeEach(() => {
  memoryStore.clear();
  state().resetGame();
});

describe("useGameStore", () => {
  it("initGame starts a playing match with the given attempts", () => {
    state().initGame("VERSUS_AI", "1234", "HARD", 8);

    expect(state()).toMatchObject({
      mode: "VERSUS_AI",
      playerNumber: "1234",
      difficulty: "HARD",
      status: "PLAYING",
      maxAttempts: 8,
      playerAttemptsLeft: 8,
      aiAttemptsLeft: 8,
      currentTurn: 1,
      moves: [],
      matchId: null,
    });
  });

  it("initGame defaults to 12 attempts and no difficulty", () => {
    state().initGame("PRIVATE", "1234");
    expect(state().maxAttempts).toBe(12);
    expect(state().difficulty).toBeNull();
  });

  it("addMove appends and advances the turn", () => {
    state().addMove(move);
    state().addMove({ ...move, turnNumber: 2 });
    expect(state().moves).toHaveLength(2);
    expect(state().currentTurn).toBe(3);
  });

  it("decrements attempts and increments the round", () => {
    state().initGame("VERSUS_AI", "1234", "EASY", 3);
    state().decrementPlayerAttempts();
    state().decrementAIAttempts();
    state().decrementAIAttempts();
    state().incrementRoundNumber();
    expect(state().playerAttemptsLeft).toBe(2);
    expect(state().aiAttemptsLeft).toBe(1);
    expect(state().roundNumber).toBe(2);
  });

  it("resetGame returns to the initial state", () => {
    state().initGame("VERSUS_AI", "1234", "EASY", 3);
    state().addMove(move);
    state().resetGame();
    expect(state()).toMatchObject({
      mode: null,
      status: "WAITING",
      moves: [],
      maxAttempts: 12,
      currentTurn: 1,
    });
  });

  it("saveGameState then loadGameState restores the persisted fields", async () => {
    state().initGame("VERSUS_AI", "5678", "MEDIUM", 6);
    state().setOpponentNumber("1234");
    state().addMove(move);
    await state().saveGameState();

    state().resetGame();
    expect(state().playerNumber).toBeNull();

    await state().loadGameState();
    expect(state()).toMatchObject({
      mode: "VERSUS_AI",
      playerNumber: "5678",
      opponentNumber: "1234",
      difficulty: "MEDIUM",
      maxAttempts: 6,
      currentTurn: 2,
    });
    expect(state().moves).toEqual([move]);
  });

  it("loadGameState ignores corrupt data", async () => {
    memoryStore.set("gameState", "{broken");
    await expect(state().loadGameState()).resolves.toBeUndefined();
    expect(state().mode).toBeNull();
  });

  it("clearGameState resets and removes the persisted state", async () => {
    state().initGame("VERSUS_AI", "1234", "EASY");
    await state().saveGameState();
    await state().clearGameState();
    expect(memoryStore.has("gameState")).toBe(false);
    expect(state().mode).toBeNull();
  });
});
