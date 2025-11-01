declare module '@env' {
  export const REACT_NATIVE_PUBLIC_SUPABASE_URL: string;
  export const REACT_NATIVE_SUPABASE_ANON_KEY: string;
  export const RIOT_APIKEY: string;
  export const REVENUECAT_ANDROID_API_KEY: string;
  export const REVENUECAT_IOS_API_KEY: string;
  export const ADMOB_ANDROID_APP_ID: string;
  export const ADMOB_IOS_APP_ID: string;
}

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

declare const console: {
  error(...args: any[]): void;
  log(...args: any[]): void;
  warn(...args: any[]): void;
};

declare function setTimeout(callback: (...args: any[]) => void, ms: number): number;
declare function clearTimeout(id: number): void;