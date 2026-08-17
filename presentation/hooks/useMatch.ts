import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMatchAction,
  createMatchAction,
  submitMoveAction,
} from "@core/actions/match/match-action";

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatchAction(matchId),
    enabled: !!matchId,
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
    mutationFn: ({
      matchId,
      guess,
    }: {
      matchId: string;
      guess: string;
    }) => submitMoveAction(matchId, guess),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["playerMatches"] });
    },
  });
}
