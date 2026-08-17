import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  loginAction,
  registerAction,
  logoutAction,
} from "@core/actions/auth/auth-action";
import { useAuthStore } from "@presentation/store/useAuthStore";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
      useAuthStore.getState().setPlayer(data.player);
      queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAction,
    onSuccess: (data) => {
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
      useAuthStore.getState().setPlayer(data.player);
      queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return logoutAction(refreshToken);
    },
    onSuccess: () => {
      useAuthStore.getState().clearAuthState();
      queryClient.clear();
    },
  });
}
