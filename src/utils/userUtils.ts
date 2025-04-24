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
