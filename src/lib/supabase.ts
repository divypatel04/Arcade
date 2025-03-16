import 'react-native-url-polyfill/auto'
import { AppState, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { REACT_NATIVE_PUBLIC_SUPABASE_URL, REACT_NATIVE_SUPABASE_ANON_KEY } from '@env'

const supabaseUrl = REACT_NATIVE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = REACT_NATIVE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

/**
 * Calls the Supabase Edge Function to process user data in the background
 * @param puuid The user's PUUID
 * @returns Promise with the result of the processing
 */
export const processUserData = async (puuid: string) => {
  try {
    // For iOS and Android, use a regular invoke
    console.log('[BackgroundProcess] Invoking process-user-data function for PUUID:', puuid);
    const { data, error } = await supabase.functions.invoke('process-user-data', {
      body: { puuid },
    });

    if (error) {
      console.error('[BackgroundProcess] Error invoking process-user-data function:', error);
      throw error;
    }

    console.log('[BackgroundProcess] Successfully processed user data');
    return data;
  } catch (error) {
    console.error('[BackgroundProcess] Failed to process user data:', error);
    throw error;
  }
};