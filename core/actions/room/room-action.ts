import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type {
  ICreatePrivateRoomResponse,
  IJoinPrivateRoomResponse,
  IRoomStatusResponse,
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

export async function getPrivateRoomAction(
  code: string
): Promise<IRoomStatusResponse> {
  return fetchGeneral<IRoomStatusResponse>(`/room/private/${code}`);
}

export async function cancelPrivateRoomAction(code: string): Promise<void> {
  await fetchGeneral<{ message: string }>(`/room/private/${code}`, {
    method: "DELETE",
  });
}
