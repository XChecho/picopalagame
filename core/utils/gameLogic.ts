import type { IMoveFeedback } from "@core/interfaces/IMove/IMove";
import type { IGuessValidation, ILocalMove } from "@core/interfaces/IGame/IGame";

const ALL_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function generateSecretNumber(): string {
  const digits = [...ALL_DIGITS];
  const selected: number[] = [];

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    selected.push(digits[randomIndex]);
    digits.splice(randomIndex, 1);
  }

  return selected.join("");
}

export function validateGuess(guess: string): IGuessValidation {
  if (guess.length !== 4) {
    return { valid: false, errorCode: "INVALID_LENGTH" };
  }

  if (!/^[1-9]+$/.test(guess)) {
    return { valid: false, errorCode: "INVALID_DIGITS" };
  }

  const uniqueDigits = new Set(guess.split(""));
  if (uniqueDigits.size !== 4) {
    return { valid: false, errorCode: "REPEATED_DIGITS" };
  }

  return { valid: true };
}

export function calculateFeedback(guess: string, secret: string): IMoveFeedback {
  let picos = 0;
  let palas = 0;

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      picos++;
    } else if (secret.includes(guess[i])) {
      palas++;
    }
  }

  return {
    picos,
    palas,
    isWin: picos === 4,
  };
}

export function isGuessRepeated(guess: string, moves: ILocalMove[]): boolean {
  return moves.some((m) => m.guess === guess);
}

export function findPreviousGuessFeedback(
  guess: string,
  moves: ILocalMove[]
): IMoveFeedback | null {
  const move = moves.find((m) => m.guess === guess);
  return move ? move.feedback : null;
}

export function generateEasyAIMove(usedGuesses: string[]): string {
  const usedSet = new Set(usedGuesses);
  let guess: string;
  let attempts = 0;

  do {
    guess = generateSecretNumber();
    attempts++;
  } while (usedSet.has(guess) && attempts < 100);

  return guess;
}

export function generateMediumAIMove(history: ILocalMove[]): string {
  const moves = history.map((m) => ({
    guess: m.guess,
    picos: m.feedback.picos,
    palas: m.feedback.palas,
  }));

  const possibilities = getAllPossibilities();
  const filtered = filterByFeedback(possibilities, moves);

  if (filtered.length === 0) {
    return generateSecretNumber();
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function generateHardAIMove(history: ILocalMove[]): string {
  const moves = history.map((m) => ({
    guess: m.guess,
    picos: m.feedback.picos,
    palas: m.feedback.palas,
  }));

  const possibilities = getAllPossibilities();
  const filtered = filterByFeedback(possibilities, moves);

  if (filtered.length === 0) {
    return generateSecretNumber();
  }

  if (filtered.length === 1) {
    return filtered[0];
  }

  let bestGuess = filtered[0];
  let minMaxRemaining = Infinity;

  const candidates = filtered.length > 50 ? filtered.slice(0, 50) : filtered;

  for (const guess of candidates) {
    let maxRemaining = 0;
    for (const secret of filtered) {
      const feedback = calculateFeedback(guess, secret);
      const remaining = filtered.filter((s) => {
        const f = calculateFeedback(guess, s);
        return f.picos === feedback.picos && f.palas === feedback.palas;
      }).length;
      maxRemaining = Math.max(maxRemaining, remaining);
    }
    if (maxRemaining < minMaxRemaining) {
      minMaxRemaining = maxRemaining;
      bestGuess = guess;
    }
  }

  return bestGuess;
}

function getAllPossibilities(): string[] {
  const possibilities: string[] = [];

  for (const a of ALL_DIGITS) {
    for (const b of ALL_DIGITS) {
      if (b === a) continue;
      for (const c of ALL_DIGITS) {
        if (c === a || c === b) continue;
        for (const d of ALL_DIGITS) {
          if (d === a || d === b || d === c) continue;
          possibilities.push(`${a}${b}${c}${d}`);
        }
      }
    }
  }

  return possibilities;
}

function filterByFeedback(
  possibilities: string[],
  moves: Array<{ guess: string; picos: number; palas: number }>
): string[] {
  return possibilities.filter((secret) =>
    moves.every((move) => {
      const feedback = calculateFeedback(move.guess, secret);
      return feedback.picos === move.picos && feedback.palas === move.palas;
    })
  );
}
