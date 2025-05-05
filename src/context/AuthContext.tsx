import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

interface AuthContextType {
  isAuthenticated: boolean;
  authStatusChecked: boolean;
  userPuuid: string | null;
  setIsAuthenticated: (value: boolean) => void;
  login: (puuid: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({children}: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  const [userPuuid, setUserPuuid] = useState<string | null>(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedPuuid = await AsyncStorage.getItem('UserID');
      if (storedPuuid) {
        setUserPuuid(storedPuuid);
        setIsAuthenticated(true);
      } else {
        setUserPuuid(null);
        setIsAuthenticated(false);
      }
    } catch (e: any) {
      console.error('Auth check error:', e);
      setUserPuuid(null);
      setIsAuthenticated(false);
    } finally {
      setAuthStatusChecked(true);
      SplashScreen.hide();
    }
  };

  const login = async (puuid: string) => {
    try {
      await AsyncStorage.setItem('UserID', puuid);
      setUserPuuid(puuid);
      setIsAuthenticated(true);
      return true;
    } catch (e: any) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('UserID');
      setUserPuuid(null);
      setIsAuthenticated(false);
    } catch (e: any) {
      console.error('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authStatusChecked,
        userPuuid,
        setIsAuthenticated,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
