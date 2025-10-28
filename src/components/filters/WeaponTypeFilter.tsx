import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from '@components/common';

export type WeaponType = 'Rifle' | 'SMG' | 'Sniper' | 'Shotgun' | 'Sidearm' | 'Heavy';

export interface WeaponTypeFilterProps {
  selectedTypes: WeaponType[];
  onTypeToggle: (type: WeaponType) => void;
  multiSelect?: boolean;
}

const WEAPON_ICONS: Record<WeaponType, string> = {
  Rifle: 'pistol',
  SMG: 'bullet',
  Sniper: 'target',
  Shotgun: 'target-variant',
  Sidearm: 'hand-back-left',
  Heavy: 'bomb',
};

export const WeaponTypeFilter: React.FC<WeaponTypeFilterProps> = ({
  selectedTypes,
  onTypeToggle,
  multiSelect = true,
}) => {
  const types: WeaponType[] = ['Rifle', 'SMG', 'Sniper', 'Shotgun', 'Sidearm', 'Heavy'];

  const handlePress = (type: WeaponType) => {
    if (!multiSelect && !selectedTypes.includes(type)) {
      onTypeToggle(type);
    } else {
      onTypeToggle(type);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {types.map((type) => {
        const isSelected = selectedTypes.includes(type);

        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              isSelected && styles.filterChipActive,
            ]}
            onPress={() => handlePress(type)}
            activeOpacity={0.7}
          >
            <Icon
              name={WEAPON_ICONS[type]}
              size="sm"
              color={isSelected ? colors.primary : colors.textSecondary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                isSelected && styles.labelActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    marginRight: sizes.sm,
    borderRadius: sizes.borderRadius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    opacity: 0.15,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  icon: {
    marginRight: sizes.xs,
  },
  label: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
});

export default WeaponTypeFilter;
