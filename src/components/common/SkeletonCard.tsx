import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes } from '@theme';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

export interface SkeletonCardProps {
  style?: ViewStyle;
  variant?: 'agent' | 'map' | 'match' | 'stat';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  style, 
  variant = 'agent' 
}) => {
  const renderAgentSkeleton = () => (
    <Card elevation="md" style={style} contentStyle={styles.content}>
      <Skeleton height={150} borderRadius={sizes.borderRadius.md} style={styles.image} />
      <View style={styles.info}>
        <Skeleton width="60%" height={20} style={styles.spacer} />
        <Skeleton width="40%" height={14} style={styles.spacer} />
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Skeleton width={40} height={18} style={styles.spacerSm} />
            <Skeleton width={50} height={12} />
          </View>
          <View style={styles.stat}>
            <Skeleton width={40} height={18} style={styles.spacerSm} />
            <Skeleton width={50} height={12} />
          </View>
          <View style={styles.stat}>
            <Skeleton width={40} height={18} style={styles.spacerSm} />
            <Skeleton width={50} height={12} />
          </View>
        </View>
      </View>
    </Card>
  );

  const renderMapSkeleton = () => (
    <Card elevation="md" style={style} contentStyle={styles.content}>
      <Skeleton height={150} borderRadius={0} />
      <View style={styles.info}>
        <Skeleton width="80%" height={32} style={styles.spacer} />
        <Skeleton width="60%" height={14} style={styles.spacer} />
        <View style={styles.recordRow}>
          <View style={styles.recordItem}>
            <Skeleton width={40} height={18} style={styles.spacerSm} />
            <Skeleton width={50} height={12} />
          </View>
          <View style={styles.recordItem}>
            <Skeleton width={40} height={18} style={styles.spacerSm} />
            <Skeleton width={50} height={12} />
          </View>
        </View>
        <Skeleton width="100%" height={6} style={styles.spacer} />
        <Skeleton width="70%" height={12} />
      </View>
    </Card>
  );

  const renderMatchSkeleton = () => (
    <Card elevation="sm" style={style} contentStyle={styles.content}>
      <Skeleton height={4} borderRadius={0} style={styles.spacerSm} />
      <View style={styles.matchContent}>
        <Skeleton width={80} height={80} borderRadius={sizes.borderRadius.md} />
        <View style={styles.matchInfo}>
          <Skeleton width="80%" height={18} style={styles.spacerSm} />
          <Skeleton width="40%" height={14} style={styles.spacerSm} />
          <Skeleton width="60%" height={16} style={styles.spacerSm} />
          <Skeleton width="50%" height={14} />
        </View>
      </View>
    </Card>
  );

  const renderStatSkeleton = () => (
    <Card elevation="sm" style={style} contentStyle={styles.content}>
      <Skeleton width={40} height={40} borderRadius={sizes.borderRadius.full} style={styles.spacerSm} />
      <Skeleton width="80%" height={24} style={styles.spacerSm} />
      <Skeleton width="60%" height={14} />
    </Card>
  );

  switch (variant) {
    case 'agent':
      return renderAgentSkeleton();
    case 'map':
      return renderMapSkeleton();
    case 'match':
      return renderMatchSkeleton();
    case 'stat':
      return renderStatSkeleton();
    default:
      return renderAgentSkeleton();
  }
};

const styles = StyleSheet.create({
  content: {
    padding: sizes.md,
  },
  image: {
    marginBottom: sizes.md,
  },
  info: {
    flex: 1,
  },
  spacer: {
    marginBottom: sizes.sm,
  },
  spacerSm: {
    marginBottom: sizes.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: sizes.md,
  },
  stat: {
    alignItems: 'center',
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: sizes.md,
  },
  recordItem: {
    alignItems: 'center',
  },
  matchContent: {
    flexDirection: 'row',
    padding: sizes.md,
    gap: sizes.md,
  },
  matchInfo: {
    flex: 1,
  },
});

export default SkeletonCard;
