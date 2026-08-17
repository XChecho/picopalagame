import { useMutation, useQueryClient } from "@tanstack/react-query";

import { syncOfflineStatsAction } from "@core/actions/stats/stats-action";

export function useSyncOfflineStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncOfflineStatsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerStats"] });
    },
  });
}
