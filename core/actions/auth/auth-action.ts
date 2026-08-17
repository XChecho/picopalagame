import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import type {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  IRefreshTokenResponse,
} from "@core/interfaces/IAuth/IAuth";

export async function loginAction(
  loginRequest: ILoginRequest
): Promise<IAuthResponse> {
  return fetchGeneral<IAuthResponse>("/auth/login", {
    method: "POST",
    body: loginRequest,
  });
}

export async function registerAction(
  registerRequest: IRegisterRequest
): Promise<IAuthResponse> {
  return fetchGeneral<IAuthResponse>("/auth/register", {
    method: "POST",
    body: registerRequest,
  });
}

export async function refreshTokensAction(
  refreshToken: string
): Promise<IRefreshTokenResponse> {
  return fetchGeneral<IRefreshTokenResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function logoutAction(
  refreshToken: string
): Promise<{ message: string }> {
  return fetchGeneral<{ message: string }>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}
