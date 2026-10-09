import {
  loginAction,
  logoutAction,
  refreshTokensAction,
  registerAction,
} from "@core/actions/auth/auth-action";
import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import { Platform } from "react-native";

jest.mock("@core/actions/api/fetchGeneral", () => ({ fetchGeneral: jest.fn() }));

const fetchMock = fetchGeneral as jest.Mock;
const originalOS = Platform.OS;

const setOS = (os: string) => {
  Object.defineProperty(Platform, "OS", { get: () => os, configurable: true });
};

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({});
  setOS("ios");
});

afterAll(() => setOS(originalOS));

describe("auth actions use the /mobile/auth namespace", () => {
  it("login posts credentials with the iOS platform", async () => {
    await loginAction({ username: "sergio", password: "secret123" });

    expect(fetchMock).toHaveBeenCalledWith("/mobile/auth/login", {
      method: "POST",
      body: { username: "sergio", password: "secret123", platform: "IOS" },
    });
  });

  it("register posts the profile with the Android platform", async () => {
    setOS("android");

    await registerAction({
      username: "sergio",
      email: "s@x.com",
      password: "secret123",
      language: "es",
    });

    expect(fetchMock).toHaveBeenCalledWith("/mobile/auth/register", {
      method: "POST",
      body: {
        username: "sergio",
        email: "s@x.com",
        password: "secret123",
        language: "es",
        platform: "ANDROID",
      },
    });
  });

  it("refresh and logout send only the refresh token", async () => {
    await refreshTokensAction("r1");
    await logoutAction("r2");

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/mobile/auth/refresh", {
      method: "POST",
      body: { refreshToken: "r1" },
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/mobile/auth/logout", {
      method: "POST",
      body: { refreshToken: "r2" },
    });
  });

  it("rejects unsupported platforms instead of sending a bad request", async () => {
    setOS("web");

    await expect(loginAction({ username: "sergio", password: "secret123" })).rejects.toThrow(
      "Unsupported platform for mobile auth: web",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
