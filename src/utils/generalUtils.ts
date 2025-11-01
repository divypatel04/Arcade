import { Alert, BackHandler, Linking } from "react-native";
import { supabase } from "@lib/supabase";
import VersionCheck from 'react-native-version-check';
import AsyncStorage from "@react-native-async-storage/async-storage";


export function formatDateString(dateString: string) {
  const date = parseDate(dateString);

  if (date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
  }

  return dateString;
}

export function parseDate(dateString: string) {
  const dateParts = dateString.split('/');
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
    const year = parseInt(dateParts[2], 10);
    return new Date(year, month, day);
  }
  return null;
}

export const getSupabaseImageUrl = (imagePath: string) => {
  // If the image URL is already a full URL, return it as is
  if (imagePath?.startsWith('http')) {
    return imagePath;
  }
  // Assuming images are stored in a 'agents' bucket with path structure
  // You may need to adjust this based on your actual Supabase storage structure
  const bucket = 'static-data';
  // Get public URL from Supabase
  const { data } = supabase.storage.from(bucket).getPublicUrl(imagePath);
  return data?.publicUrl || '';
};

export const convertMillisToReadableTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};


/**
 * Checks if a user has made any payments (premium user)
 *
 * @param userData - The user data object from DataContext
 * @returns boolean - True if user has premium access
 * 
 * @example
 * ```ts
 * const hasPremium = isPremiumUser(userData);
 * ```
 */
export async function isPremiumUser(userData?: any): Promise<boolean> {
  if (!userData) return false;

  try {
    // First, try to check via RevenueCat subscription manager
    // This is more reliable than cached data
    const { subscriptionManager } = await import('../services/purchases');
    const isPremiumActive = await subscriptionManager.isPremiumActive();
    
    if (isPremiumActive) {
      return true;
    }
  } catch (error) {
    console.log('[isPremiumUser] RevenueCat check failed, falling back to cached data:', error);
  }

  // Fallback: Check cached customer info from userData
  if (userData.customerInfo?.entitlements?.active?.premium) {
    return true;
  }

  // Final fallback: Check payment records in database
  return Boolean(userData.payments && userData.payments.length > 0);
}


export const checkUpdateNeeded = async () => {
  VersionCheck.needUpdate({ignoreErrors: true}).then(async (res: any) => {
    if (res.isNeeded) {
      Alert.alert(
        'Please Update',
        'You will have to update your app to the latest version to continue using.',
        [
          {
            text: 'Update Now',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(res.storeUrl);
            },
          },
          {
            text: 'ok',
            onPress: () => {},
          },
        ],
      );
    }
  });
};


// Function to update anonymous user's name
export const updateAnonymousUserName = async (userId: string, userName: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username: userName,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error updating anonymous user name:', error);
    }
  } catch (error) {
    console.error('Failed to update anonymous user name:', error);
  }
};

// Handle Supabase anonymous sign-in
export const signInAnonymously = async () => {
  try {
    // Check if user is already signed in
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log('No active session, signing in anonymously');
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      if (data && data.user) {
        // Store flag in AsyncStorage to indicate successful sign-in
        await AsyncStorage.setItem('anonymousSignIn', 'true');
        console.log('Anonymous sign-in successful', data.user.id);

        // Set a default name for the anonymous user (optional)
        const defaultName = `Anonymous_${Math.floor(Math.random() * 10000)}`;
        // await updateAnonymousUserName(data.user.id, defaultName);
      }
    } else {
      console.log('User already signed in', session.user.id);
    }
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
  }
};