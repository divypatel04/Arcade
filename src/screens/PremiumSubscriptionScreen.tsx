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
import { useTranslation } from 'react-i18next';
import { useDataContext } from '../context/DataContext';
import { supabase } from '../lib/supabase';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { REVENUECAT_ANDROID_API_KEY, REVENUECAT_IOS_API_KEY } from '@env';

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
    savings: null,
    isPopular: false,
    productId: 'arcade_premium_monthly',
  },
  {
    id: 'quarterly',
    title: 'Quarterly',
    price: '$11.99',
    pricePerMonth: '$3.99',
    duration: '3 months',
    savings: 'Save 20%',
    isPopular: true,
    productId: 'arcade_premium_quarterly',
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '$39.99',
    pricePerMonth: '$3.33',
    duration: '12 months',
    savings: 'Save 33%',
    isPopular: false,
    productId: 'arcade_premium_yearly',
  },
];

const PremiumSubscriptionScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userData, fetchUserData } = useDataContext();

  const [selectedOption, setSelectedOption] = useState<string>('quarterly');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [subscriptionOptions, setSubscriptionOptions] = useState<SubscriptionOption[]>(defaultOptions);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Initialize RevenueCat
  useEffect(() => {
    const setupRevenueCat = async () => {
      try {
        // Add your RevenueCat API keys
        const apiKey = Platform.select({
          ios: REVENUECAT_IOS_API_KEY,
          android: REVENUECAT_ANDROID_API_KEY,
        });

        if (!apiKey) return;

        // Initialize RevenueCat SDK
        await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        await Purchases.configure({ apiKey, appUserID: userData?.puuid });

        // Get available packages
        const offerings = await Purchases.getOfferings();

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
        console.error('Failed to configure RevenueCat:', error);
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

      // Make the purchase
      const { customerInfo, productIdentifier } = await Purchases.purchasePackage(packageToPurchase);

      // Check if the user is entitled to premium
      if (customerInfo?.entitlements.active['premium']) {
        // Update user's premium status in database
        await updateUserPremiumStatus(customerInfo);

        // Show success message
        Alert.alert(
          t('premium.purchaseSuccessTitle'),
          t('premium.purchaseSuccessMessage'),
          [
            {
              text: t('common.ok'),
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
      if (!error.userCancelled) {
        Alert.alert(
          t('premium.purchaseErrorTitle'),
          error.message || t('premium.purchaseErrorMessage')
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPremiumStatus = async (customerInfo: CustomerInfo) => {
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
          <Text style={styles.headerTitle}>{t('premium.premiumSubscription')}</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <FontAwesome name="crown" size={60} color={colors.win} style={styles.heroIcon} />
          <Text style={styles.heroTitle}>{t('premium.unlockPremium')}</Text>
          <Text style={styles.heroSubtitle}>{t('premium.enhancedExperience')}</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>{t('premium.premiumFeatures')}</Text>

          {renderFeatureItem(t('premium.feature1'))}
          {renderFeatureItem(t('premium.feature2'))}
          {renderFeatureItem(t('premium.feature3'))}
          {renderFeatureItem(t('premium.feature4'))}
          {renderFeatureItem(t('premium.feature5'))}
          {renderFeatureItem(t('premium.feature6'))}
        </View>

        {/* Subscription Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>{t('premium.chooseYourPlan')}</Text>

          {subscriptionOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.selectedOptionCard,
                option.isPopular && styles.popularOptionCard,
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={styles.optionContent}>
                <View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDuration}>{option.duration}</Text>
                </View>

                <View style={styles.optionPriceContainer}>
                  <Text style={styles.optionPrice}>{option.price}</Text>
                  {option.pricePerMonth && (
                    <Text style={styles.optionPricePerMonth}>
                      {t('premium.perMonth', { price: option.pricePerMonth })}
                    </Text>
                  )}
                </View>
              </View>

              {option.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t('premium.mostPopular')}</Text>
                </View>
              )}

              {option.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{option.savings}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.subscribeButtonText}>
              {t('premium.subscribeNow')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <Text style={styles.termsText}>
          {t('premium.termsDescription')}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: sizes.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  header: {
    paddingVertical: sizes.xl,
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
    marginVertical: sizes['4xl'],
  },
  heroIcon: {
    marginBottom: sizes.xl,
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
  },
  sectionTitle: {
    fontFamily: fonts.family.novecentoBold,
    fontSize: fonts.sizes['3xl'],
    color: colors.black,
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
  },
  optionsSection: {
    marginBottom: sizes['4xl'],
  },
  optionCard: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: sizes.xl,
    marginBottom: sizes.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedOptionCard: {
    borderColor: colors.win,
  },
  popularOptionCard: {
    borderColor: colors.win,
    backgroundColor: colors.win + '10',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['3xl'],
    color: colors.black,
    textTransform: 'lowercase',
  },
  optionDuration: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
  },
  optionPriceContainer: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['4xl'],
    color: colors.black,
  },
  optionPricePerMonth: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.win,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderBottomLeftRadius: 5,
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
    borderTopLeftRadius: 5,
  },
  savingsText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.win,
  },
  subscribeButton: {
    backgroundColor: colors.win,
    borderRadius: 10,
    paddingVertical: sizes['2xl'],
    alignItems: 'center',
    marginBottom: sizes.xl,
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
  },
});

export default PremiumSubscriptionScreen;
