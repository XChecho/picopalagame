import {
  addToOfflineStatsQueue,
  buildOfflineEntry,
  clearOfflineStatsQueue,
  getOfflineStatsQueue,
  syncOfflineStatsQueue,
} from "@core/utils/offlineStatsQueue";
import { syncOfflineStatsAction } from "@core/actions/stats/stats-action";
import type { IOfflineStatsEntry } from "@core/interfaces/IGame/IOfflineStats";
import type { ILocalMove } from "@core/interfaces/IGame/IGame";

const mockStore = new Map<string, string>();

jest.mock("@core/adapters/secure-storage.adapter", () => ({
  SecureStorageAdapter: {
    getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockStore.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      mockStore.delete(key);
    }),
  },
}));

jest.mock("@core/actions/stats/stats-action", () => ({
  syncOfflineStatsAction: jest.fn(),
}));

const syncMock = syncOfflineStatsAction as jest.Mock;

const entry = (id: string, extra: Partial<IOfflineStatsEntry> = {}): IOfflineStatsEntry => ({
  clientMatchId: id,
  aiDifficulty: "EASY",
  result: "WIN",
  attemptsUsed: 1,
  maxTurns: 10,
  totalPicos: 4,
  totalPalas: 0,
  durationSec: 5,
  finishedAt: "2026-10-09T00:00:00.000Z",
  moves: [],
  ...extra,
});

const move = (guess: string, isPlayerMove: boolean, picos: number, palas: number): ILocalMove => ({
  turnNumber: 0,
  guess,
  feedback: { picos, palas, isWin: picos === 4 },
  isPlayerMove,
});

beforeEach(() => {
  mockStore.clear();
  syncMock.mockReset();
});

describe("buildOfflineEntry", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-09T12:00:10.000Z"));
  });
  afterEach(() => jest.useRealTimers());

  const base = {
    difficulty: "MEDIUM" as const,
    maxTurns: 10,
    startedAt: new Date("2026-10-09T12:00:00.000Z").getTime(),
    playerSecret: "1234",
    aiSecret: "5678",
  };

  it("numbers moves per seat and maps the result", () => {
    const result = buildOfflineEntry({
      ...base,
      result: "lose",
      moves: [
        move("5678", true, 4, 0),
        move("1111", false, 1, 0),
        move("2222", true, 0, 1),
      ],
    });

    expect(result.result).toBe("LOSS");
    expect(result.aiDifficulty).toBe("MEDIUM");
    expect(result.attemptsUsed).toBe(2);
    expect(result.moves.map((m) => [m.seat, m.turnNumber])).toEqual([
      [1, 1],
      [2, 1],
      [1, 2],
    ]);
    expect(result.totalPicos).toBe(5);
    expect(result.totalPalas).toBe(1);
    expect(result.durationSec).toBe(10);
    expect(result.finishedAt).toBe("2026-10-09T12:00:10.000Z");
    expect(result.playerSecret).toBe("1234");
    expect(result.aiSecret).toBe("5678");
    expect(result.clientMatchId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("omits secrets that are not known and clamps the duration", () => {
    const result = buildOfflineEntry({
      ...base,
      result: "win",
      moves: [],
      playerSecret: null,
      aiSecret: null,
      startedAt: new Date("2026-10-07T00:00:00.000Z").getTime(),
    });

    expect(result).not.toHaveProperty("playerSecret");
    expect(result).not.toHaveProperty("aiSecret");
    expect(result.durationSec).toBe(86_400);
  });
});

describe("offline queue storage", () => {
  it("adds, reads and clears entries", async () => {
    await addToOfflineStatsQueue(entry("a"));
    await addToOfflineStatsQueue(entry("b"));
    expect((await getOfflineStatsQueue()).map((e) => e.clientMatchId)).toEqual(["a", "b"]);

    await clearOfflineStatsQueue();
    expect(await getOfflineStatsQueue()).toEqual([]);
  });

  it("ignores corrupt JSON and legacy entries without clientMatchId", async () => {
    mockStore.set("offlineStatsQueue", "{not json");
    expect(await getOfflineStatsQueue()).toEqual([]);

    mockStore.set("offlineStatsQueue", JSON.stringify([{ legacy: true }, entry("ok")]));
    expect((await getOfflineStatsQueue()).map((e) => e.clientMatchId)).toEqual(["ok"]);
  });
});

describe("syncOfflineStatsQueue", () => {
  it("sends every entry in order and empties the queue", async () => {
    await addToOfflineStatsQueue(entry("a"));
    await addToOfflineStatsQueue(entry("b"));
    syncMock.mockResolvedValue(undefined);

    await syncOfflineStatsQueue();

    expect(syncMock.mock.calls.map(([arg]) => arg.matches[0].clientMatchId)).toEqual(["a", "b"]);
    expect(await getOfflineStatsQueue()).toEqual([]);
  });

  it("strips failedAttempts from the payload", async () => {
    await addToOfflineStatsQueue(entry("a", { failedAttempts: 2 }));
    syncMock.mockResolvedValue(undefined);

    await syncOfflineStatsQueue();

    expect(syncMock.mock.calls[0][0].matches[0]).not.toHaveProperty("failedAttempts");
  });

  it("stops at the first failure, keeps order and counts the attempt", async () => {
    await addToOfflineStatsQueue(entry("a"));
    await addToOfflineStatsQueue(entry("b"));
    syncMock.mockRejectedValue(new Error("offline"));

    await syncOfflineStatsQueue();

    expect(syncMock).toHaveBeenCalledTimes(1);
    const queue = await getOfflineStatsQueue();
    expect(queue.map((e) => [e.clientMatchId, e.failedAttempts])).toEqual([
      ["a", 1],
      ["b", undefined],
    ]);
  });

  it("drops an entry after 5 failed attempts", async () => {
    await addToOfflineStatsQueue(entry("a", { failedAttempts: 4 }));
    await addToOfflineStatsQueue(entry("b"));
    syncMock.mockRejectedValue(new Error("bad payload"));

    await syncOfflineStatsQueue();

    expect((await getOfflineStatsQueue()).map((e) => e.clientMatchId)).toEqual(["b"]);
  });

  it("shares a single run between concurrent callers", async () => {
    await addToOfflineStatsQueue(entry("a"));
    syncMock.mockResolvedValue(undefined);

    await Promise.all([syncOfflineStatsQueue(), syncOfflineStatsQueue(), syncOfflineStatsQueue()]);

    expect(syncMock).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the queue is empty", async () => {
    await syncOfflineStatsQueue();
    expect(syncMock).not.toHaveBeenCalled();
  });
});
