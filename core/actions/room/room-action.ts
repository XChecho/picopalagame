import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type {
  ICreatePrivateRoomResponse,
  IJoinPrivateRoomResponse,
} from "@core/interfaces/IRoom/IRoom";

export async function createPrivateRoomAction(
  maxTurns?: number
): Promise<ICreatePrivateRoomResponse> {
  return fetchGeneral<ICreatePrivateRoomResponse>("/room/private", {
    method: "POST",
    body: { maxTurns },
  });
}

export async function joinPrivateRoomAction(
  code: string
): Promise<IJoinPrivateRoomResponse> {
  return fetchGeneral<IJoinPrivateRoomResponse>("/room/private/join", {
    method: "POST",
    body: { code },
  });
}
