export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  language?: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  player: IPlayerBasic;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IPlayerBasic {
  id: string;
  username: string;
  email: string;
  language: string;
  createdAt: string;
}
