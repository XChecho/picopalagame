import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMatchAction,
  createMatchAction,
  forfeitMatchAction,
  getActiveMatchAction,
  setMatchSecretAction,
  submitMoveAction,
} from "@core/actions/match/match-action";

export function useMatch(
  matchId: string,
  options: { refetchInterval?: number | false } = {},
) {
  return useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatchAction(matchId),
    enabled: !!matchId,
    refetchInterval: options.refetchInterval ?? false,
  });
}

export function useSetMatchSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      matchId,
      secret,
      random,
    }: {
      matchId: string;
      secret?: string;
      random?: boolean;
    }) => setMatchSecretAction(matchId, { secret, random }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
    },
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatchAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerMatches"] });
    },
  });
}

export function useSubmitMove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, guess }: { matchId: string; guess: string }) =>
      submitMoveAction(matchId, guess),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["playerMatches"] });
    },
  });
}

export function useActiveMatch(enabled = true) {
  return useQuery({
    queryKey: ["activeMatch"],
    queryFn: getActiveMatchAction,
    enabled,
    staleTime: 0,
  });
}

export function useForfeitMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forfeitMatchAction,
    onSuccess: (_data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["activeMatch"] });
    },
  });
}
