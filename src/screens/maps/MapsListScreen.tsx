import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { MapCard, Icon, EmptyState } from '@components';

export const MapsListScreen: React.FC = () => {
  const [sortBy, setSortBy] = useState<'winRate' | 'matches'>('winRate');

  // Mock data
  const mockMaps = [
    {
      id: '1',
      name: 'Ascent',
      imageUrl: '',
      wins: 18,
      losses: 12,
      winRate: 60.0,
    },
    {
      id: '2',
      name: 'Haven',
      imageUrl: '',
      wins: 15,
      losses: 14,
      winRate: 51.7,
    },
    {
      id: '3',
      name: 'Bind',
      imageUrl: '',
      wins: 14,
      losses: 11,
      winRate: 56.0,
    },
    {
      id: '4',
      name: 'Split',
      imageUrl: '',
      wins: 12,
      losses: 13,
      winRate: 48.0,
    },
    {
      id: '5',
      name: 'Icebox',
      imageUrl: '',
      wins: 10,
      losses: 12,
      winRate: 45.5,
    },
  ];

  const sortedMaps = [...mockMaps].sort((a, b) => {
    switch (sortBy) {
      case 'winRate':
        return b.winRate - a.winRate;
      case 'matches':
        return (b.wins + b.losses) - (a.wins + a.losses);
      default:
        return 0;
    }
  });

  const renderHeader = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      <View style={styles.sortOptions}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'winRate' && styles.sortButtonActive]}
          onPress={() => setSortBy('winRate')}
        >
          <Text style={[styles.sortText, sortBy === 'winRate' && styles.sortTextActive]}>
            Win Rate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'matches' && styles.sortButtonActive]}
          onPress={() => setSortBy('matches')}
        >
          <Text style={[styles.sortText, sortBy === 'matches' && styles.sortTextActive]}>
            Matches Played
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maps</Text>
        <View style={styles.statsContainer}>
          <Icon name="map" size="sm" color={colors.textSecondary} />
          <Text style={styles.statsText}>{mockMaps.length} Maps</Text>
        </View>
      </View>

      <FlatList
        data={sortedMaps}
        renderItem={({ item }) => (
          <MapCard
            {...item}
            onPress={() => console.log('Map pressed:', item.name)}
            style={styles.mapCard}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="map-search"
            title="No Maps Found"
            description="No map statistics available"
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
  mapCard: {
    marginBottom: sizes.md,
  },
});

export default MapsListScreen;
