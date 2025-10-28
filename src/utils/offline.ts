import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { useEffect, useCallback, useState } from 'react';

const OFFLINE_QUEUE_KEY = '@arcade_offline_queue';

export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retries: number;
}

/**
 * Offline queue manager
 */
class OfflineQueue {
  private queue: QueuedAction[] = [];
  private processing = false;

  async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  async add(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(queuedAction);
    await this.saveQueue();
  }

  async processQueue(processor: (action: QueuedAction) => Promise<boolean>): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    const toProcess = [...this.queue];
    const failed: QueuedAction[] = [];

    for (const action of toProcess) {
      try {
        const success = await processor(action);
        
        if (!success) {
          action.retries += 1;
          if (action.retries < 3) {
            failed.push(action);
          }
        }
      } catch (error) {
        console.error('Error processing queued action:', error);
        action.retries += 1;
        if (action.retries < 3) {
          failed.push(action);
        }
      }
    }

    this.queue = failed;
    await this.saveQueue();
    this.processing = false;
  }

  async clear(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();

/**
 * Hook for offline queue management
 */
export const useOfflineQueue = (
  processor: (action: QueuedAction) => Promise<boolean>
) => {
  const { isConnected } = useNetworkStatus();
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    offlineQueue.loadQueue().then(() => {
      setQueueSize(offlineQueue.getQueueSize());
    });
  }, []);

  useEffect(() => {
    if (isConnected && offlineQueue.getQueueSize() > 0) {
      processQueue();
    }
  }, [isConnected]);

  const processQueue = useCallback(async () => {
    await offlineQueue.processQueue(processor);
    setQueueSize(offlineQueue.getQueueSize());
  }, [processor]);

  const addToQueue = useCallback(async (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => {
    await offlineQueue.add(action);
    setQueueSize(offlineQueue.getQueueSize());
  }, []);

  const clearQueue = useCallback(async () => {
    await offlineQueue.clear();
    setQueueSize(0);
  }, []);

  return {
    queueSize,
    addToQueue,
    processQueue,
    clearQueue,
  };
};

/**
 * Cache management for offline mode
 */
export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const cacheKey = `@arcade_cache_${key}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

/**
 * Get cached data
 */
export const getCachedData = async <T>(
  key: string,
  maxAge: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<T | null> => {
  try {
    const cacheKey = `@arcade_cache_${key}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    if (Date.now() - timestamp > maxAge) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

/**
 * Clear all cached data
 */
export const clearCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('@arcade_cache_'));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get cache size
 */
export const getCacheSize = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('@arcade_cache_'));
    const items = await AsyncStorage.multiGet(cacheKeys);
    
    let totalSize = 0;
    items.forEach(([key, value]) => {
      totalSize += key.length + (value?.length || 0);
    });
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return 0;
  }
};

export default {
  offlineQueue,
  useOfflineQueue,
  cacheData,
  getCachedData,
  clearCache,
  getCacheSize,
};
