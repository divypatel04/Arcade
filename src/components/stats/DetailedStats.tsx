import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from '@components/common';

export interface StatItem {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface StatSection {
  title: string;
  stats: StatItem[];
}

export interface DetailedStatsProps {
  sections: StatSection[];
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ sections }) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'neutral':
        return 'minus';
      default:
        return undefined;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return colors.success;
      case 'down':
        return colors.error;
      case 'neutral':
        return colors.gray500;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.statsGrid}>
            {section.stats.map((stat, statIndex) => (
              <View key={statIndex} style={styles.statItem}>
                <View style={styles.statHeader}>
                  {stat.icon && (
                    <Icon
                      name={stat.icon}
                      size="md"
                      color={stat.color || colors.textSecondary}
                      style={styles.statIcon}
                    />
                  )}
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                <View style={styles.statValueContainer}>
                  <Text
                    style={[
                      styles.statValue,
                      stat.color && { color: stat.color },
                    ]}
                  >
                    {stat.value}
                  </Text>
                  {stat.trend && (
                    <Icon
                      name={getTrendIcon(stat.trend) || 'minus'}
                      size="sm"
                      color={getTrendColor(stat.trend)}
                      style={styles.trendIcon}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: sizes.lg,
  },
  section: {
    marginBottom: sizes.xl,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
    paddingHorizontal: sizes.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: sizes.xs,
  },
  statItem: {
    width: '50%',
    padding: sizes.xs,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  statIcon: {
    marginRight: sizes.xs,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.md,
    padding: sizes.sm,
    minHeight: 48,
  },
  statValue: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    flex: 1,
  },
  trendIcon: {
    marginLeft: sizes.xs,
  },
});

export default DetailedStats;
