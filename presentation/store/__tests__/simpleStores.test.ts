import { useRoomStore } from "@presentation/store/useRoomStore";
import { usePlayerStore } from "@presentation/store/usePlayerStore";
import type { IRoom } from "@core/interfaces/IRoom/IRoom";
import type { IPlayer } from "@core/interfaces/IPlayer/IPlayer";
import type { IPlayerStats } from "@core/interfaces/IStats/IStats";
import type { IMatchSummary } from "@core/interfaces/IMatch/IMatch";

describe("useRoomStore", () => {
  it("stores room data and clears it", () => {
    const room = { code: "ABCD" } as unknown as IRoom;
    const store = useRoomStore.getState();

    store.setRoom(room);
    store.setMatchId("m1");
    store.setOpponent({ id: "p2", username: "rival" });
    expect(useRoomStore.getState()).toMatchObject({
      currentRoom: room,
      matchId: "m1",
      opponent: { id: "p2", username: "rival" },
    });

    store.clearRoomState();
    expect(useRoomStore.getState()).toMatchObject({ currentRoom: null, matchId: null, opponent: null });
  });
});

describe("usePlayerStore", () => {
  it("stores player data and clears it", () => {
    const store = usePlayerStore.getState();
    const profile = { id: "p1" } as unknown as IPlayer;
    const stats = { totalMatches: 3 } as unknown as IPlayerStats;
    const matches = [{ id: "m1" }] as unknown as IMatchSummary[];

    store.setProfile(profile);
    store.setStats(stats);
    store.setMatches(matches);
    expect(usePlayerStore.getState()).toMatchObject({ profile, stats, matches });

    store.clearPlayerState();
    expect(usePlayerStore.getState()).toMatchObject({
      profile: null,
      stats: null,
      matches: [],
      isLoading: false,
    });
  });
});
