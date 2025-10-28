import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  strength: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
}

/**
 * Hook to monitor network status
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: null,
    strength: 'unknown',
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const strength = getNetworkStrength(state);
      
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        strength,
      });
    });

    // Fetch initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      const strength = getNetworkStrength(state);
      
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        strength,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    const state = await NetInfo.fetch();
    const strength = getNetworkStrength(state);
    
    setNetworkStatus({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      strength,
    });
  }, []);

  return {
    ...networkStatus,
    refresh,
  };
};

/**
 * Determine network strength based on connection details
 */
const getNetworkStrength = (state: NetInfoState): 'excellent' | 'good' | 'fair' | 'poor' | 'unknown' => {
  if (!state.isConnected) return 'poor';
  
  // For cellular connections
  if (state.type === 'cellular' && state.details) {
    const details = state.details as any;
    if (details.cellularGeneration === '5g') return 'excellent';
    if (details.cellularGeneration === '4g') return 'good';
    if (details.cellularGeneration === '3g') return 'fair';
    return 'poor';
  }
  
  // For WiFi connections
  if (state.type === 'wifi') {
    return 'excellent';
  }
  
  return 'unknown';
};

/**
 * Hook to check if online (simple version)
 */
export const useIsOnline = (): boolean => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(state.isConnected ?? false);
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
};

/**
 * Hook with callback when network status changes
 */
export const useNetworkListener = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      
      if (connected !== isOnline) {
        setIsOnline(connected);
        
        if (connected && onOnline) {
          onOnline();
        } else if (!connected && onOffline) {
          onOffline();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOnline, onOnline, onOffline]);

  return isOnline;
};

export default {
  useNetworkStatus,
  useIsOnline,
  useNetworkListener,
};
