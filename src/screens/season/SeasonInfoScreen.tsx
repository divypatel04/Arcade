import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import {
  Dropdown,
  RankBadge,
  StatCard,
  ChartCard,
  CircularProgress,
  Icon,
} from '@components';
import type { DropdownOption, ChartData } from '@components';

export const SeasonInfoScreen: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('ep8-act3');

  const seasonOptions: DropdownOption[] = [
    { label: 'Episode 8: Act 3', value: 'ep8-act3', icon: 'trophy' },
    { label: 'Episode 8: Act 2', value: 'ep8-act2', icon: 'trophy' },
    { label: 'Episode 8: Act 1', value: 'ep8-act1', icon: 'trophy' },
  ];

  // Mock data
  const seasonData = {
    rank: 'Diamond 2',
    tier: 2,
    rr: 67,
    wins: 45,
    losses: 32,
    winRate: 58.4,
    totalMatches: 77,
  };

  const rankProgressionData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [1200, 1350, 1280, 1420],
      },
    ],
  };

  const winLossData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [8, 12, 9, 16],
        color: () => colors.success,
      },
      {
        data: [6, 5, 7, 4],
        color: () => colors.error,
      },
    ],
    legend: ['Wins', 'Losses'],
  };

  const agentUsageData = [
    { name: 'Jett', population: 38, color: colors.duelist, legendFontColor: colors.textPrimary, legendFontSize: 12 },
    { name: 'Omen', population: 30, color: colors.controller, legendFontColor: colors.textPrimary, legendFontSize: 12 },
    { name: 'Sage', population: 20, color: colors.sentinel, legendFontColor: colors.textPrimary, legendFontSize: 12 },
    { name: 'Sova', population: 12, color: colors.initiator, legendFontColor: colors.textPrimary, legendFontSize: 12 },
  ];

  const topAgents = [
    { name: 'Jett', matches: 38, winRate: 60.5, kd: 1.34 },
    { name: 'Omen', matches: 30, winRate: 60.0, kd: 1.12 },
    { name: 'Sage', matches: 20, winRate: 55.0, kd: 0.98 },
  ];

  const topMaps = [
    { name: 'Ascent', matches: 18, winRate: 66.7 },
    { name: 'Haven', matches: 15, winRate: 60.0 },
    { name: 'Bind', matches: 14, winRate: 57.1 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Season Statistics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Season Selector */}
        <View style={styles.section}>
          <Dropdown
            options={seasonOptions}
            selectedValue={selectedSeason}
            onSelect={setSelectedSeason}
            label="Select Season"
          />
        </View>

        {/* Rank Display */}
        <View style={styles.section}>
          <View style={styles.rankContainer}>
            <RankBadge
              rank={seasonData.rank}
              tier={seasonData.tier}
              rr={seasonData.rr}
              size="lg"
              showProgress
            />
          </View>
        </View>

        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Matches"
              value={seasonData.totalMatches}
              icon="controller"
              style={styles.statCard}
            />
            <StatCard
              label="Wins"
              value={seasonData.wins}
              icon="trophy"
              iconColor={colors.success}
              style={styles.statCard}
            />
            <StatCard
              label="Losses"
              value={seasonData.losses}
              icon="close"
              iconColor={colors.error}
              style={styles.statCard}
            />
            <StatCard
              label="Win Rate"
              value={`${seasonData.winRate}%`}
              icon="chart-line"
              iconColor={colors.primary}
              trend="up"
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Win Rate Circle */}
        <View style={styles.section}>
          <View style={styles.circularProgressContainer}>
            <CircularProgress
              progress={seasonData.winRate}
              size={150}
              strokeWidth={12}
              showPercentage
              label="Win Rate"
              animated
            />
          </View>
        </View>

        {/* Rank Progression Chart */}
        <View style={styles.section}>
          <ChartCard
            title="Rank Progression (RR)"
            type="line"
            data={rankProgressionData}
            height={220}
          />
        </View>

        {/* Win/Loss Graph */}
        <View style={styles.section}>
          <ChartCard
            title="Win/Loss Trend"
            type="bar"
            data={winLossData}
            height={220}
          />
        </View>

        {/* Agent Usage */}
        <View style={styles.section}>
          <ChartCard
            title="Agent Usage Breakdown"
            type="pie"
            data={agentUsageData}
            height={250}
          />
        </View>

        {/* Top Agents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Agents</Text>
          {topAgents.map((agent, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Icon name="account" size="md" color={colors.primary} />
                <View style={styles.listItemText}>
                  <Text style={styles.listItemTitle}>{agent.name}</Text>
                  <Text style={styles.listItemSubtitle}>{agent.matches} matches</Text>
                </View>
              </View>
              <View style={styles.listItemRight}>
                <Text style={styles.listItemValue}>{agent.winRate}%</Text>
                <Text style={styles.listItemLabel}>Win Rate</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Maps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Map Performance</Text>
          {topMaps.map((map, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Icon name="map" size="md" color={colors.primary} />
                <View style={styles.listItemText}>
                  <Text style={styles.listItemTitle}>{map.name}</Text>
                  <Text style={styles.listItemSubtitle}>{map.matches} matches</Text>
                </View>
              </View>
              <View style={styles.listItemRight}>
                <Text style={styles.listItemValue}>{map.winRate}%</Text>
                <Text style={styles.listItemLabel}>Win Rate</Text>
              </View>
            </View>
          ))}
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
    backgroundColor: colors.surface,
    paddingHorizontal: sizes.lg,
    paddingTop: sizes.xl,
    paddingBottom: sizes.md,
  },
  title: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
  },
  section: {
    padding: sizes.lg,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  rankContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.xl,
    ...shadows.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -sizes.xs,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: sizes.xs,
    marginBottom: sizes.sm,
  },
  circularProgressContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.xl,
    ...shadows.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    marginBottom: sizes.sm,
    ...shadows.sm,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemText: {
    marginLeft: sizes.md,
  },
  listItemTitle: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  listItemSubtitle: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemValue: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold,
  },
  listItemLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
});

export default SeasonInfoScreen;
