import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

// Import all language files
import en from './translations/en.json';
import ar from './translations/ar.json';
import de from './translations/de.json';
import es from './translations/es.json';
import esMx from './translations/es-MX.json';
import fr from './translations/fr.json';
import id from './translations/id.json';
import it from './translations/it.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';
import pl from './translations/pl.json';
import pt from './translations/pt.json';
import ru from './translations/ru.json';
import th from './translations/th.json';
import tr from './translations/tr.json';
import vi from './translations/vi.json';
import zhCn from './translations/zh-CN.json';
import zhTw from './translations/zh-TW.json';

// Define available languages and their corresponding resource files
export const AVAILABLE_LANGUAGES = {
  'en-US': { name: 'English (US)', translation: en, rtl: false },
  'en-GB': { name: 'English (UK)', translation: en, rtl: false }, // Using same English translations
  'ar-AE': { name: 'العربية', translation: ar, rtl: true },
  'de-DE': { name: 'Deutsch', translation: de, rtl: false },
  'es-ES': { name: 'Español', translation: es, rtl: false },
  'es-MX': { name: 'Español (México)', translation: esMx, rtl: false },
  'fr-FR': { name: 'Français', translation: fr, rtl: false },
  'id-ID': { name: 'Bahasa Indonesia', translation: id, rtl: false },
  'it-IT': { name: 'Italiano', translation: it, rtl: false },
  'ja-JP': { name: '日本語', translation: ja, rtl: false },
  'ko-KR': { name: '한국어', translation: ko, rtl: false },
  'pl-PL': { name: 'Polski', translation: pl, rtl: false },
  'pt-BR': { name: 'Português', translation: pt, rtl: false },
  'ru-RU': { name: 'Русский', translation: ru, rtl: false },
  'th-TH': { name: 'ไทย', translation: th, rtl: false },
  'tr-TR': { name: 'Türkçe', translation: tr, rtl: false },
  'vi-VN': { name: 'Tiếng Việt', translation: vi, rtl: false },
  'zh-CN': { name: '简体中文', translation: zhCn, rtl: false },
  'zh-TW': { name: '繁體中文', translation: zhTw, rtl: false },
};

export type LanguageCode = keyof typeof AVAILABLE_LANGUAGES;

// Get device language
const getDeviceLanguage = (): LanguageCode => {
  const locales = RNLocalize.getLocales();
  const deviceLocale = locales[0]?.languageTag;

  // Find matching language or default to en-US
  return (Object.keys(AVAILABLE_LANGUAGES).find(
    code => code === deviceLocale || code.split('-')[0] === deviceLocale?.split('-')[0]
  ) as LanguageCode) || 'en-US';
};

// Initialize i18n
const initializeI18n = async () => {
  // Try to get stored language
  let storedLanguage: LanguageCode | null = null;
  try {
    storedLanguage = (await AsyncStorage.getItem('userLanguage')) as LanguageCode;
  } catch (error) {
    console.error('Failed to get stored language', error);
  }

  // Determine language to use
  const languageToUse = storedLanguage || getDeviceLanguage();

  // Create resources object for i18next
  const resources: Record<string, { translation: any }> = {};

  Object.entries(AVAILABLE_LANGUAGES).forEach(([code, { translation }]) => {
    resources[code] = { translation };
  });

  // Initialize i18next
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: languageToUse,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v4',
    });

  return languageToUse;
};

export { i18n, initializeI18n };
