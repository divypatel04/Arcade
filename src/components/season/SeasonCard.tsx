import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface SeasonStats {
  wins: number;
  losses: number;
  winRate: number;
  rank?: string;
  totalMatches: number;
}

export interface SeasonCardProps {
  seasonName: string;
  episode?: string;
  isActive?: boolean;
  stats: SeasonStats;
  onPress?: () => void;
  collapsible?: boolean;
}

export const SeasonCard: React.FC<SeasonCardProps> = ({
  seasonName,
  episode,
  isActive = false,
  stats,
  onPress,
  collapsible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.seasonName}>{seasonName}</Text>
          {episode && <Text style={styles.episode}>{episode}</Text>}
          {isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          )}
        </View>
        {collapsible && (
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size="md"
            color={colors.textSecondary}
          />
        )}
      </View>

      {(isExpanded || !collapsible) && (
        <View style={styles.content}>
          {stats.rank && (
            <View style={styles.rankContainer}>
              <Icon name="shield-star" size="md" color={colors.primary} />
              <Text style={styles.rank}>{stats.rank}</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Matches</Text>
              <Text style={styles.statValue}>{stats.totalMatches}</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Wins</Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats.wins}
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Losses</Text>
              <Text style={[styles.statValue, { color: colors.error }]}>
                {stats.losses}
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Win Rate</Text>
              <Text style={styles.statValue}>{stats.winRate}%</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    marginVertical: sizes.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  containerActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seasonName: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    marginRight: sizes.sm,
  },
  episode: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginRight: sizes.sm,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  activeText: {
    ...fonts.styles.caption,
    color: colors.white,
    fontWeight: fonts.weights.bold,
    fontSize: 10,
  },
  content: {
    marginTop: sizes.md,
    paddingTop: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.md,
    alignSelf: 'flex-start',
  },
  rank: {
    ...fonts.styles.body,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    marginLeft: sizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  statValue: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
  },
});

export default SeasonCard;
