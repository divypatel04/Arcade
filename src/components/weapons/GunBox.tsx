import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface GunBoxProps {
  weaponName?: string;
  weaponImage?: string;
  kills?: number;
  headshotPercentage?: number;
  onPress?: () => void;
}

export const GunBox: React.FC<GunBoxProps> = ({
  weaponName,
  weaponImage,
  kills = 0,
  headshotPercentage = 0,
  onPress,
}) => {
  if (!weaponName || !weaponImage) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.emptyState}>
          <Icon name="pistol" size="2xl" color={colors.gray400} />
          <Text style={styles.emptyText}>No Weapon Data</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Top Weapon</Text>
        <Icon name="chevron-right" size="sm" color={colors.textSecondary} />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: weaponImage }}
          style={styles.weaponImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.weaponName} numberOfLines={1}>
        {weaponName}
      </Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Icon name="crosshairs-gps" size="sm" color={colors.primary} />
          <Text style={styles.statValue}>{kills}</Text>
          <Text style={styles.statLabel}>Kills</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Icon name="bullseye-arrow" size="sm" color={colors.error} />
          <Text style={styles.statValue}>{headshotPercentage}%</Text>
          <Text style={styles.statLabel}>HS%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  title: {
    ...fonts.styles.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  imageContainer: {
    width: '100%',
    height: 60,
    backgroundColor: colors.gray100,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.sm,
    padding: sizes.sm,
  },
  weaponImage: {
    width: '100%',
    height: '100%',
  },
  weaponName: {
    ...fonts.styles.body,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: sizes.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    marginTop: sizes.xs,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: sizes.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.xl,
  },
  emptyText: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.sm,
  },
});

export default GunBox;
