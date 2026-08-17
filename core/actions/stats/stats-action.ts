import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type { ISyncStatsRequest } from "@core/interfaces/IStats/IStats";

export async function syncOfflineStatsAction(
  data: ISyncStatsRequest
): Promise<void> {
  await fetchGeneral<{ message: string }>("/stats/sync", {
    method: "POST",
    body: data,
  });
}
