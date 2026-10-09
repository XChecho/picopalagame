import { useMutation, useQuery } from "@tanstack/react-query";

import {
  cancelPrivateRoomAction,
  createPrivateRoomAction,
  getPrivateRoomAction,
  joinPrivateRoomAction,
} from "@core/actions/room/room-action";

export function useCreatePrivateRoom() {
  return useMutation({
    mutationFn: createPrivateRoomAction,
  });
}

export function useJoinPrivateRoom() {
  return useMutation({
    mutationFn: joinPrivateRoomAction,
  });
}

const ROOM_POLL_MS = 2000;

/** Polls the room while the host waits for a guest. */
export function usePrivateRoomStatus(code: string | null) {
  return useQuery({
    queryKey: ["privateRoom", code],
    queryFn: () => getPrivateRoomAction(code as string),
    enabled: !!code,
    // Stop once the room left WAITING (joined, closed or expired).
    refetchInterval: (data) =>
      data && data.status !== "WAITING" ? false : ROOM_POLL_MS,
  });
}

export function useCancelPrivateRoom() {
  return useMutation({
    mutationFn: cancelPrivateRoomAction,
  });
}
