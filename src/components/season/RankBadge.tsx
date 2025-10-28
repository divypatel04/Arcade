import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from '@components/common';

export interface RankBadgeProps {
  rank: string;
  tier?: number;
  rr?: number;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  tier,
  rr,
  imageUrl,
  size = 'md',
  showProgress = false,
}) => {
  const sizeConfig = {
    sm: {
      container: 60,
      icon: 32,
      font: fonts.sizes.sm,
    },
    md: {
      container: 80,
      icon: 48,
      font: fonts.sizes.md,
    },
    lg: {
      container: 120,
      icon: 72,
      font: fonts.sizes.lg,
    },
  };

  const config = sizeConfig[size];
  const progress = rr ? Math.min((rr / 100) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badgeContainer,
          {
            width: config.container,
            height: config.container,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.rankImage,
              {
                width: config.icon,
                height: config.icon,
              },
            ]}
            resizeMode="contain"
          />
        ) : (
          <Icon name="shield-star" size={config.icon} color={colors.primary} />
        )}

        {showProgress && rr !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.rankName, { fontSize: config.font }]}>
          {rank}
        </Text>
        {tier !== undefined && (
          <Text style={styles.tier}>Tier {tier}</Text>
        )}
        {rr !== undefined && (
          <Text style={styles.rr}>{rr} RR</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.full,
    padding: sizes.sm,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  rankImage: {
    borderRadius: sizes.borderRadius.full,
  },
  progressContainer: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    paddingHorizontal: sizes.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: sizes.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius.sm,
  },
  infoContainer: {
    marginTop: sizes.md,
    alignItems: 'center',
  },
  rankName: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold,
  },
  tier: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  rr: {
    ...fonts.styles.body,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
    marginTop: sizes.xs,
  },
});

export default RankBadge;
