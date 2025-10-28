import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon, Button, SubscriptionCard } from '@components';
import type { SubscriptionFeature } from '@components';

export const PremiumScreen: React.FC = () => {
  const premiumFeatures = [
    {
      icon: 'chart-line-variant',
      title: 'Advanced Analytics',
      description: 'Access detailed performance metrics and historical trends',
    },
    {
      icon: 'compare',
      title: 'Agent Comparisons',
      description: 'Compare stats across multiple agents side-by-side',
    },
    {
      icon: 'trophy',
      title: 'Rank Tracking',
      description: 'Monitor your rank progress with detailed charts',
    },
    {
      icon: 'bell-off',
      title: 'No Ads',
      description: 'Enjoy an ad-free experience',
    },
    {
      icon: 'database',
      title: 'Unlimited History',
      description: 'Access your complete match history',
    },
    {
      icon: 'star',
      title: 'Priority Support',
      description: 'Get help faster with priority customer support',
    },
  ];

  const monthlyFeatures: SubscriptionFeature[] = [
    { text: 'All Premium Features', icon: 'check' },
    { text: 'Advanced Analytics', icon: 'check' },
    { text: 'No Advertisements', icon: 'check' },
    { text: 'Priority Support', icon: 'check' },
  ];

  const yearlyFeatures: SubscriptionFeature[] = [
    { text: 'All Monthly Features', icon: 'check' },
    { text: 'Save 40% vs Monthly', icon: 'star' },
    { text: 'Exclusive Badges', icon: 'trophy' },
    { text: 'Early Access to Features', icon: 'flash' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="crown" size={64} color={colors.warning} />
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>
            Unlock advanced features and take your gameplay to the next level
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Icon name={feature.icon} size="lg" color={colors.primary} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          <SubscriptionCard
            title="Monthly"
            price="$4.99"
            period="month"
            features={monthlyFeatures}
            onPress={() => console.log('Monthly selected')}
            buttonText="Subscribe Monthly"
          />

          <SubscriptionCard
            title="Yearly"
            price="$29.99"
            period="year"
            features={yearlyFeatures}
            isPopular
            onPress={() => console.log('Yearly selected')}
            buttonText="Subscribe Yearly"
          />

          <View style={styles.alternativeSection}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              variant="outline"
              size="lg"
              style={styles.adButton}
              onPress={() => console.log('Watch ad')}
            >
              Watch Ad for 24h Premium
            </Button>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Subscriptions automatically renew unless cancelled 24 hours before the end of the current period.
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Terms of Service</Text>
            <Text style={styles.footerSeparator}>•</Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerSeparator}>•</Text>
            <Text style={styles.footerLink}>Restore Purchases</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: sizes['2xl'],
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
    backgroundColor: colors.surface,
  },
  title: {
    ...fonts.styles.h2,
    color: colors.textPrimary,
    marginTop: sizes.md,
    marginBottom: sizes.sm,
  },
  subtitle: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresSection: {
    padding: sizes.lg,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -sizes.xs,
  },
  featureCard: {
    width: '50%',
    padding: sizes.xs,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: sizes.borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  featureTitle: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    marginBottom: sizes.xs,
  },
  featureDescription: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  plansSection: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.lg,
  },
  alternativeSection: {
    marginTop: sizes.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: sizes.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerText: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginHorizontal: sizes.md,
  },
  adButton: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
  },
  footerText: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sizes.md,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    ...fonts.styles.caption,
    color: colors.primary,
  },
  footerSeparator: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginHorizontal: sizes.sm,
  },
});

export default PremiumScreen;
