import { SecureStorageAdapter } from "@/core/adapters/secure-storage.adapter";

const BASE_URL = process.env.EXPO_PUBLIC_REACT_API || "http://localhost:4001/api/v1";

interface FetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

async function forceLogout(): Promise<void> {
  await SecureStorageAdapter.removeItem("token");
  await SecureStorageAdapter.removeItem("refreshToken");
}

export async function fetchGeneral<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const url = `${BASE_URL}${endpoint}`;

  const token = await SecureStorageAdapter.getItem("token");

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (response.status === 401) {
    await forceLogout();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
