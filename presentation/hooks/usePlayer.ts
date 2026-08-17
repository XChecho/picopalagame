import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getPlayerProfileAction,
  getPlayerStatsAction,
  getPlayerMatchesAction,
  updatePlayerProfileAction,
  updatePushTokenAction,
} from "@core/actions/player/player-action";

export function usePlayerProfile() {
  return useQuery({
    queryKey: ["playerProfile"],
    queryFn: getPlayerProfileAction,
  });
}

export function usePlayerStats() {
  return useQuery({
    queryKey: ["playerStats"],
    queryFn: getPlayerStatsAction,
  });
}

export function usePlayerMatches(
  limit: number = 20,
  offset: number = 0,
  mode?: string,
  status?: string,
) {
  return useQuery({
    queryKey: ["playerMatches", limit, offset, mode, status],
    queryFn: () => getPlayerMatchesAction(limit, offset, mode, status),
  });
}

export function useUpdatePlayerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlayerProfileAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

export function useUpdatePushToken() {
  return useMutation({
    mutationFn: updatePushTokenAction,
  });
}
