import { useAuthStore } from "@presentation/store/useAuthStore";
import { memoryStore } from "@core/__tests__/memoryStorage";
import { loginAction, logoutAction, registerAction } from "@core/actions/auth/auth-action";
import type { IPlayerBasic } from "@core/interfaces/IAuth/IAuth";

jest.mock("@core/adapters/secure-storage.adapter", () =>
  jest.requireActual("@core/__tests__/memoryStorage").createAdapterMock(),
);
jest.mock("@core/actions/auth/auth-action", () => ({
  loginAction: jest.fn(),
  registerAction: jest.fn(),
  logoutAction: jest.fn(),
}));

const player = { id: "p1", username: "sergio" } as unknown as IPlayerBasic;
const session = { accessToken: "access", refreshToken: "refresh", player };

const state = () => useAuthStore.getState();

beforeEach(() => {
  memoryStore.clear();
  [loginAction, registerAction, logoutAction].forEach((fn) => (fn as jest.Mock).mockReset());
  state().clearAuthState();
  memoryStore.clear();
});

describe("useAuthStore", () => {
  it("login stores the session in memory and secure storage", async () => {
    (loginAction as jest.Mock).mockResolvedValue(session);

    await state().login("sergio", "secret");

    expect(loginAction).toHaveBeenCalledWith({ username: "sergio", password: "secret" });
    expect(state()).toMatchObject({ isAuthenticated: true, accessToken: "access", refreshToken: "refresh", player });
    expect(memoryStore.get("token")).toBe("access");
    expect(memoryStore.get("refreshToken")).toBe("refresh");
    expect(JSON.parse(memoryStore.get("player") as string)).toEqual(player);
  });

  it("login leaves the store untouched when the API fails", async () => {
    (loginAction as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    await expect(state().login("sergio", "bad")).rejects.toThrow("Invalid credentials");
    expect(state().isAuthenticated).toBe(false);
    expect(memoryStore.size).toBe(0);
  });

  it("register stores the session", async () => {
    (registerAction as jest.Mock).mockResolvedValue(session);

    await state().register("sergio", "s@x.com", "secret", "es");

    expect(registerAction).toHaveBeenCalledWith({
      username: "sergio",
      email: "s@x.com",
      password: "secret",
      language: "es",
    });
    expect(state().isAuthenticated).toBe(true);
  });

  it("logout clears local state even when the API call fails", async () => {
    state().setTokens("access", "refresh");
    (logoutAction as jest.Mock).mockRejectedValue(new Error("network"));

    await state().logout();

    expect(logoutAction).toHaveBeenCalledWith("refresh");
    expect(state()).toMatchObject({ isAuthenticated: false, accessToken: null, refreshToken: null, player: null });
    expect(memoryStore.has("token")).toBe(false);
  });

  it("logout skips the API call without a refresh token", async () => {
    await state().logout();
    expect(logoutAction).not.toHaveBeenCalled();
  });

  it("loadAuthState restores a complete persisted session", async () => {
    memoryStore.set("token", "access");
    memoryStore.set("refreshToken", "refresh");
    memoryStore.set("player", JSON.stringify(player));

    await state().loadAuthState();

    expect(state()).toMatchObject({ isAuthenticated: true, accessToken: "access", player });
  });

  it("loadAuthState stays logged out when data is missing or corrupt", async () => {
    memoryStore.set("token", "access");
    await state().loadAuthState();
    expect(state().isAuthenticated).toBe(false);

    memoryStore.set("refreshToken", "refresh");
    memoryStore.set("player", "{broken");
    await state().loadAuthState();
    expect(state().isAuthenticated).toBe(false);
    expect(state().accessToken).toBeNull();
  });
});
