import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface SubscriptionFeature {
  text: string;
  icon?: string;
}

export interface SubscriptionCardProps {
  title: string;
  price: string;
  period?: string;
  features: SubscriptionFeature[];
  isActive?: boolean;
  isPopular?: boolean;
  onPress: () => void;
  buttonText?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  period = 'month',
  features,
  isActive = false,
  isPopular = false,
  onPress,
  buttonText = 'Subscribe',
}) => {
  return (
    <View
      style={[
        styles.container,
        isActive && styles.containerActive,
        isPopular && styles.containerPopular,
      ]}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      {isActive && (
        <View style={styles.activeBadge}>
          <Icon name="check-circle" size="sm" color={colors.success} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{period}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Icon
              name={feature.icon || 'check'}
              size="sm"
              color={isPopular ? colors.primary : colors.success}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          isActive && styles.buttonActive,
          isPopular && styles.buttonPopular,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={isActive}
      >
        <Text
          style={[
            styles.buttonText,
            isActive && styles.buttonTextActive,
            isPopular && styles.buttonTextPopular,
          ]}
        >
          {isActive ? 'Current Plan' : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.lg,
    marginVertical: sizes.sm,
    borderWidth: 2,
    borderColor: colors.gray200,
    ...shadows.md,
  },
  containerActive: {
    borderColor: colors.success,
  },
  containerPopular: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.md,
  },
  popularText: {
    ...fonts.styles.caption,
    fontWeight: fonts.weights.bold,
    color: colors.white,
  },
  activeBadge: {
    position: 'absolute',
    top: sizes.sm,
    right: sizes.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    opacity: 0.1,
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  activeText: {
    ...fonts.styles.caption,
    color: colors.success,
    marginLeft: sizes.xs,
    fontWeight: fonts.weights.medium,
  },
  title: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.sm,
    marginTop: sizes.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: sizes.lg,
  },
  price: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold,
  },
  period: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginLeft: sizes.xs,
  },
  featuresContainer: {
    marginBottom: sizes.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  featureIcon: {
    marginRight: sizes.sm,
  },
  featureText: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    flex: 1,
  },
  button: {
    backgroundColor: colors.gray200,
    paddingVertical: sizes.md,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.gray300,
  },
  buttonPopular: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...fonts.styles.button,
    color: colors.textPrimary,
  },
  buttonTextActive: {
    color: colors.success,
  },
  buttonTextPopular: {
    color: colors.white,
  },
});

export default SubscriptionCard;
