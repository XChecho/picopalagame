import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type { IPlayer, IUpdatePlayerRequest } from "@core/interfaces/IPlayer/IPlayer";
import type { IPlayerStats } from "@core/interfaces/IStats/IStats";
import type { IMatchHistoryResponse } from "@core/interfaces/IMatch/IMatch";

export async function getPlayerProfileAction(): Promise<IPlayer> {
  return fetchGeneral<IPlayer>("/player/me");
}

export async function updatePlayerProfileAction(
  data: IUpdatePlayerRequest
): Promise<IPlayer> {
  return fetchGeneral<IPlayer>("/player/me", {
    method: "PATCH",
    body: data,
  });
}

export async function getPlayerStatsAction(): Promise<IPlayerStats> {
  return fetchGeneral<IPlayerStats>("/player/me/stats");
}

export async function getPlayerMatchesAction(
  limit: number = 20,
  offset: number = 0,
  mode?: string,
  status?: string
): Promise<IMatchHistoryResponse> {
  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (mode) params.set("mode", mode);
  if (status) params.set("status", status);

  return fetchGeneral<IMatchHistoryResponse>(
    `/player/me/matches?${params.toString()}`
  );
}

export async function updatePushTokenAction(
  expoPushToken: string
): Promise<void> {
  await fetchGeneral<{ message: string }>("/player/me/push-token", {
    method: "PATCH",
    body: { expoPushToken },
  });
}
