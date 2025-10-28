import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface AgentBoxProps {
  agentName?: string;
  agentImage?: string;
  kills?: number;
  deaths?: number;
  matches?: number;
  onPress?: () => void;
}

export const AgentBox: React.FC<AgentBoxProps> = ({
  agentName,
  agentImage,
  kills = 0,
  deaths = 0,
  matches = 0,
  onPress,
}) => {
  const kd = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);

  if (!agentName || !agentImage) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.emptyState}>
          <Icon name="account-question" size="3xl" color={colors.gray400} />
          <Text style={styles.emptyText}>No Agent Data</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Top Agent</Text>
        <Icon name="chevron-right" size="sm" color={colors.textSecondary} />
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: agentImage }}
            style={styles.agentImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.agentName} numberOfLines={1}>
            {agentName}
          </Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{kd}</Text>
              <Text style={styles.statLabel}>K/D</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{matches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  title: {
    ...fonts.styles.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.gray100,
    overflow: 'hidden',
    marginRight: sizes.md,
  },
  agentImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  agentName: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...fonts.styles.h6,
    color: colors.primary,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: sizes.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: sizes.xl,
  },
  emptyText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginTop: sizes.sm,
  },
});

export default AgentBox;
