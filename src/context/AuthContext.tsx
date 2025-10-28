import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const AUTH_STORAGE_KEY = '@arcade_auth';
const USER_STORAGE_KEY = '@arcade_user';

export interface User {
  id: string;
  riotId: string;
  gameName: string;
  tagLine: string;
  region: string;
  puuid: string;
  profileIcon?: string;
  accountLevel?: number;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthState, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Check token expiration
  useEffect(() => {
    if (authState.expiresAt) {
      const timeUntilExpiry = authState.expiresAt - Date.now();
      
      // Refresh token 5 minutes before expiry
      if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
        refreshAccessToken();
      }
    }
  }, [authState.expiresAt]);

  const loadStoredAuth = async () => {
    try {
      const [storedAuth, storedUser] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);

      if (storedAuth && storedUser) {
        const parsedAuth: AuthState = JSON.parse(storedAuth);
        const parsedUser: User = JSON.parse(storedUser);

        // Check if token is still valid
        if (parsedAuth.expiresAt && parsedAuth.expiresAt > Date.now()) {
          setAuthState(parsedAuth);
          setUser(parsedUser);
        } else {
          // Token expired, try to refresh
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (authData: AuthState, userData: User) => {
    try {
      setIsLoading(true);
      
      // Store auth data
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      setAuthState(authData);
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearStoredAuth();
      setAuthState({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      });
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user to update');
      }

      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (!authState.refreshToken) {
        return false;
      }

      // TODO: Implement actual token refresh with Riot API
      // For now, return false to trigger re-authentication
      console.log('Token refresh needed - implement Riot API refresh flow');
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await clearStoredAuth();
      return false;
    }
  };

  const clearStoredAuth = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEY),
      AsyncStorage.removeItem(USER_STORAGE_KEY),
    ]);
  };

  const value: AuthContextType = {
    user,
    authState,
    isAuthenticated: !!user && !!authState.accessToken,
    isLoading,
    login,
    logout,
    updateUser,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
