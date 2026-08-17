import { SecureStorageAdapter } from "@core/adapters/secure-storage.adapter";
import { syncOfflineStatsAction } from "@core/actions/stats/stats-action";
import type { IOfflineStatsEntry } from "@core/interfaces/IGame/IOfflineStats";

const OFFLINE_QUEUE_KEY = "offlineStatsQueue";

export async function getOfflineStatsQueue(): Promise<IOfflineStatsEntry[]> {
  const json = await SecureStorageAdapter.getItem(OFFLINE_QUEUE_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json) as IOfflineStatsEntry[];
  } catch {
    return [];
  }
}

export async function addToOfflineStatsQueue(
  entry: IOfflineStatsEntry,
): Promise<void> {
  const queue = await getOfflineStatsQueue();
  queue.push(entry);
  await SecureStorageAdapter.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export async function clearOfflineStatsQueue(): Promise<void> {
  await SecureStorageAdapter.removeItem(OFFLINE_QUEUE_KEY);
}

export async function syncOfflineStatsQueue(): Promise<void> {
  const queue = await getOfflineStatsQueue();
  if (queue.length === 0) return;

  for (const entry of queue) {
    const wins = entry.result === "win" ? 1 : 0;
    const losses = entry.result === "lose" ? 1 : 0;
    const draws = entry.result === "draw" ? 1 : 0;

    try {
      await syncOfflineStatsAction({
        wins,
        losses,
        draws,
        totalPicos: entry.totalPicos,
        totalPalas: entry.totalPalas,
      });
    } catch {
      return;
    }
  }

  await clearOfflineStatsQueue();
}
