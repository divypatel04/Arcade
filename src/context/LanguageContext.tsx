import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n, LanguageCode, AVAILABLE_LANGUAGES, initializeI18n } from '../i18n';
import { I18nManager } from 'react-native';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  isRTL: boolean;
  languageNames: { code: LanguageCode; name: string }[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en-US');
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Create array of language options for dropdown
  const languageNames = Object.entries(AVAILABLE_LANGUAGES).map(([code, { name }]) => ({
    code: code as LanguageCode,
    name,
  }));

  useEffect(() => {
    const initialize = async () => {
      try {
        const initialLanguage = await initializeI18n();
        setLanguageState(initialLanguage);
        setIsRTL(AVAILABLE_LANGUAGES[initialLanguage].rtl);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const setLanguage = async (code: LanguageCode) => {
    try {
      const isRtl = AVAILABLE_LANGUAGES[code].rtl;

      // Update AsyncStorage
      await AsyncStorage.setItem('userLanguage', code);

      // Change language in i18next
      await i18n.changeLanguage(code);

      // Update RTL setting
      if (isRtl !== I18nManager.isRTL) {
        I18nManager.forceRTL(isRtl);
        // Note: For full RTL support, you might need to restart the app here
      }

      // Update state
      setLanguageState(code);
      setIsRTL(isRtl);
    } catch (error) {
      console.error('Failed to set language', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, languageNames, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
