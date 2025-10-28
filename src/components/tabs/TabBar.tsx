import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface TabItem {
  key: string;
  label: string;
  icon: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  showLabels?: boolean;
  style?: any;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  showLabels = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
              <Icon
                name={tab.icon}
                size="lg"
                color={isActive ? colors.primary : colors.textSecondary}
              />
            </View>
            {showLabels && (
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            )}
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingBottom: sizes.sm,
    paddingTop: sizes.xs,
    ...shadows.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.sm,
    position: 'relative',
  },
  iconContainer: {
    padding: sizes.xs,
    borderRadius: sizes.borderRadius.md,
  },
  iconContainerActive: {
    backgroundColor: colors.primaryLight,
    opacity: 0.1,
  },
  label: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: '60%',
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius.sm,
  },
});

export default TabBar;
