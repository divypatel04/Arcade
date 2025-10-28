import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import Icon from './Icon';
import Card from './Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconColor = colors.primary,
  trend,
  trendValue,
  subtitle,
  onPress,
  style,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.success;
      case 'down':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  return (
    <Card
      elevation="sm"
      pressable={!!onPress}
      onPress={onPress}
      style={style}
    >
      <View style={styles.container}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size="lg" color={iconColor} />
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          
          <View style={styles.valueRow}>
            <Text style={styles.value}>{value}</Text>
            
            {trend && trendValue && (
              <View style={styles.trendContainer}>
                <Icon
                  name={getTrendIcon()}
                  size="sm"
                  color={getTrendColor()}
                />
                <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                  {trendValue}
                </Text>
              </View>
            )}
          </View>
          
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: sizes.md,
    width: 40,
    height: 40,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    ...fonts.styles.statLabel,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...fonts.styles.statValue,
    color: colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: sizes.sm,
  },
  trendValue: {
    ...fonts.styles.caption,
    fontWeight: fonts.weights.medium,
    marginLeft: sizes.xs,
  },
  subtitle: {
    ...fonts.styles.caption,
    color: colors.textTertiary,
    marginTop: sizes.xs,
  },
});

export default StatCard;
