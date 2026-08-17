export interface IApiResponse<T> {
  data: T;
  message?: string;
}

export interface IApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

export interface IApiListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
