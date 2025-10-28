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
  CircularProgress,
  DetailedStats,
} from '@components';
import type { ChartData, StatSection } from '@components';

export const MapDetailScreen: React.FC = () => {
  // Mock data
  const mapData = {
    name: 'Ascent',
    location: 'Venice, Italy',
    imageUrl: '',
    description: 'An open playground for small wars of position and attrition divide two sites on Ascent.',
  };

  const stats = {
    wins: 18,
    losses: 12,
    winRate: 60.0,
    totalMatches: 30,
    attackWins: 45,
    attackLosses: 42,
    defenseWins: 51,
    defenseLosses: 36,
  };

  const winRateChartData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [55, 58, 62, 60],
      },
    ],
  };

  const detailedStats: StatSection[] = [
    {
      title: 'Map Statistics',
      stats: [
        { label: 'Total Matches', value: stats.totalMatches, icon: 'controller' },
        { label: 'Wins', value: stats.wins, icon: 'trophy', color: colors.success },
        { label: 'Losses', value: stats.losses, icon: 'close', color: colors.error },
        { label: 'Win Rate', value: `${stats.winRate}%`, icon: 'chart-line', color: colors.primary },
      ],
    },
    {
      title: 'Side Performance',
      stats: [
        { label: 'Attack Wins', value: stats.attackWins, icon: 'sword', color: colors.duelist },
        { label: 'Attack Losses', value: stats.attackLosses, icon: 'close' },
        { label: 'Defense Wins', value: stats.defenseWins, icon: 'shield', color: colors.sentinel },
        { label: 'Defense Losses', value: stats.defenseLosses, icon: 'close' },
      ],
    },
  ];

  const attackWinRate = (stats.attackWins / (stats.attackWins + stats.attackLosses)) * 100;
  const defenseWinRate = (stats.defenseWins / (stats.defenseWins + stats.defenseLosses)) * 100;

  const topAgents = [
    { name: 'Jett', matches: 12, winRate: 66.7 },
    { name: 'Omen', matches: 10, winRate: 60.0 },
    { name: 'Sage', matches: 8, winRate: 62.5 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Header */}
        <View style={styles.header}>
          <View style={styles.mapImageContainer}>
            {mapData.imageUrl ? (
              <Image source={{ uri: mapData.imageUrl }} style={styles.mapImage} />
            ) : (
              <View style={styles.mapImagePlaceholder}>
                <Icon name="map" size={80} color={colors.white} />
              </View>
            )}
          </View>
          
          <Text style={styles.mapName}>{mapData.name}</Text>
          <Text style={styles.location}>{mapData.location}</Text>
          <Text style={styles.description}>{mapData.description}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStat}>
              <CircularProgress
                progress={stats.winRate}
                size={80}
                strokeWidth={8}
                showPercentage
                animated
              />
              <Text style={styles.quickStatLabel}>Win Rate</Text>
            </View>

            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{stats.totalMatches}</Text>
              <Text style={styles.quickStatLabel}>Matches</Text>
            </View>

            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color: colors.success }]}>
                {stats.wins}
              </Text>
              <Text style={styles.quickStatLabel}>Wins</Text>
            </View>
          </View>
        </View>

        {/* Win Rate Chart */}
        <View style={styles.section}>
          <ChartCard
            title="Win Rate Trend"
            type="line"
            data={winRateChartData}
            height={200}
          />
        </View>

        {/* Attack vs Defense */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attack vs Defense</Text>
          <View style={styles.sideComparison}>
            <View style={styles.sideCard}>
              <Icon name="sword" size="lg" color={colors.duelist} />
              <Text style={styles.sideTitle}>Attack</Text>
              <CircularProgress
                progress={attackWinRate}
                size={100}
                strokeWidth={10}
                progressColor={colors.duelist}
                showPercentage
                animated
              />
              <Text style={styles.sideStats}>
                {stats.attackWins}W - {stats.attackLosses}L
              </Text>
            </View>

            <View style={styles.sideCard}>
              <Icon name="shield" size="lg" color={colors.sentinel} />
              <Text style={styles.sideTitle}>Defense</Text>
              <CircularProgress
                progress={defenseWinRate}
                size={100}
                strokeWidth={10}
                progressColor={colors.sentinel}
                showPercentage
                animated
              />
              <Text style={styles.sideStats}>
                {stats.defenseWins}W - {stats.defenseLosses}L
              </Text>
            </View>
          </View>
        </View>

        {/* Best Agents on This Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Agents on This Map</Text>
          {topAgents.map((agent, index) => (
            <View key={index} style={styles.agentItem}>
              <View style={styles.agentLeft}>
                <Icon name="account" size="md" color={colors.primary} />
                <View style={styles.agentText}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentMatches}>{agent.matches} matches</Text>
                </View>
              </View>
              <Text style={styles.agentWinRate}>{agent.winRate}%</Text>
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
          <Button variant="primary" size="lg" style={styles.actionButton}>
            View Recent Matches
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
  mapImageContainer: {
    marginBottom: sizes.md,
  },
  mapImage: {
    width: 200,
    height: 120,
    borderRadius: sizes.borderRadius.lg,
  },
  mapImagePlaceholder: {
    width: 200,
    height: 120,
    borderRadius: sizes.borderRadius.lg,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapName: {
    ...fonts.styles.h2,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  location: {
    ...fonts.styles.body,
    color: colors.gray300,
    marginTop: sizes.xs,
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
  sideComparison: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  sideCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  sideTitle: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    marginVertical: sizes.md,
  },
  sideStats: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.md,
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
  },
  agentText: {
    marginLeft: sizes.md,
  },
  agentName: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  agentMatches: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  agentWinRate: {
    ...fonts.styles.h6,
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  actions: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
  },
  actionButton: {
    width: '100%',
  },
});

export default MapDetailScreen;
