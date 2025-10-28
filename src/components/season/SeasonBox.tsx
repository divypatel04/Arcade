import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon, ProgressBar } from '@components/common';

export interface SeasonBoxProps {
  seasonName?: string;
  rank?: string;
  wins?: number;
  losses?: number;
  winRate?: number;
  totalMatches?: number;
  onPress?: () => void;
}

export const SeasonBox: React.FC<SeasonBoxProps> = ({
  seasonName,
  rank,
  wins = 0,
  losses = 0,
  winRate = 0,
  totalMatches = 0,
  onPress,
}) => {
  const getWinRateColor = () => {
    if (winRate >= 60) return colors.success;
    if (winRate >= 50) return colors.warning;
    return colors.error;
  };

  if (!seasonName) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.emptyState}>
          <Icon name="trophy" size="3xl" color={colors.gray400} />
          <Text style={styles.emptyText}>No Season Data</Text>
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
        <View>
          <Text style={styles.title}>Current Season</Text>
          <Text style={styles.seasonName}>{seasonName}</Text>
        </View>
        <Icon name="chevron-right" size="md" color={colors.textSecondary} />
      </View>

      {rank && (
        <View style={styles.rankContainer}>
          <Icon name="shield-star" size="lg" color={colors.primary} />
          <Text style={styles.rank}>{rank}</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {wins}
            </Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>

          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.error }]}>
              {losses}
            </Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>

          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: getWinRateColor() }]}>
              {winRate}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        <ProgressBar
          progress={winRate}
          height={6}
          progressColor={getWinRateColor()}
          animated
          style={styles.progressBar}
        />

        <Text style={styles.totalMatches}>
          {totalMatches} {totalMatches === 1 ? 'Match' : 'Matches'} Played
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: sizes.md,
  },
  title: {
    ...fonts.styles.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: sizes.xs,
  },
  seasonName: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.md,
  },
  rank: {
    ...fonts.styles.body,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    marginLeft: sizes.sm,
  },
  statsContainer: {
    marginTop: sizes.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: sizes.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...fonts.styles.h5,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  progressBar: {
    marginBottom: sizes.sm,
  },
  totalMatches: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: sizes.xl,
  },
  emptyText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginTop: sizes.sm,
  },
});

export default SeasonBox;
