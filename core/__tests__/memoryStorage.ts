/** In-memory stand-in for SecureStorageAdapter, shared by tests via jest.mock factories. */
export const memoryStore = new Map<string, string>();

export function createAdapterMock() {
  return {
    SecureStorageAdapter: {
      getItem: jest.fn(async (key: string) => memoryStore.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        memoryStore.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        memoryStore.delete(key);
      }),
    },
  };
}
