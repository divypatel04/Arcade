import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Card, Icon } from '@components/common';

export interface AgentCardProps {
  agentName: string;
  agentRole: string;
  agentImage: string;
  matches: number;
  kills: number;
  deaths: number;
  winRate: number;
  isPremium?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const getRoleColor = (role: string) => {
  const roleMap: Record<string, string> = {
    duelist: colors.duelist,
    controller: colors.controller,
    initiator: colors.initiator,
    sentinel: colors.sentinel,
  };
  return roleMap[role.toLowerCase()] || colors.primary;
};

const getWinRateColor = (winRate: number) => {
  if (winRate >= 60) return colors.success;
  if (winRate >= 50) return colors.warning;
  return colors.error;
};

export const AgentCard: React.FC<AgentCardProps> = React.memo(({
  agentName,
  agentRole,
  agentImage,
  matches,
  kills,
  deaths,
  winRate,
  isPremium = false,
  onPress,
  style,
}) => {
  const kd = useMemo(
    () => deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
    [kills, deaths]
  );
  
  const roleColor = useMemo(
    () => getRoleColor(agentRole),
    [agentRole]
  );

  const winRateColor = useMemo(
    () => getWinRateColor(winRate),
    [winRate]
  );

  const accessibilityLabel = useMemo(
    () => `${agentName}, ${agentRole} role. ${matches} matches played, ${kd} K/D ratio, ${winRate}% win rate${isPremium ? ', Premium locked' : ''}`,
    [agentName, agentRole, matches, kd, winRate, isPremium]
  );

  return (
    <Card
      elevation="md"
      pressable={!!onPress}
      onPress={onPress}
      style={style}
      contentStyle={styles.content}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={onPress ? "Double tap to view agent details" : undefined}
    >
      {isPremium && (
        <View 
          style={styles.premiumBadge}
          accessibilityLabel="Premium content"
          accessible={true}
        >
          <Icon name="lock" size="xs" color={colors.white} />
        </View>
      )}
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: agentImage }}
          style={styles.agentImage}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={`${agentName} portrait`}
        />
        <View
          style={[
            styles.roleIndicator,
            { backgroundColor: roleColor },
          ]}
          accessible={true}
          accessibilityLabel={`${agentRole} role indicator`}
        />
      </View>
      
      <View style={styles.info}>
        <Text 
          style={styles.agentName} 
          numberOfLines={1}
          accessibilityRole="header"
        >
          {agentName}
        </Text>
        <Text style={styles.agentRole}>{agentRole}</Text>
        
        <View 
          style={styles.statsRow}
          accessible={true}
          accessibilityLabel={`Statistics: ${matches} matches, ${kd} K/D ratio, ${winRate}% win rate`}
        >
          <View style={styles.stat}>
            <Text style={styles.statValue}>{matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statValue}>{kd}</Text>
            <Text style={styles.statLabel}>K/D</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: winRateColor }]}>
              {winRate}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>
      </View>
    </Card>
  );
});

AgentCard.displayName = 'AgentCard';

const styles = StyleSheet.create({
  content: {
    padding: sizes.md,
  },
  premiumBadge: {
    position: 'absolute',
    top: sizes.sm,
    right: sizes.sm,
    backgroundColor: colors.premium,
    borderRadius: sizes.borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: colors.gray100,
    borderRadius: sizes.borderRadius.md,
    overflow: 'hidden',
    marginBottom: sizes.md,
    position: 'relative',
  },
  agentImage: {
    width: '100%',
    height: '100%',
  },
  roleIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  info: {
    flex: 1,
  },
  agentName: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.xs,
  },
  agentRole: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: sizes.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
});

export default AgentCard;
