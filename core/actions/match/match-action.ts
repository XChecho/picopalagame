import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type {
  IMatch,
  ICreateMatchRequest,
  ISetSecretRequest,
} from "@core/interfaces/IMatch/IMatch";
import type { ISubmitMoveResponse } from "@core/interfaces/IMove/IMove";

export async function createMatchAction(
  data: ICreateMatchRequest,
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
  guess: string,
): Promise<ISubmitMoveResponse> {
  return fetchGeneral<ISubmitMoveResponse>(`/match/${matchId}/move`, {
    method: "POST",
    body: { guess },
  });
}

export async function setMatchSecretAction(
  matchId: string,
  data: ISetSecretRequest,
): Promise<IMatch & { started: boolean }> {
  return fetchGeneral<IMatch & { started: boolean }>(
    `/match/${matchId}/secret`,
    { method: "POST", body: data },
  );
}

export async function getActiveMatchAction(): Promise<IMatch | null> {
  // The API answers with an empty body when there is no active match.
  const match = await fetchGeneral<Partial<IMatch>>("/match/active");
  return match.id ? (match as IMatch) : null;
}

export async function forfeitMatchAction(matchId: string): Promise<IMatch> {
  return fetchGeneral<IMatch>(`/match/${matchId}/forfeit`, { method: "POST" });
}
