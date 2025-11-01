import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { colors, fonts, sizes } from '../theme';
import { useDataContext } from '../context/DataContext';
import { supabase } from '../lib/supabase';
import { PurchasesPackage } from 'react-native-purchases';
import { subscriptionManager, ENTITLEMENTS } from '../services/purchases';

interface SubscriptionOption {
  id: string;
  title: string;
  price: string;
  pricePerMonth: string | null;
  duration: string;
  savings: string | null;
  isPopular: boolean;
  productId: string;
}

const defaultOptions: SubscriptionOption[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$4.99',
    pricePerMonth: '$4.99',
    duration: '1 month',
    savings: 'Save 10%',
    isPopular: false,
    productId: 'arcade_premium:arcade-premium-monthly',
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '$39.99',
    pricePerMonth: '$3.33',
    duration: '12 months',
    savings: 'Save 33%',
    isPopular: true,
    productId: 'arcade_premium:arcade-premium-yearly',
  },
];

const PremiumSubscriptionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userData, fetchUserData } = useDataContext();

  const [selectedOption, setSelectedOption] = useState<string>('yearly');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [subscriptionOptions, setSubscriptionOptions] = useState<SubscriptionOption[]>(defaultOptions);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Initialize RevenueCat
  useEffect(() => {
    const setupRevenueCat = async () => {
      try {
        // Initialize subscription manager
        await subscriptionManager.initialize(userData?.puuid);

        // Get available packages
        const offerings = await subscriptionManager.getOfferings();

        if (offerings.current && offerings.current.availablePackages.length > 0) {
          setPackages(offerings.current.availablePackages);

          // Map RevenueCat packages to our subscription options
          const updatedOptions = subscriptionOptions.map(option => {
            const matchingPackage = offerings.current?.availablePackages.find(
              pkg => pkg.identifier === option.id
            );

            if (matchingPackage) {
              return {
                ...option,
                price: matchingPackage.product.priceString,
                productId: matchingPackage.identifier,
              };
            }
            return option;
          });

          setSubscriptionOptions(updatedOptions);
        }
      } catch (error) {
        console.error('Failed to setup RevenueCat:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    setupRevenueCat();
  }, [userData?.puuid]);

  const handleSubscribe = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Find the package that matches our selected option
      const packageToPurchase = packages.find(
        pkg => pkg.identifier === selectedOption
      );

      if (!packageToPurchase) {
        throw new Error('Selected package not available');
      }

      // Make the purchase using subscription manager
      const customerInfo = await subscriptionManager.purchasePackage(packageToPurchase);

      // Check if the user is entitled to premium
      if (customerInfo?.entitlements.active[ENTITLEMENTS.PREMIUM]) {
        // Update user's premium status in database
        await updateUserPremiumStatus(customerInfo);

        // Show success message
        Alert.alert(
          'Purchase Successful',
          'Your premium subscription has been activated successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );

        // Refresh user data to reflect premium status
        if (userData?.puuid) {
          await fetchUserData(userData.puuid);
        }
      }
    } catch (error: any) {
      // Check if user cancelled
      if (error.message?.includes('cancelled')) {
        // User cancelled - don't show error
        console.log('User cancelled purchase');
      } else {
        Alert.alert(
          'Purchase Error',
          error.message || 'There was an error processing your purchase. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPremiumStatus = async (customerInfo: any) => {
    try {
      if (!userData?.puuid) return;

      // Find the selected subscription option to get price details
      const selectedPackage = subscriptionOptions.find(option => option.id === selectedOption);

      if (!selectedPackage) return;

      // Extract price as a number (removing currency symbol)
      const priceString = selectedPackage.price.replace(/[^0-9.]/g, '');
      const amount = parseFloat(priceString);

      // Extract currency symbol (assuming $ for simplicity)
      const currency = selectedPackage.price.replace(/[0-9.]/g, '').trim() || 'USD';

      // Store subscription details in database
      const { error } = await supabase
        .from('payments')
        .insert({
          puuid: userData.puuid,
          amount: amount,
          currency: currency,
          paymentDate: new Date().toISOString(),
          paymentType: 'subscription',
          paymentStatus: 'completed',
          receipts: JSON.stringify(customerInfo)
        });

      if (error) {
        console.error('Error updating premium status:', error);
      }
    } catch (error) {
      console.error('Failed to update premium status:', error);
    }
  };

  const renderFeatureItem = (text: string) => (
    <View style={styles.featureItem}>
      <FontAwesome name="check-circle" size={20} color={colors.win} style={styles.featureIcon} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.win} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="angles-left" color={colors.darkGray} size={20} />
          </TouchableOpacity>
          {/* <Text style={styles.headerTitle}>Premium Subscription</Text> */}
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <FontAwesome name="crown" size={50} color={colors.white} style={styles.heroIcon} />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium</Text>
          <Text style={styles.heroSubtitle}>Enjoy an enhanced gaming experience with exclusive features</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>

          <View style={styles.featuresGrid}>
            {renderFeatureItem('Access to Exclusive Valorant Stats')}
            {renderFeatureItem('Ad-free experience throughout the app')}
            {renderFeatureItem('Exclusive premium-only games and content')}
            {renderFeatureItem('Early access to new game releases')}
            {renderFeatureItem('Premium profile badge and status')}
          </View>
        </View>

        {/* Subscription Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>

          <View style={styles.optionsGrid}>
            {subscriptionOptions.map(option => {
              const isSelected = selectedOption === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.selectedOptionCard,
                    option.isPopular && styles.popularOptionCard,
                  ]}
                  onPress={() => setSelectedOption(option.id)}
                >
                  {option.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}

                  <View style={styles.optionHeader}>
                    <Text style={[
                      styles.optionTitle,
                      isSelected && styles.selectedText
                    ]}>
                      {option.title}
                    </Text>
                    <Text style={[
                      styles.optionDuration,
                      isSelected && styles.selectedSubText
                    ]}>
                      {option.duration}
                    </Text>
                  </View>

                  <View style={styles.optionPriceContainer}>
                    <View style={styles.originalPriceContainer}>
                      <Text style={[
                        styles.originalPrice,
                        isSelected && styles.selectedSubText
                      ]}>
                        {option.id === 'yearly' ? '$59.88' : '$5.99'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionPrice,
                      isSelected && styles.selectedText
                    ]}>
                      {option.price}
                    </Text>
                    {option.pricePerMonth && (
                      <Text style={[
                        styles.optionPricePerMonth,
                        isSelected && styles.selectedSubText
                      ]}>
                        {option.pricePerMonth + ' per month'}
                      </Text>
                    )}
                  </View>

                  {option.savings && (
                    <View style={[
                      styles.savingsBadge,
                      option.id === 'monthly' ? styles.monthlyBadge : {},
                      isSelected && styles.selectedSavingsBadge
                    ]}>
                      <Text style={[
                        styles.savingsText,
                        isSelected && styles.selectedSavingsText
                      ]}>
                        {option.savings}
                      </Text>
                    </View>
                  )}

                  {isSelected && (
                    <View style={styles.selectionIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <FontAwesome name="crown" size={22} color={colors.white} style={styles.buttonIcon} />
              <Text style={styles.subscribeButtonText}>
                Subscribe Now
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    margin: sizes.xl,
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: sizes.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: sizes.sm,
  },
  headerTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    color: colors.black,
    letterSpacing: -0.7,
    marginLeft: sizes.md,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: sizes['4xl'],
    // marginTop: sizes.xl,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.win,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.xl,
    elevation: 5,
    shadowColor: colors.win,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  heroIcon: {
    marginBottom: 0,
  },
  heroTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['8xl'],
    textTransform: 'lowercase',
    color: colors.black,
    textAlign: 'center',
    marginBottom: sizes.md,
  },
  heroSubtitle: {
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.xl,
    color: colors.darkGray,
    textAlign: 'center',
    paddingHorizontal: sizes['4xl'],
    lineHeight: fonts.sizes['3xl'],
  },
  featuresSection: {
    marginBottom: sizes['4xl'],
    backgroundColor: colors.primary,
    padding: sizes.xl,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featuresGrid: {
    flexDirection: 'column',
  },
  sectionTitle: {
    fontFamily: fonts.family.novecentoBold,
    fontSize: fonts.sizes['3xl'],
    color: colors.black,
    textTransform: 'lowercase',
    marginBottom: sizes.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.lg,
  },
  featureIcon: {
    marginRight: sizes.md,
  },
  featureText: {
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.lg,
    color: colors.black,
    flex: 1,
  },
  optionsSection: {
    marginBottom: sizes['4xl'],
    paddingHorizontal: 2, // Add padding to ensure full width is used
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: sizes.lg,
    marginHorizontal: 0, // Remove horizontal margin
    marginBottom: sizes.lg,
    borderWidth: 2,
    borderColor: colors.darkGray,
    position: 'relative',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '48%', // Exact width percentage
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'flex-start', // Changed to better align content
    paddingTop: sizes.xl, // Add more padding at the top
  },
  selectedOptionCard: {
    backgroundColor: colors.win,
  },
  popularOptionCard: {
    borderColor: colors.win,
  },
  optionHeader: {
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  optionTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['5xl'],
    color: colors.black,
    textTransform: 'lowercase',
    textAlign: 'center',
  },
  optionDuration: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.lg,
    color: colors.darkGray,
    marginTop: 2,
    textAlign: 'center',
  },
  optionPriceContainer: {
    alignItems: 'center',
    // marginTop: sizes.md,
    flex: 1,
    justifyContent: 'center',
  },
  originalPriceContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  originalPrice: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.lg,
    color: colors.darkGray,
    textDecorationLine: 'line-through',
  },
  optionPrice: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    color: colors.black,
  },
  optionPricePerMonth: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginTop: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.win,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderBottomLeftRadius: 8,
  },
  popularText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.white,
    textTransform: 'uppercase',
  },
  savingsBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.win + '20',
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderTopLeftRadius: 8,
  },
  monthlyBadge: {
    backgroundColor: colors.win + '15', // Slightly different color for monthly plan
  },
  savingsText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.win,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  // Replace the checkmark with a more visible selection indicator
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.win,
  },
  subscribeButton: {
    backgroundColor: colors.win,
    borderRadius: 12,
    paddingVertical: sizes['2xl'],
    alignItems: 'center',
    marginBottom: sizes.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.win,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonIcon: {
    marginRight: sizes.md,
  },
  subscribeButtonText: {
    fontFamily: fonts.family.novecentoBold,
    fontSize: fonts.sizes['3xl'],
    color: colors.white,
    textTransform: 'lowercase',
  },
  termsText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: sizes['4xl'],
    paddingHorizontal: sizes.xl,
    lineHeight: fonts.sizes.lg,
  },
  basicText: {
    color: colors.darkGray,
  },
  selectedText: {
    color: colors.white,
  },
  selectedSubText: {
    color: colors.white + 'CC', // White with 80% opacity for secondary text
  },
  selectedSavingsBadge: {
    backgroundColor: colors.white + '30',
  },
  selectedSavingsText: {
    color: colors.white,
  },
});

export default PremiumSubscriptionScreen;
