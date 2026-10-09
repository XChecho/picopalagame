import {
  calculateFeedback,
  findPreviousGuessFeedback,
  generateEasyAIMove,
  generateHardAIMove,
  generateMediumAIMove,
  generateSecretNumber,
  isGuessRepeated,
  validateGuess,
} from "@core/utils/gameLogic";
import type { ILocalMove } from "@core/interfaces/IGame/IGame";

const makeMove = (guess: string, secret: string): ILocalMove => ({
  guess,
  feedback: calculateFeedback(guess, secret),
  isPlayerMove: true,
}) as ILocalMove;

describe("generateSecretNumber", () => {
  it("returns 4 unique digits between 1 and 9", () => {
    for (let i = 0; i < 200; i++) {
      const secret = generateSecretNumber();
      expect(secret).toMatch(/^[1-9]{4}$/);
      expect(new Set(secret).size).toBe(4);
    }
  });
});

describe("validateGuess", () => {
  it.each([
    ["123", "INVALID_LENGTH"],
    ["12345", "INVALID_LENGTH"],
    ["", "INVALID_LENGTH"],
    ["1230", "INVALID_DIGITS"],
    ["12a4", "INVALID_DIGITS"],
    ["1123", "REPEATED_DIGITS"],
    ["1231", "REPEATED_DIGITS"],
  ])("rejects %p with %s", (guess, errorCode) => {
    expect(validateGuess(guess)).toEqual({ valid: false, errorCode });
  });

  it("accepts 4 unique digits from 1 to 9", () => {
    expect(validateGuess("1234")).toEqual({ valid: true });
    expect(validateGuess("9876")).toEqual({ valid: true });
  });
});

describe("calculateFeedback", () => {
  it.each([
    ["1234", "1234", 4, 0, true],
    ["1234", "4321", 0, 4, false],
    ["1234", "1243", 2, 2, false],
    ["1234", "5678", 0, 0, false],
    ["1234", "1567", 1, 0, false],
    ["1234", "5671", 0, 1, false],
  ])("guess %s vs secret %s => %i picos, %i palas", (guess, secret, picos, palas, isWin) => {
    expect(calculateFeedback(guess, secret)).toEqual({ picos, palas, isWin });
  });
});

describe("guess history helpers", () => {
  const secret = "5678";
  const moves = [makeMove("1234", secret), makeMove("5671", secret)];

  it("detects repeated guesses", () => {
    expect(isGuessRepeated("1234", moves)).toBe(true);
    expect(isGuessRepeated("9999", moves)).toBe(false);
  });

  it("returns the feedback of a previous guess or null", () => {
    expect(findPreviousGuessFeedback("5671", moves)).toEqual(moves[1].feedback);
    expect(findPreviousGuessFeedback("2468", moves)).toBeNull();
  });
});

describe("AI moves", () => {
  it("easy AI never repeats a used guess", () => {
    const used = ["1234", "5678", "9876"];
    for (let i = 0; i < 100; i++) {
      expect(used).not.toContain(generateEasyAIMove(used));
    }
  });

  it.each([
    ["medium", generateMediumAIMove],
    ["hard", generateHardAIMove],
  ])("%s AI only proposes guesses consistent with the feedback so far", (_name, aiMove) => {
    const secret = "7391";
    const history = [makeMove("1234", secret), makeMove("5678", secret)];
    const guess = aiMove(history);
    expect(validateGuess(guess)).toEqual({ valid: true });
    for (const move of history) {
      const f = calculateFeedback(move.guess, guess);
      expect(f.picos).toBe(move.feedback.picos);
      expect(f.palas).toBe(move.feedback.palas);
    }
  });

  it("hard AI solves the secret within a bounded number of turns", () => {
    const secret = "9182";
    // Two opening moves are seeded: the first hard-AI move scans all 3024 candidates and is slow.
    const history: ILocalMove[] = [makeMove("1234", secret), makeMove("5678", secret)];
    let solved = false;
    for (let turn = 0; turn < 10 && !solved; turn++) {
      const guess = generateHardAIMove(history);
      const move = makeMove(guess, secret);
      history.push(move);
      solved = move.feedback.isWin;
    }
    expect(solved).toBe(true);
  });

  it("falls back to a random valid secret when feedback is contradictory", () => {
    const contradictory = [
      { guess: "1234", feedback: { picos: 4, palas: 0, isWin: true } },
      { guess: "1234", feedback: { picos: 0, palas: 0, isWin: false } },
    ] as ILocalMove[];
    expect(validateGuess(generateMediumAIMove(contradictory))).toEqual({ valid: true });
    expect(validateGuess(generateHardAIMove(contradictory))).toEqual({ valid: true });
  });
});
