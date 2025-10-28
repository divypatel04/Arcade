import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Card, Icon, ProgressBar } from '@components/common';

export interface MapCardProps {
  mapName: string;
  mapImage: string;
  mapLocation?: string;
  wins: number;
  losses: number;
  winRate: number;
  isPremium?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const getWinRateColor = (winRate: number) => {
  if (winRate >= 60) return colors.success;
  if (winRate >= 50) return colors.warning;
  return colors.error;
};

export const MapCard: React.FC<MapCardProps> = React.memo(({
  mapName,
  mapImage,
  mapLocation,
  wins,
  losses,
  winRate,
  isPremium = false,
  onPress,
  style,
}) => {
  const totalMatches = useMemo(() => wins + losses, [wins, losses]);
  const winRateColor = useMemo(() => getWinRateColor(winRate), [winRate]);
  const matchesText = useMemo(
    () => `${totalMatches} ${totalMatches === 1 ? 'Match' : 'Matches'} Played`,
    [totalMatches]
  );

  const accessibilityLabel = useMemo(
    () => `${mapName}${mapLocation ? `, ${mapLocation}` : ''}. ${winRate}% win rate, ${wins} wins, ${losses} losses. ${matchesText}${isPremium ? ', Premium locked' : ''}`,
    [mapName, mapLocation, winRate, wins, losses, matchesText, isPremium]
  );

  return (
    <Card
      elevation="md"
      pressable={!!onPress}
      onPress={onPress}
      style={style}
      contentStyle={styles.content}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={onPress ? "Double tap to view map details" : undefined}
    >
      {isPremium && (
        <View 
          style={styles.premiumBadge}
          accessibilityLabel="Premium content"
          accessible={true}
        >
          <Icon name="lock" size="xs" color={colors.white} />
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: mapImage }}
          style={styles.mapImage}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={`${mapName} map image`}
        />
        <View style={styles.overlay}>
          <Text 
            style={styles.mapName}
            accessibilityRole="header"
          >
            {mapName}
          </Text>
          {mapLocation && (
            <Text style={styles.mapLocation}>{mapLocation}</Text>
          )}
        </View>
      </View>

      <View 
        style={styles.statsContainer}
        accessible={true}
        accessibilityLabel={`Map statistics: ${winRate}% win rate, ${wins} wins, ${losses} losses, ${matchesText}`}
      >
        <View style={styles.winRateContainer}>
          <Text style={[styles.winRateValue, { color: winRateColor }]}>
            {winRate}%
          </Text>
          <Text style={styles.winRateLabel}>Win Rate</Text>
        </View>

        <View style={styles.recordContainer}>
          <View style={styles.recordItem}>
            <Text style={[styles.recordValue, { color: colors.success }]}>
              {wins}
            </Text>
            <Text style={styles.recordLabel}>Wins</Text>
          </View>

          <View style={styles.recordDivider} />

          <View style={styles.recordItem}>
            <Text style={[styles.recordValue, { color: colors.error }]}>
              {losses}
            </Text>
            <Text style={styles.recordLabel}>Losses</Text>
          </View>
        </View>

        <ProgressBar
          progress={winRate}
          height={6}
          progressColor={winRateColor}
          animated
          style={styles.progressBar}
        />

        <Text style={styles.totalMatches}>
          {matchesText}
        </Text>
      </View>
    </Card>
  );
});

MapCard.displayName = 'MapCard';

const styles = StyleSheet.create({
  content: {
    padding: 0,
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
    height: 150,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: sizes.md,
  },
  mapName: {
    ...fonts.styles.h5,
    color: colors.white,
  },
  mapLocation: {
    ...fonts.styles.caption,
    color: colors.white,
    opacity: 0.8,
    marginTop: sizes.xs,
  },
  statsContainer: {
    padding: sizes.md,
  },
  winRateContainer: {
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  winRateValue: {
    ...fonts.styles.statValue,
    fontSize: fonts.sizes['4xl'],
  },
  winRateLabel: {
    ...fonts.styles.label,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: sizes.md,
  },
  recordItem: {
    alignItems: 'center',
  },
  recordValue: {
    ...fonts.styles.h5,
  },
  recordLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  recordDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  progressBar: {
    marginBottom: sizes.sm,
  },
  totalMatches: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MapCard;
