import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage wrapper with error handling
 */

/**
 * Get item from AsyncStorage with fallback
 */
export const getItem = async <T>(
  key: string,
  fallback: T | null = null
): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value) as T;
    }
    return fallback;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return fallback;
  }
};

/**
 * Set item in AsyncStorage
 */
export const setItem = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    return false;
  }
};

/**
 * Remove item from AsyncStorage
 */
export const removeItem = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    return false;
  }
};

/**
 * Clear all AsyncStorage
 */
export const clearAll = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Get multiple items from AsyncStorage
 */
export const getMultipleItems = async <T extends Record<string, any>>(
  keys: string[]
): Promise<T> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: any = {};
    
    pairs.forEach(([key, value]) => {
      if (value !== null) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    });
    
    return result as T;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {} as T;
  }
};

/**
 * Set multiple items in AsyncStorage
 */
export const setMultipleItems = async (
  items: Array<[string, any]>
): Promise<boolean> => {
  try {
    const pairs = items.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]) as [string, string][];
    
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error setting multiple items:', error);
    return false;
  }
};

/**
 * Remove multiple items from AsyncStorage
 */
export const removeMultipleItems = async (
  keys: string[]
): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error removing multiple items:', error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; // Convert readonly array to mutable array
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Check if key exists in AsyncStorage
 */
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    console.error(`Error checking key ${key}:`, error);
    return false;
  }
};

/**
 * Get storage size (approximate)
 */
export const getStorageSize = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    
    let totalSize = 0;
    items.forEach(([key, value]) => {
      totalSize += key.length + (value?.length || 0);
    });
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

/**
 * Merge item with existing data
 */
export const mergeItem = async <T extends Record<string, any>>(
  key: string,
  value: Partial<T>
): Promise<boolean> => {
  try {
    const existing = await getItem<T>(key);
    const merged = { ...existing, ...value };
    return await setItem(key, merged);
  } catch (error) {
    console.error(`Error merging item ${key}:`, error);
    return false;
  }
};

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  AUTH_STATE: '@arcade_auth',
  USER_DATA: '@arcade_user',
  PREMIUM_STATUS: '@arcade_premium',
  SETTINGS: '@arcade_settings',
  CACHE_MATCHES: '@arcade_cache_matches',
  CACHE_AGENTS: '@arcade_cache_agents',
  CACHE_MAPS: '@arcade_cache_maps',
  CACHE_WEAPONS: '@arcade_cache_weapons',
  LAST_UPDATE: '@arcade_last_update',
  THEME_PREFERENCE: '@arcade_theme',
  LANGUAGE_PREFERENCE: '@arcade_language',
  ONBOARDING_COMPLETED: '@arcade_onboarding',
} as const;

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  getMultipleItems,
  setMultipleItems,
  removeMultipleItems,
  getAllKeys,
  hasKey,
  getStorageSize,
  mergeItem,
  STORAGE_KEYS,
};
