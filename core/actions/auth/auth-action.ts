import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  IRefreshTokenResponse,
} from "@core/interfaces/IAuth/IAuth";
import { getMobilePlatform } from "@core/utils/mobilePlatform";

const AUTH_BASE = "/mobile/auth";

export async function loginAction(
  loginRequest: ILoginRequest
): Promise<IAuthResponse> {
  return fetchGeneral<IAuthResponse>(`${AUTH_BASE}/login`, {
    method: "POST",
    body: { ...loginRequest, platform: getMobilePlatform() },
  });
}

export async function registerAction(
  registerRequest: IRegisterRequest
): Promise<IAuthResponse> {
  return fetchGeneral<IAuthResponse>(`${AUTH_BASE}/register`, {
    method: "POST",
    body: { ...registerRequest, platform: getMobilePlatform() },
  });
}

export async function refreshTokensAction(
  refreshToken: string
): Promise<IRefreshTokenResponse> {
  return fetchGeneral<IRefreshTokenResponse>(`${AUTH_BASE}/refresh`, {
    method: "POST",
    body: { refreshToken },
  });
}

export async function logoutAction(
  refreshToken: string
): Promise<{ message: string }> {
  return fetchGeneral<{ message: string }>(`${AUTH_BASE}/logout`, {
    method: "POST",
    body: { refreshToken },
  });
}
