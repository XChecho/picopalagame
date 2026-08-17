export interface IPlayer {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  language: string;
  createdAt: string;
}

export interface IUpdatePlayerRequest {
  username?: string;
  avatar?: string;
  language?: string;
}
