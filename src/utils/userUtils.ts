/**
 * Checks if a user has made any payments (premium user)
 *
 * @param userData - The user data object from DataContext
 * @returns boolean - True if user has made at least one payment, false otherwise
 */
export function isPremiumUser(userData: any): boolean {
  if (!userData) return false;

  // Check if payments array exists and has at least one entry
  return Boolean(userData.payments && userData.payments.length > 0);
}
