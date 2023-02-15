import * as SecureStore from "expo-secure-store";

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */

export const secureStorageSave = async (
  key: string,
  value: string
): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export const secureStorageDelete = async(key: string): Promise<void> =>{
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
}

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export const secureStorageRead = async(key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}
