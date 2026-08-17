import { useMutation } from "@tanstack/react-query";

import {
  createPrivateRoomAction,
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
