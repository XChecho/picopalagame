import { create } from "zustand";

import type { IPlayer } from "@core/interfaces/IPlayer/IPlayer";
import type { IPlayerStats } from "@core/interfaces/IStats/IStats";
import type { IMatchSummary } from "@core/interfaces/IMatch/IMatch";

interface PlayerState {
  profile: IPlayer | null;
  stats: IPlayerStats | null;
  matches: IMatchSummary[];
  isLoading: boolean;

  setProfile: (profile: IPlayer) => void;
  setStats: (stats: IPlayerStats) => void;
  setMatches: (matches: IMatchSummary[]) => void;
  clearPlayerState: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  profile: null,
  stats: null,
  matches: [],
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  setStats: (stats) => set({ stats }),
  setMatches: (matches) => set({ matches }),
  clearPlayerState: () =>
    set({
      profile: null,
      stats: null,
      matches: [],
      isLoading: false,
    }),
}));
