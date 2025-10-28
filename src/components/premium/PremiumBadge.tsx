import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from '@components/common';

export interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: ViewStyle;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  size = 'md',
  showLabel = false,
  style,
}) => {
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const containerSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.badge,
          {
            width: containerSizes[size],
            height: containerSizes[size],
          },
        ]}
      >
        <Icon name="crown" size={iconSizes[size]} color={colors.white} />
      </View>
      {showLabel && <Text style={styles.label}>Premium</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.premium,
    borderRadius: sizes.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...fonts.styles.caption,
    color: colors.premium,
    fontWeight: fonts.weights.medium,
    marginLeft: sizes.xs,
  },
});

export default PremiumBadge;
