import * as SecureStore from "expo-secure-store";

export class SecureStorageAdapter {
  static async setItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore Set Error:", error);
      // No uses Alert aquí, el componente que lo llama decidirá si mostrar un error
    }
  }

  static async getItem(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore Get Error:", error);
      return null;
    }
  }

  static async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore Remove Error:", error);
    }
  }
}
