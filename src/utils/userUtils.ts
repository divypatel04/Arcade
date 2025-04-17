/**
 * Checks if a user is a premium subscriber based on their user data
 * @param userData User data object from context
 * @returns boolean indicating if the user has premium status
 */
export const isPremiumUser = (userData: any): boolean => {
  if (!userData) return false;

  // Check if user has any payment records
  if (!userData.payments || !Array.isArray(userData.payments) || userData.payments.length === 0) {
    return false;
  }

  // Find active premium subscription
  const activeSubscription = userData.payments.find(
    (payment: any) => payment.active && payment.premium
  );

  if (!activeSubscription) return false;

  // If there's an expiry date, check if it's still valid
  if (activeSubscription.expiry_date) {
    const expiryDate = new Date(activeSubscription.expiry_date);
    const now = new Date();

    if (expiryDate < now) {
      return false;
    }
  }

  return true;
};
