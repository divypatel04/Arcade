import 'react-native-url-polyfill/auto'
import { AppState, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'


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
    const { data, error } = await supabase.functions.invoke('process-user-data', {
      body: { puuid },
    });

    if (error) {
      console.error('Error invoking process-user-data function:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to process user data:', error);
    throw error;
  }
};