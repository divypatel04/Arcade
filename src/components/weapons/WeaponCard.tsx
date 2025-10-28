import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Card, Icon, ProgressBar } from '@components/common';

export interface WeaponCardProps {
  weaponName: string;
  weaponImage: string;
  weaponType?: string;
  kills: number;
  headshots: number;
  headshotPercentage: number;
  isPremium?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({
  weaponName,
  weaponImage,
  weaponType,
  kills,
  headshots,
  headshotPercentage,
  isPremium = false,
  onPress,
  style,
}) => {
  return (
    <Card
      elevation="md"
      pressable={!!onPress}
      onPress={onPress}
      style={style}
      contentStyle={styles.content}
    >
      {isPremium && (
        <View style={styles.premiumBadge}>
          <Icon name="lock" size="xs" color={colors.white} />
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: weaponImage }}
          style={styles.weaponImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.weaponName} numberOfLines={1}>
          {weaponName}
        </Text>
        {weaponType && (
          <Text style={styles.weaponType}>{weaponType}</Text>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.mainStat}>
            <Icon name="crosshairs-gps" size="md" color={colors.primary} />
            <Text style={styles.killsValue}>{kills}</Text>
            <Text style={styles.killsLabel}>Kills</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.headshotContainer}>
            <View style={styles.headshotRow}>
              <Icon name="bullseye-arrow" size="sm" color={colors.error} />
              <Text style={styles.headshotValue}>{headshots}</Text>
            </View>
            <Text style={styles.headshotLabel}>Headshots</Text>

            <ProgressBar
              progress={headshotPercentage}
              height={4}
              progressColor={colors.error}
              animated
              style={styles.progressBar}
            />
            <Text style={styles.percentageText}>{headshotPercentage}% HS</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: sizes.md,
  },
  premiumBadge: {
    position: 'absolute',
    top: sizes.sm,
    right: sizes.sm,
    backgroundColor: colors.premium,
    borderRadius: sizes.borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: colors.gray100,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.md,
    padding: sizes.sm,
  },
  weaponImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  weaponName: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  weaponType: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: sizes.xs,
    marginBottom: sizes.md,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  killsValue: {
    ...fonts.styles.h5,
    color: colors.primary,
    marginTop: sizes.xs,
  },
  killsLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: sizes.md,
  },
  headshotContainer: {
    flex: 1,
  },
  headshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.xs,
  },
  headshotValue: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    marginLeft: sizes.xs,
  },
  headshotLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sizes.sm,
  },
  progressBar: {
    marginBottom: sizes.xs,
  },
  percentageText: {
    ...fonts.styles.caption,
    color: colors.error,
    fontWeight: fonts.weights.medium,
    textAlign: 'center',
  },
});

export default WeaponCard;
