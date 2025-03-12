import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const AuthContext = createContext({} as any);

export const AuthProvider = ({children}: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  const [userPuuid, setUserPuuid] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // await AsyncStorage.removeItem('UserID');
        const userId = await AsyncStorage.getItem('UserID');
        if (userId) {
          setUserPuuid(userId);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e: any) {
        console.log(e);
      } finally {
        setAuthStatusChecked(true);
        SplashScreen.hide();
      }
    };

    checkAuthentication();
  }, []);

  const login = async (puuid: string) => {
    try {
      await AsyncStorage.setItem('UserID', puuid);
      setUserPuuid(puuid);
      setIsAuthenticated(true);
      return true;
    } catch (e: any) {
      console.log(e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('UserID');
      setUserPuuid(null);
      setIsAuthenticated(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authStatusChecked,
        login,
        logout,
        userPuuid,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
