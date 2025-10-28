import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import {
  Icon,
  Button,
  StatCard,
  DetailedStats,
  RankBadge,
  CircularProgress,
} from '@components';
import type { StatSection } from '@components';

export const ProfileScreen: React.FC = () => {
  // Mock data
  const userData = {
    username: 'PlayerName',
    tag: 'NA1',
    level: 42,
    profileImage: '',
    rank: 'Diamond 2',
    tier: 2,
    rr: 67,
  };

  const overviewStats = [
    { label: 'Matches', value: 287, icon: 'controller' },
    { label: 'Wins', value: 165, icon: 'trophy', iconColor: colors.success },
    { label: 'Losses', value: 122, icon: 'close', iconColor: colors.error },
    { label: 'Win Rate', value: '57.5%', icon: 'chart-line', iconColor: colors.primary },
  ];

  const detailedStatsSections: StatSection[] = [
    {
      title: 'Combat Stats',
      stats: [
        { label: 'K/D Ratio', value: '1.24', icon: 'target', trend: 'up' },
        { label: 'Avg Kills', value: '18.3', icon: 'skull', trend: 'up' },
        { label: 'Avg Deaths', value: '14.7', icon: 'heart-broken', trend: 'down' },
        { label: 'Avg Assists', value: '7.2', icon: 'hand-heart', trend: 'up' },
        { label: 'HS %', value: '24.8%', icon: 'bullseye', trend: 'neutral' },
        { label: 'First Bloods', value: '142', icon: 'fire', trend: 'up' },
      ],
    },
    {
      title: 'Performance Metrics',
      stats: [
        { label: 'Avg Combat Score', value: '245', icon: 'chart-bar' },
        { label: 'Avg Damage/Round', value: '142', icon: 'lightning-bolt' },
        { label: 'Clutches Won', value: '28', icon: 'trophy-variant' },
        { label: 'Aces', value: '12', icon: 'star' },
        { label: 'Plants', value: '89', icon: 'bomb' },
        { label: 'Defuses', value: '34', icon: 'shield-check' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="account" size={60} color={colors.white} />
              </View>
            )}
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userData.level}</Text>
            </View>
          </View>

          <Text style={styles.username}>
            {userData.username}
            <Text style={styles.tag}>#{userData.tag}</Text>
          </Text>

          <RankBadge
            rank={userData.rank}
            tier={userData.tier}
            rr={userData.rr}
            size="lg"
            showProgress
          />

          <View style={styles.actions}>
            <Button variant="outline" size="md" style={styles.actionButton}>
              Edit Profile
            </Button>
            <Button variant="primary" size="md" style={styles.actionButton}>
              Share
            </Button>
          </View>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            {overviewStats.map((stat, index) => (
              <View key={index} style={styles.overviewStat}>
                <Icon
                  name={stat.icon}
                  size="md"
                  color={stat.iconColor || colors.textSecondary}
                />
                <Text style={styles.overviewValue}>{stat.value}</Text>
                <Text style={styles.overviewLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Win Rate Circle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Season Performance</Text>
          <View style={styles.performanceContainer}>
            <CircularProgress
              progress={57.5}
              size={150}
              strokeWidth={12}
              showPercentage
              label="Win Rate"
              animated
            />
            <View style={styles.performanceStats}>
              <View style={styles.performanceStat}>
                <Text style={[styles.performanceValue, { color: colors.success }]}>
                  165
                </Text>
                <Text style={styles.performanceLabel}>Wins</Text>
              </View>
              <View style={styles.performanceStat}>
                <Text style={[styles.performanceValue, { color: colors.error }]}>
                  122
                </Text>
                <Text style={styles.performanceLabel}>Losses</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Statistics</Text>
          <DetailedStats sections={detailedStatsSections} />
        </View>

        {/* Premium Prompt */}
        <View style={styles.premiumSection}>
          <Icon name="crown" size={48} color={colors.warning} />
          <Text style={styles.premiumTitle}>Unlock Premium Stats</Text>
          <Text style={styles.premiumDescription}>
            Get access to advanced analytics, agent comparisons, and more!
          </Text>
          <Button variant="primary" size="lg" style={styles.premiumButton}>
            Go Premium
          </Button>
        </View>
      </ScrollView>
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
    paddingTop: sizes.xl,
    paddingBottom: sizes.lg,
    paddingHorizontal: sizes.lg,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: sizes.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  levelText: {
    ...fonts.styles.caption,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  username: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  tag: {
    ...fonts.styles.h5,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    marginTop: sizes.lg,
    gap: sizes.md,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.md,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewStat: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    alignItems: 'center',
    marginBottom: sizes.sm,
    ...shadows.sm,
  },
  overviewValue: {
    ...fonts.styles.h4,
    color: colors.textPrimary,
    marginTop: sizes.sm,
  },
  overviewLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  performanceContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...shadows.sm,
  },
  performanceStats: {
    gap: sizes.lg,
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceValue: {
    ...fonts.styles.h4,
    fontWeight: fonts.weights.bold,
  },
  performanceLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  premiumSection: {
    margin: sizes.lg,
    padding: sizes.xl,
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  premiumTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginTop: sizes.md,
    marginBottom: sizes.sm,
  },
  premiumDescription: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sizes.lg,
  },
  premiumButton: {
    width: '100%',
  },
});

export default ProfileScreen;
