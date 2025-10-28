import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { MatchBox, Icon, EmptyState, Dropdown } from '@components';
import type { DropdownOption } from '@components';

export const MatchesListScreen: React.FC = () => {
  const [filterMode, setFilterMode] = useState<string>('all');

  const modeOptions: DropdownOption[] = [
    { label: 'All Modes', value: 'all', icon: 'controller' },
    { label: 'Competitive', value: 'competitive', icon: 'trophy' },
    { label: 'Unrated', value: 'unrated', icon: 'play' },
    { label: 'Spike Rush', value: 'spike-rush', icon: 'flash' },
  ];

  // Mock data
  const mockMatches = [
    {
      id: '1',
      result: 'Win' as const,
      map: 'Ascent',
      score: '13-10',
      agent: 'Jett',
      agentImageUrl: '',
      kills: 24,
      deaths: 18,
      assists: 7,
      date: new Date(),
      mode: 'Competitive',
    },
    {
      id: '2',
      result: 'Loss' as const,
      map: 'Haven',
      score: '11-13',
      agent: 'Reyna',
      agentImageUrl: '',
      kills: 19,
      deaths: 21,
      assists: 4,
      date: new Date(Date.now() - 86400000),
      mode: 'Competitive',
    },
    {
      id: '3',
      result: 'Win' as const,
      map: 'Bind',
      score: '13-8',
      agent: 'Omen',
      agentImageUrl: '',
      kills: 16,
      deaths: 15,
      assists: 11,
      date: new Date(Date.now() - 172800000),
      mode: 'Unrated',
    },
    {
      id: '4',
      result: 'Win' as const,
      map: 'Split',
      score: '13-11',
      agent: 'Sage',
      agentImageUrl: '',
      kills: 18,
      deaths: 17,
      assists: 9,
      date: new Date(Date.now() - 259200000),
      mode: 'Competitive',
    },
  ];

  const filteredMatches = mockMatches.filter((match) =>
    filterMode === 'all' ? true : match.mode.toLowerCase() === filterMode
  );

  const stats = {
    total: mockMatches.length,
    wins: mockMatches.filter((m) => m.result === 'Win').length,
    losses: mockMatches.filter((m) => m.result === 'Loss').length,
    winRate: ((mockMatches.filter((m) => m.result === 'Win').length / mockMatches.length) * 100).toFixed(1),
  };

  const renderHeader = () => (
    <View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{stats.wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.error }]}>{stats.losses}</Text>
          <Text style={styles.statLabel}>Losses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.winRate}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Dropdown
          options={modeOptions}
          selectedValue={filterMode}
          onSelect={setFilterMode}
          placeholder="Filter by mode"
          size="sm"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match History</Text>
        <TouchableOpacity>
          <Icon name="filter-variant" size="md" color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMatches}
        renderItem={({ item }) => (
          <MatchBox
            {...item}
            onPress={() => console.log('Match pressed:', item.id)}
            style={styles.matchCard}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title="No Matches Found"
            description="No matches found for the selected filter"
          />
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    marginBottom: sizes.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  filterContainer: {
    paddingBottom: sizes.md,
  },
  listContent: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.lg,
  },
  matchCard: {
    marginBottom: sizes.sm,
  },
});

export default MatchesListScreen;
