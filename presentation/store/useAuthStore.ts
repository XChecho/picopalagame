import { create } from "zustand";

import { SecureStorageAdapter } from "@core/adapters/secure-storage.adapter";
import {
  loginAction,
  registerAction,
  logoutAction,
} from "@core/actions/auth/auth-action";
import type { IPlayerBasic } from "@core/interfaces/IAuth/IAuth";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  player: IPlayerBasic | null;

  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    language?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setPlayer: (player: IPlayerBasic) => void;
  loadAuthState: () => Promise<void>;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  player: null,

  login: async (username, password) => {
    const response = await loginAction({ username, password });
    set({
      isAuthenticated: true,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      player: response.player,
    });
    SecureStorageAdapter.setItem("token", response.accessToken);
    SecureStorageAdapter.setItem("refreshToken", response.refreshToken);
    SecureStorageAdapter.setItem("player", JSON.stringify(response.player));
  },

  register: async (username, email, password, language) => {
    const response = await registerAction({
      username,
      email,
      password,
      language,
    });
    set({
      isAuthenticated: true,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      player: response.player,
    });
    SecureStorageAdapter.setItem("token", response.accessToken);
    SecureStorageAdapter.setItem("refreshToken", response.refreshToken);
    SecureStorageAdapter.setItem("player", JSON.stringify(response.player));
  },

  logout: async () => {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) {
      try {
        await logoutAction(refreshToken);
      } catch {
        // Continue with local logout even if API call fails
      }
    }
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      player: null,
    });
    SecureStorageAdapter.removeItem("token");
    SecureStorageAdapter.removeItem("refreshToken");
    SecureStorageAdapter.removeItem("player");
  },

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    SecureStorageAdapter.setItem("token", accessToken);
    SecureStorageAdapter.setItem("refreshToken", refreshToken);
  },

  setPlayer: (player) => {
    set({ player });
    SecureStorageAdapter.setItem("player", JSON.stringify(player));
  },

  loadAuthState: async () => {
    const accessToken = await SecureStorageAdapter.getItem("token");
    const refreshToken = await SecureStorageAdapter.getItem("refreshToken");
    const playerJson = await SecureStorageAdapter.getItem("player");

    if (accessToken && refreshToken && playerJson) {
      try {
        const player = JSON.parse(playerJson) as IPlayerBasic;
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          player,
        });
      } catch {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          player: null,
        });
      }
    }
  },

  clearAuthState: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      player: null,
    });
    SecureStorageAdapter.removeItem("token");
    SecureStorageAdapter.removeItem("refreshToken");
    SecureStorageAdapter.removeItem("player");
  },
}));
