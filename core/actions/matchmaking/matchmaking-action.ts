import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type { IGlobalQueueResponse } from "@core/interfaces/IRoom/IRoom";

export async function joinGlobalQueueAction(
  maxTurns?: number
): Promise<IGlobalQueueResponse> {
  return fetchGeneral<IGlobalQueueResponse>("/room/global/join", {
    method: "POST",
    body: { maxTurns },
  });
}

export async function leaveGlobalQueueAction(): Promise<{ message: string }> {
  return fetchGeneral<{ message: string }>("/room/global/leave", {
    method: "DELETE",
  });
}
