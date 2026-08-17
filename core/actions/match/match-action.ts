import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type { IMatch, ICreateMatchRequest } from "@core/interfaces/IMatch/IMatch";
import type { ISubmitMoveResponse } from "@core/interfaces/IMove/IMove";

export async function createMatchAction(
  data: ICreateMatchRequest
): Promise<IMatch> {
  return fetchGeneral<IMatch>("/match", {
    method: "POST",
    body: data,
  });
}

export async function getMatchAction(matchId: string): Promise<IMatch> {
  return fetchGeneral<IMatch>(`/match/${matchId}`);
}

export async function submitMoveAction(
  matchId: string,
  guess: string
): Promise<ISubmitMoveResponse> {
  return fetchGeneral<ISubmitMoveResponse>(`/match/${matchId}/move`, {
    method: "POST",
    body: { guess },
  });
}
