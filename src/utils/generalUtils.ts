import { supabase } from "src/lib/supabase";


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
 */
export function isPremiumUser(userData: any): boolean {
  if (!userData) return false;

  // Check if user has RevenueCat entitlements
  if (userData.customerInfo?.entitlements?.active?.premium) {
    return true;
  }

  // Fallback to checking payment records
  return Boolean(userData.payments && userData.payments.length > 0);
}