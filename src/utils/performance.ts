import React from 'react';
import { ListRenderItemInfo } from 'react-native';

/**
 * Performance optimization utilities
 */

/**
 * Memoized component wrapper with custom comparison
 */
export const memoWithProps = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, propsAreEqual);
};

/**
 * Shallow comparison for props
 */
export const shallowEqual = <T extends object>(obj1: T, obj2: T): boolean => {
  const keys1 = Object.keys(obj1) as Array<keyof T>;
  const keys2 = Object.keys(obj2) as Array<keyof T>;

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
};

/**
 * FlatList optimization config
 */
export const flatListOptimizations = {
  // Standard configuration
  standard: {
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 10,
    windowSize: 10,
  },
  
  // For large lists
  largeList: {
    removeClippedSubviews: true,
    maxToRenderPerBatch: 5,
    updateCellsBatchingPeriod: 100,
    initialNumToRender: 5,
    windowSize: 5,
  },
  
  // For small lists
  smallList: {
    removeClippedSubviews: false,
    maxToRenderPerBatch: 20,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 20,
    windowSize: 20,
  },
};

/**
 * Get item layout for FlatList optimization
 */
export const getItemLayout = (itemHeight: number) => (
  _data: any,
  index: number
) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

/**
 * Key extractor for FlatList
 */
export const keyExtractor = <T extends { id?: string | number }>(
  item: T,
  index: number
): string => {
  return item.id?.toString() || index.toString();
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * React Query optimization config
 */
export const queryOptimizations = {
  // Default configuration
  default: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  
  // For frequently changing data
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000, // 1 minute
  },
  
  // For static data
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  
  // For user-specific data
  userSpecific: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
};

/**
 * Lazy load component wrapper
 */
export const lazyLoad = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  return React.lazy(factory);
};

/**
 * Batch state updates
 */
export const batchUpdates = <T>(
  updates: Array<() => void>
): void => {
  React.startTransition(() => {
    updates.forEach(update => update());
  });
};

/**
 * Check if component should update (for class components)
 */
export const shouldComponentUpdate = <P extends object, S extends object>(
  nextProps: P,
  nextState: S,
  currentProps: P,
  currentState: S
): boolean => {
  return !shallowEqual(nextProps, currentProps) || !shallowEqual(nextState, currentState);
};

/**
 * Measure render performance
 */
export const measureRenderTime = (componentName: string) => {
  const start = Date.now();
  
  return () => {
    const end = Date.now();
    console.log(`[Performance] ${componentName} rendered in ${end - start}ms`);
  };
};

/**
 * Prefetch query helper
 */
export const prefetchQueries = async (
  queryClient: any,
  queries: Array<{ queryKey: any[]; queryFn: () => Promise<any> }>
): Promise<void> => {
  await Promise.all(
    queries.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery({ queryKey, queryFn })
    )
  );
};

/**
 * Invalidate queries helper
 */
export const invalidateQueries = async (
  queryClient: any,
  queryKeys: any[][]
): Promise<void> => {
  await Promise.all(
    queryKeys.map(queryKey =>
      queryClient.invalidateQueries({ queryKey })
    )
  );
};

/**
 * Memory management - clear old cache
 */
export const clearOldCache = async (
  queryClient: any,
  olderThan: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<void> => {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();
  
  queries.forEach((query: any) => {
    const updatedAt = query.state.dataUpdatedAt;
    if (Date.now() - updatedAt > olderThan) {
      queryClient.removeQueries({ queryKey: query.queryKey });
    }
  });
};

/**
 * Optimize images config
 */
export const imageOptimizations = {
  // Use placeholder while loading
  usePlaceholder: true,
  
  // Progressive image loading
  progressive: true,
  
  // Cache images
  cache: 'force-cache' as const,
  
  // Resize mode
  resizeMode: 'cover' as const,
  
  // Lazy load images
  lazyLoad: true,
};

/**
 * Virtual list helper for very large lists
 */
export const virtualListConfig = {
  itemHeight: 80, // Average item height
  overscan: 3, // Number of items to render outside viewport
  estimatedItemSize: 80,
};

/**
 * Check if heavy computation should be deferred
 */
export const shouldDefer = (itemCount: number, threshold: number = 100): boolean => {
  return itemCount > threshold;
};

/**
 * Defer heavy computation with requestIdleCallback fallback
 */
export const deferComputation = (callback: () => void, timeout: number = 1000): void => {
  // Use setTimeout as fallback for React Native
  setTimeout(callback, 0);
};

export default {
  memoWithProps,
  shallowEqual,
  flatListOptimizations,
  getItemLayout,
  keyExtractor,
  debounce,
  throttle,
  queryOptimizations,
  lazyLoad,
  batchUpdates,
  measureRenderTime,
  prefetchQueries,
  invalidateQueries,
  clearOldCache,
  imageOptimizations,
  virtualListConfig,
  shouldDefer,
  deferComputation,
};
