import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface MapBoxProps {
  mapName?: string;
  mapImage?: string;
  wins?: number;
  losses?: number;
  winRate?: number;
  onPress?: () => void;
}

export const MapBox: React.FC<MapBoxProps> = ({
  mapName,
  mapImage,
  wins = 0,
  losses = 0,
  winRate = 0,
  onPress,
}) => {
  const getWinRateColor = () => {
    if (winRate >= 60) return colors.success;
    if (winRate >= 50) return colors.warning;
    return colors.error;
  };

  if (!mapName || !mapImage) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.emptyState}>
          <Icon name="map" size="2xl" color={colors.gray400} />
          <Text style={styles.emptyText}>No Map Data</Text>
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
        <Text style={styles.title}>Best Map</Text>
        <Icon name="chevron-right" size="sm" color={colors.textSecondary} />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: mapImage }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.mapName} numberOfLines={1}>
            {mapName}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.winRateContainer}>
          <Text style={[styles.winRateValue, { color: getWinRateColor() }]}>
            {winRate}%
          </Text>
          <Text style={styles.winRateLabel}>Win Rate</Text>
        </View>

        <View style={styles.recordContainer}>
          <Text style={styles.record}>
            <Text style={{ color: colors.success }}>{wins}</Text>
            {' - '}
            <Text style={{ color: colors.error }}>{losses}</Text>
          </Text>
          <Text style={styles.recordLabel}>W - L</Text>
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
    height: 80,
    borderRadius: sizes.borderRadius.md,
    overflow: 'hidden',
    marginBottom: sizes.sm,
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
    padding: sizes.sm,
  },
  mapName: {
    ...fonts.styles.bodySmall,
    color: colors.white,
    fontWeight: fonts.weights.medium,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winRateContainer: {
    alignItems: 'center',
  },
  winRateValue: {
    ...fonts.styles.h6,
  },
  winRateLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  recordContainer: {
    alignItems: 'center',
  },
  record: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
  },
  recordLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
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

export default MapBox;
