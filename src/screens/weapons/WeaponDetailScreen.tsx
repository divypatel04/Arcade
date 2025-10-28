import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import {
  Icon,
  Button,
  StatCard,
  ChartCard,
  DetailedStats,
} from '@components';
import type { ChartData, StatSection } from '@components';

export const WeaponDetailScreen: React.FC = () => {
  // Mock data
  const weaponData = {
    name: 'Vandal',
    type: 'Rifle',
    imageUrl: '',
    description: 'Fully automatic rifle with high power and accuracy.',
  };

  const stats = {
    kills: 892,
    headshotPercentage: 28.5,
    accuracy: 22.3,
    avgDamage: 142,
    totalShots: 3980,
    bodyshots: 2014,
    legshots: 612,
  };

  const performanceChartData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [210, 235, 218, 229],
      },
    ],
  };

  const detailedStats: StatSection[] = [
    {
      title: 'Kill Statistics',
      stats: [
        { label: 'Total Kills', value: stats.kills, icon: 'target' },
        { label: 'Headshot %', value: `${stats.headshotPercentage}%`, icon: 'bullseye', color: colors.success },
        { label: 'Accuracy', value: `${stats.accuracy}%`, icon: 'chart-line' },
        { label: 'Avg Damage', value: stats.avgDamage, icon: 'lightning-bolt' },
      ],
    },
    {
      title: 'Shot Distribution',
      stats: [
        { label: 'Total Shots', value: stats.totalShots, icon: 'bullet' },
        { label: 'Headshots', value: Math.round(stats.kills * (stats.headshotPercentage / 100)), icon: 'head' },
        { label: 'Bodyshots', value: stats.bodyshots, icon: 'human' },
        { label: 'Legshots', value: stats.legshots, icon: 'shoe-print' },
      ],
    },
  ];

  const bestAgents = [
    { name: 'Jett', kills: 342, headshotRate: 31.2 },
    { name: 'Reyna', kills: 287, headshotRate: 29.5 },
    { name: 'Phoenix', kills: 156, headshotRate: 26.3 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weapon Header */}
        <View style={styles.header}>
          <View style={styles.weaponImageContainer}>
            {weaponData.imageUrl ? (
              <Image source={{ uri: weaponData.imageUrl }} style={styles.weaponImage} />
            ) : (
              <View style={styles.weaponImagePlaceholder}>
                <Icon name="pistol" size={80} color={colors.white} />
              </View>
            )}
          </View>
          
          <Text style={styles.weaponName}>{weaponData.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{weaponData.type}</Text>
          </View>
          <Text style={styles.description}>{weaponData.description}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{stats.kills}</Text>
              <Text style={styles.quickStatLabel}>Kills</Text>
            </View>

            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color: colors.success }]}>
                {stats.headshotPercentage}%
              </Text>
              <Text style={styles.quickStatLabel}>Headshot %</Text>
            </View>

            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color: colors.primary }]}>
                {stats.accuracy}%
              </Text>
              <Text style={styles.quickStatLabel}>Accuracy</Text>
            </View>
          </View>
        </View>

        {/* Performance Chart */}
        <View style={styles.section}>
          <ChartCard
            title="Kills Per Week"
            type="bar"
            data={performanceChartData}
            height={200}
          />
        </View>

        {/* Best Agents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Agents with {weaponData.name}</Text>
          {bestAgents.map((agent, index) => (
            <View key={index} style={styles.agentItem}>
              <View style={styles.agentLeft}>
                <Icon name="account" size="md" color={colors.primary} />
                <View style={styles.agentText}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentStats}>
                    {agent.kills} kills • {agent.headshotRate}% HS
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size="sm" color={colors.gray400} />
            </View>
          ))}
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Statistics</Text>
          <DetailedStats sections={detailedStats} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            Compare Weapons
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.secondary,
    paddingTop: sizes.xl,
    paddingBottom: sizes.lg,
    paddingHorizontal: sizes.lg,
    alignItems: 'center',
  },
  weaponImageContainer: {
    marginBottom: sizes.md,
  },
  weaponImage: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
  },
  weaponImagePlaceholder: {
    width: 250,
    height: 100,
    borderRadius: sizes.borderRadius.lg,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weaponName: {
    ...fonts.styles.h2,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.full,
    marginTop: sizes.sm,
  },
  typeText: {
    ...fonts.styles.caption,
    color: colors.white,
    fontWeight: fonts.weights.bold,
    textTransform: 'uppercase',
  },
  description: {
    ...fonts.styles.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: sizes.md,
    opacity: 0.9,
  },
  section: {
    padding: sizes.lg,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.lg,
    ...shadows.md,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold,
  },
  quickStatLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.sm,
  },
  agentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    marginBottom: sizes.sm,
    ...shadows.sm,
  },
  agentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentText: {
    marginLeft: sizes.md,
  },
  agentName: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  agentStats: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  actions: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
  },
  actionButton: {
    width: '100%',
  },
});

export default WeaponDetailScreen;
