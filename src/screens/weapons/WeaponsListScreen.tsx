import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { WeaponCard, WeaponTypeFilter, Icon, EmptyState } from '@components';
import type { WeaponType } from '@components';

export const WeaponsListScreen: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<WeaponType[]>([]);

  // Mock data
  const mockWeapons = [
    {
      id: '1',
      name: 'Vandal',
      type: 'Rifle' as WeaponType,
      imageUrl: '',
      kills: 892,
      headshotPercentage: 28.5,
      accuracy: 22.3,
    },
    {
      id: '2',
      name: 'Phantom',
      type: 'Rifle' as WeaponType,
      imageUrl: '',
      kills: 756,
      headshotPercentage: 26.2,
      accuracy: 24.1,
    },
    {
      id: '3',
      name: 'Operator',
      type: 'Sniper' as WeaponType,
      imageUrl: '',
      kills: 234,
      headshotPercentage: 45.8,
      accuracy: 31.5,
    },
    {
      id: '4',
      name: 'Sheriff',
      type: 'Sidearm' as WeaponType,
      imageUrl: '',
      kills: 167,
      headshotPercentage: 38.2,
      accuracy: 18.7,
    },
  ];

  const handleTypeToggle = (type: WeaponType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredWeapons = mockWeapons.filter((weapon) =>
    selectedTypes.length === 0 ? true : selectedTypes.includes(weapon.type)
  );

  const renderHeader = () => (
    <WeaponTypeFilter
      selectedTypes={selectedTypes}
      onTypeToggle={handleTypeToggle}
      multiSelect
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weapons</Text>
        <View style={styles.statsContainer}>
          <Icon name="pistol" size="sm" color={colors.textSecondary} />
          <Text style={styles.statsText}>{filteredWeapons.length} Weapons</Text>
        </View>
      </View>

      <FlatList
        data={filteredWeapons}
        renderItem={({ item }) => (
          <WeaponCard
            {...item}
            onPress={() => console.log('Weapon pressed:', item.name)}
            style={styles.weaponCard}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="pistol"
            title="No Weapons Found"
            description="Try adjusting your filters to see more weapons"
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
  listContent: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.lg,
  },
  weaponCard: {
    marginBottom: sizes.md,
  },
});

export default WeaponsListScreen;
