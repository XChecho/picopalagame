import { SecureStorageAdapter } from "@core/adapters/secure-storage.adapter";
import { syncOfflineStatsAction } from "@core/actions/stats/stats-action";
import { generateUuidV4 } from "@core/utils/uuid";
import type {
  IOfflineMove,
  IOfflineStatsEntry,
  TOfflineResult,
} from "@core/interfaces/IGame/IOfflineStats";
import type { ILocalMove } from "@core/interfaces/IGame/IGame";
import type { TDifficulty } from "@core/interfaces/IMatch/IMatch";

const OFFLINE_QUEUE_KEY = "offlineStatsQueue";
const MAX_SYNC_ATTEMPTS = 5;

let syncInFlight: Promise<void> | null = null;

interface IBuildEntryInput {
  result: "win" | "lose" | "draw";
  difficulty: TDifficulty;
  maxTurns: number;
  moves: ILocalMove[];
  startedAt: number;
  playerSecret: string | null;
  aiSecret: string | null;
}

const RESULT_MAP: Record<IBuildEntryInput["result"], TOfflineResult> = {
  win: "WIN",
  lose: "LOSS",
  draw: "DRAW",
};

/** Turns the in-memory game state into the sync payload (and the replay history). */
export function buildOfflineEntry(input: IBuildEntryInput): IOfflineStatsEntry {
  const sequence = { 1: 0, 2: 0 };
  const moves: IOfflineMove[] = input.moves.map((move) => {
    const seat = move.isPlayerMove ? 1 : 2;
    sequence[seat] += 1;
    return {
      seat,
      turnNumber: sequence[seat],
      guess: move.guess,
      picos: move.feedback.picos,
      palas: move.feedback.palas,
      isWin: move.feedback.isWin,
    };
  });

  const finishedAt = Date.now();
  return {
    clientMatchId: generateUuidV4(),
    aiDifficulty: input.difficulty,
    result: RESULT_MAP[input.result],
    attemptsUsed: sequence[1],
    maxTurns: input.maxTurns,
    totalPicos: moves.reduce((sum, m) => sum + m.picos, 0),
    totalPalas: moves.reduce((sum, m) => sum + m.palas, 0),
    durationSec: Math.min(
      86_400,
      Math.max(0, Math.round((finishedAt - input.startedAt) / 1000)),
    ),
    finishedAt: new Date(finishedAt).toISOString(),
    moves,
    ...(input.playerSecret && { playerSecret: input.playerSecret }),
    ...(input.aiSecret && { aiSecret: input.aiSecret }),
  };
}

export async function getOfflineStatsQueue(): Promise<IOfflineStatsEntry[]> {
  const json = await SecureStorageAdapter.getItem(OFFLINE_QUEUE_KEY);
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    // Entries written before the history rollout never matched the API contract.
    return Array.isArray(parsed)
      ? (parsed as IOfflineStatsEntry[]).filter((e) => Boolean(e?.clientMatchId))
      : [];
  } catch {
    return [];
  }
}

async function saveQueue(queue: IOfflineStatsEntry[]): Promise<void> {
  if (queue.length === 0) {
    await SecureStorageAdapter.removeItem(OFFLINE_QUEUE_KEY);
    return;
  }
  await SecureStorageAdapter.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export async function addToOfflineStatsQueue(
  entry: IOfflineStatsEntry,
): Promise<void> {
  const queue = await getOfflineStatsQueue();
  queue.push(entry);
  await saveQueue(queue);
}

export async function clearOfflineStatsQueue(): Promise<void> {
  await SecureStorageAdapter.removeItem(OFFLINE_QUEUE_KEY);
}

async function runSync(): Promise<void> {
  const snapshot = await getOfflineStatsQueue();
  if (snapshot.length === 0) return;

  const removed = new Set<string>();
  const failed = new Map<string, number>();

  for (const entry of snapshot) {
    const { failedAttempts = 0, ...payload } = entry;
    try {
      // The endpoint is idempotent on clientMatchId, so a retry never double-counts.
      await syncOfflineStatsAction({ matches: [payload] });
      removed.add(entry.clientMatchId);
    } catch {
      const attempts = failedAttempts + 1;
      if (attempts >= MAX_SYNC_ATTEMPTS) {
        removed.add(entry.clientMatchId);
      } else {
        failed.set(entry.clientMatchId, attempts);
      }
      // Likely offline or unauthenticated: keep order and retry later.
      break;
    }
  }

  // Re-read so matches finished while syncing are not overwritten.
  const latest = await getOfflineStatsQueue();
  await saveQueue(
    latest
      .filter((e) => !removed.has(e.clientMatchId))
      .map((e) =>
        failed.has(e.clientMatchId)
          ? { ...e, failedAttempts: failed.get(e.clientMatchId) }
          : e,
      ),
  );
}

/** Flushes queued matches; concurrent callers share one run. Never throws. */
export function syncOfflineStatsQueue(): Promise<void> {
  if (!syncInFlight) {
    syncInFlight = runSync()
      .catch(() => undefined)
      .finally(() => {
        syncInFlight = null;
      });
  }
  return syncInFlight;
}
