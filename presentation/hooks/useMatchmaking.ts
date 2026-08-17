import { useMutation } from "@tanstack/react-query";

import {
  joinGlobalQueueAction,
  leaveGlobalQueueAction,
} from "@core/actions/matchmaking/matchmaking-action";

export function useJoinGlobalQueue() {
  return useMutation({
    mutationFn: joinGlobalQueueAction,
  });
}

export function useLeaveGlobalQueue() {
  return useMutation({
    mutationFn: leaveGlobalQueueAction,
  });
}
