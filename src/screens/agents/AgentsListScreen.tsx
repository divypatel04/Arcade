import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { AgentCard, AgentRoleFilter, Icon, EmptyState, SkeletonCard } from '@components';
import type { AgentRole } from '@components';

export const AgentsListScreen: React.FC = () => {
  const [selectedRoles, setSelectedRoles] = useState<AgentRole[]>([]);
  const [sortBy, setSortBy] = useState<'winRate' | 'matches' | 'kd'>('winRate');
  const [isLoading] = useState(false); // Will be connected to actual data loading

  // Mock data
  const mockAgents = useMemo(() => [
    {
      id: '1',
      name: 'Jett',
      role: 'Duelist' as const,
      imageUrl: '',
      wins: 23,
      losses: 15,
      winRate: 60.5,
      matchesPlayed: 38,
      kdRatio: 1.34,
    },
    {
      id: '2',
      name: 'Omen',
      role: 'Controller' as const,
      imageUrl: '',
      wins: 18,
      losses: 12,
      winRate: 60.0,
      matchesPlayed: 30,
      kdRatio: 1.12,
    },
    {
      id: '3',
      name: 'Sage',
      role: 'Sentinel' as const,
      imageUrl: '',
      wins: 15,
      losses: 13,
      winRate: 53.6,
      matchesPlayed: 28,
      kdRatio: 0.98,
    },
    {
      id: '4',
      name: 'Sova',
      role: 'Initiator' as const,
      imageUrl: '',
      wins: 12,
      losses: 10,
      winRate: 54.5,
      matchesPlayed: 22,
      kdRatio: 1.05,
    },
  ], []);

  const handleRoleToggle = useCallback((role: AgentRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  }, []);

  const filteredAgents = useMemo(
    () => mockAgents.filter((agent) =>
      selectedRoles.length === 0 ? true : selectedRoles.includes(agent.role)
    ),
    [mockAgents, selectedRoles]
  );

  const sortedAgents = useMemo(
    () => [...filteredAgents].sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          return b.winRate - a.winRate;
        case 'matches':
          return b.matchesPlayed - a.matchesPlayed;
        case 'kd':
          return b.kdRatio - a.kdRatio;
        default:
          return 0;
      }
    }),
    [filteredAgents, sortBy]
  );

  const handleSortByWinRate = useCallback(() => setSortBy('winRate'), []);
  const handleSortByMatches = useCallback(() => setSortBy('matches'), []);
  const handleSortByKD = useCallback(() => setSortBy('kd'), []);

  const renderHeader = useCallback(() => (
    <View>
      <AgentRoleFilter
        selectedRoles={selectedRoles}
        onRoleToggle={handleRoleToggle}
        multiSelect
      />
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'winRate' && styles.sortButtonActive]}
            onPress={handleSortByWinRate}
          >
            <Text style={[styles.sortText, sortBy === 'winRate' && styles.sortTextActive]}>
              Win Rate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'matches' && styles.sortButtonActive]}
            onPress={handleSortByMatches}
          >
            <Text style={[styles.sortText, sortBy === 'matches' && styles.sortTextActive]}>
              Matches
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'kd' && styles.sortButtonActive]}
            onPress={handleSortByKD}
          >
            <Text style={[styles.sortText, sortBy === 'kd' && styles.sortTextActive]}>
              K/D
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [selectedRoles, handleRoleToggle, sortBy, handleSortByWinRate, handleSortByMatches, handleSortByKD]);

  const renderAgentCard = useCallback(({ item }: any) => (
    <AgentCard
      agentName={item.name}
      agentRole={item.role}
      agentImage={item.imageUrl}
      matches={item.matchesPlayed}
      kills={item.wins * 20} // Mock calculation
      deaths={item.losses * 15} // Mock calculation
      winRate={item.winRate}
      onPress={() => console.log('Agent pressed:', item.name)}
      style={styles.agentCard}
    />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 240, // Approximate card height
      offset: 240 * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <View 
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Agents screen. ${filteredAgents.length} agents available`}
      >
        <Text 
          style={styles.title}
          accessibilityRole="header"
        >
          Agents
        </Text>
        <View style={styles.statsContainer}>
          <Icon name="account-group" size="sm" color={colors.textSecondary} />
          <Text style={styles.statsText}>{filteredAgents.length} Agents</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} variant="agent" style={styles.agentCard} />
          ))}
        </View>
      ) : (
        <FlatList
          data={sortedAgents}
          renderItem={renderAgentCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="account-search"
              title="No Agents Found"
              description="Try adjusting your filters to see more agents"
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={5}
          accessibilityLabel="Agents list"
        />
      )}
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
    alignItems: 'center',
    gap: sizes.xs,
  },
  statsText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
  },
  sortContainer: {
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginRight: sizes.md,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  sortButton: {
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.gray100,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
  },
  sortText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  sortTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.lg,
  },
  loadingContainer: {
    paddingHorizontal: sizes.lg,
    paddingTop: sizes.md,
  },
  agentCard: {
    marginBottom: sizes.md,
  },
});

export default AgentsListScreen;
