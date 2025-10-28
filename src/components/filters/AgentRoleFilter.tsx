import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from '@components/common';

export type AgentRole = 'Controller' | 'Duelist' | 'Initiator' | 'Sentinel';

export interface AgentRoleFilterProps {
  selectedRoles: AgentRole[];
  onRoleToggle: (role: AgentRole) => void;
  multiSelect?: boolean;
}

const ROLE_ICONS: Record<AgentRole, string> = {
  Controller: 'smoke',
  Duelist: 'sword',
  Initiator: 'information',
  Sentinel: 'shield',
};

const ROLE_COLORS: Record<AgentRole, string> = {
  Controller: colors.controller,
  Duelist: colors.duelist,
  Initiator: colors.initiator,
  Sentinel: colors.sentinel,
};

export const AgentRoleFilter: React.FC<AgentRoleFilterProps> = ({
  selectedRoles,
  onRoleToggle,
  multiSelect = true,
}) => {
  const roles: AgentRole[] = ['Controller', 'Duelist', 'Initiator', 'Sentinel'];

  const handlePress = (role: AgentRole) => {
    if (!multiSelect && !selectedRoles.includes(role)) {
      onRoleToggle(role);
    } else {
      onRoleToggle(role);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {roles.map((role) => {
        const isSelected = selectedRoles.includes(role);
        const roleColor = ROLE_COLORS[role];

        return (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterChip,
              isSelected && styles.filterChipActive,
              isSelected && { backgroundColor: roleColor, opacity: 0.15 },
            ]}
            onPress={() => handlePress(role)}
            activeOpacity={0.7}
          >
            <Icon
              name={ROLE_ICONS[role]}
              size="sm"
              color={isSelected ? roleColor : colors.textSecondary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                isSelected && styles.labelActive,
                isSelected && { color: roleColor },
              ]}
            >
              {role}
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
    fontWeight: fonts.weights.bold,
  },
});

export default AgentRoleFilter;
