import * as SecureStore from "expo-secure-store";

export class SecureStorageAdapter {
  static async setItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
    }
  }

  static async getItem(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  }

  static async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
    }
  }
}
