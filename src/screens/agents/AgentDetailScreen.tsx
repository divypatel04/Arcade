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
  DetailedStats,
  ChartCard,
  CircularProgress,
} from '@components';
import type { StatSection, ChartData } from '@components';

export const AgentDetailScreen: React.FC = () => {
  // Mock data
  const agentData = {
    name: 'Jett',
    role: 'Duelist',
    imageUrl: '',
    description: 'Representing her home country of South Korea, Jett\'s agile and evasive fighting style lets her take risks no one else can.',
  };

  const stats = {
    wins: 23,
    losses: 15,
    winRate: 60.5,
    matchesPlayed: 38,
    kdRatio: 1.34,
    avgKills: 19.2,
    avgDeaths: 14.3,
    avgAssists: 6.8,
  };

  const performanceChartData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [55, 58, 62, 60.5],
      },
    ],
  };

  const detailedStats: StatSection[] = [
    {
      title: 'Combat Performance',
      stats: [
        { label: 'K/D Ratio', value: stats.kdRatio.toFixed(2), icon: 'target', trend: 'up' },
        { label: 'Avg Kills', value: stats.avgKills.toFixed(1), icon: 'skull', trend: 'up' },
        { label: 'Avg Deaths', value: stats.avgDeaths.toFixed(1), icon: 'heart-broken', trend: 'down' },
        { label: 'Avg Assists', value: stats.avgAssists.toFixed(1), icon: 'hand-heart', trend: 'neutral' },
        { label: 'First Bloods', value: '42', icon: 'fire' },
        { label: 'Clutches', value: '8', icon: 'trophy-variant' },
      ],
    },
    {
      title: 'Match Statistics',
      stats: [
        { label: 'Total Matches', value: stats.matchesPlayed, icon: 'controller' },
        { label: 'Wins', value: stats.wins, icon: 'trophy', color: colors.success },
        { label: 'Losses', value: stats.losses, icon: 'close', color: colors.error },
        { label: 'Win Rate', value: `${stats.winRate}%`, icon: 'chart-line', color: colors.primary },
        { label: 'Best Map', value: 'Ascent', icon: 'map' },
        { label: 'Worst Map', value: 'Breeze', icon: 'map' },
      ],
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Duelist':
        return colors.duelist;
      case 'Controller':
        return colors.controller;
      case 'Initiator':
        return colors.initiator;
      case 'Sentinel':
        return colors.sentinel;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Agent Header */}
        <View style={[styles.header, { backgroundColor: getRoleColor(agentData.role) }]}>
          <View style={styles.headerOverlay}>
            <View style={styles.agentImageContainer}>
              {agentData.imageUrl ? (
                <Image
                  source={{ uri: agentData.imageUrl }}
                  style={styles.agentImage}
                />
              ) : (
                <View style={styles.agentImagePlaceholder}>
                  <Icon name="account" size={80} color={colors.white} />
                </View>
              )}
            </View>
            
            <Text style={styles.agentName}>{agentData.name}</Text>
            
            <View style={styles.roleBadge}>
              <Icon name="shield-star" size="sm" color={colors.white} />
              <Text style={styles.roleText}>{agentData.role}</Text>
            </View>

            <Text style={styles.description}>{agentData.description}</Text>
          </View>
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
              <Text style={styles.quickStatValue}>{stats.kdRatio.toFixed(2)}</Text>
              <Text style={styles.quickStatLabel}>K/D Ratio</Text>
            </View>

            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{stats.matchesPlayed}</Text>
              <Text style={styles.quickStatLabel}>Matches</Text>
            </View>
          </View>
        </View>

        {/* Performance Chart */}
        <View style={styles.section}>
          <ChartCard
            title="Win Rate Trend"
            type="line"
            data={performanceChartData}
            height={200}
          />
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Statistics</Text>
          <DetailedStats sections={detailedStats} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            View Matches
          </Button>
          <Button variant="primary" size="lg" style={styles.actionButton}>
            Compare Agents
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
    paddingTop: sizes['2xl'],
    paddingBottom: sizes.xl,
  },
  headerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: sizes.lg,
    alignItems: 'center',
  },
  agentImageContainer: {
    marginBottom: sizes.md,
  },
  agentImage: {
    width: 150,
    height: 150,
    borderRadius: sizes.borderRadius.full,
    borderWidth: 4,
    borderColor: colors.white,
  },
  agentImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: sizes.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  agentName: {
    ...fonts.styles.h2,
    color: colors.white,
    fontWeight: fonts.weights.bold,
    marginBottom: sizes.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.full,
    marginBottom: sizes.md,
    gap: sizes.xs,
  },
  roleText: {
    ...fonts.styles.body,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  description: {
    ...fonts.styles.body,
    color: colors.white,
    textAlign: 'center',
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
  actions: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
    gap: sizes.md,
  },
  actionButton: {
    width: '100%',
  },
});

export default AgentDetailScreen;
