import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import {
  AgentBox,
  MapBox,
  GunBox,
  SeasonBox,
  StatCard,
  MatchBox,
  Loading,
  Icon,
} from '@components';

export const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Fetch latest data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Mock data - will be replaced with real data from context/API
  const mockSeasonData = useMemo(() => ({
    seasonName: 'Episode 8: Act 3',
    rank: 'Diamond 2',
    wins: 45,
    losses: 32,
    winRate: 58.4,
    totalMatches: 77,
  }), []);

  const mockAgentData = useMemo(() => ({
    name: 'Jett',
    role: 'Duelist' as const,
    imageUrl: '',
    wins: 23,
    losses: 15,
    winRate: 60.5,
    matchesPlayed: 38,
    kdRatio: 1.34,
  }), []);

  const mockMapData = useMemo(() => ({
    name: 'Ascent',
    imageUrl: '',
    wins: 18,
    losses: 12,
    winRate: 60.0,
  }), []);

  const mockWeaponData = useMemo(() => ({
    name: 'Vandal',
    type: 'Rifle',
    imageUrl: '',
    kills: 892,
    headshotPercentage: 28.5,
    accuracy: 22.3,
  }), []);

  const mockRecentMatches = useMemo(() => [
    {
      id: '1',
      result: 'Win' as const,
      map: 'Ascent',
      score: '13-10',
      agent: 'Jett',
      agentImageUrl: '',
      kills: 24,
      deaths: 18,
      assists: 7,
      date: new Date(),
      mode: 'Competitive',
    },
    {
      id: '2',
      result: 'Loss' as const,
      map: 'Haven',
      score: '11-13',
      agent: 'Reyna',
      agentImageUrl: '',
      kills: 19,
      deaths: 21,
      assists: 4,
      date: new Date(Date.now() - 86400000),
      mode: 'Competitive',
    },
  ], []);

  const handleSeasonPress = useCallback(() => console.log('Season pressed'), []);
  const handleAgentPress = useCallback(() => console.log('Agent pressed'), []);
  const handleMapPress = useCallback(() => console.log('Map pressed'), []);
  const handleWeaponPress = useCallback(() => console.log('Weapon pressed'), []);
  const handleSeeAllPress = useCallback(() => console.log('See all pressed'), []);
  const handleMatchPress = useCallback((matchId: string) => console.log('Match pressed', matchId), []);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
    [refreshing, onRefresh]
  );

  return (
    <View style={styles.container}>
      <View 
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Home screen header. Welcome back, Player#NA1"
      >
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text 
            style={styles.username}
            accessibilityRole="header"
          >
            Player#NA1
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          accessible={true}
          accessibilityLabel="Settings"
          accessibilityRole="button"
          accessibilityHint="Double tap to open settings"
        >
          <Icon name="cog" size="lg" color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        accessibilityLabel="Home screen content"
      >
        {/* Season Stats */}
        <View 
          style={styles.section}
          accessible={true}
          accessibilityLabel="Current season section"
        >
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Current Season
          </Text>
          <SeasonBox {...mockSeasonData} onPress={handleSeasonPress} />
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Matches"
              value={mockSeasonData.totalMatches}
              icon="controller"
              trend="up"
              style={styles.statCard}
            />
            <StatCard
              label="Win Rate"
              value={`${mockSeasonData.winRate}%`}
              icon="trophy"
              iconColor={colors.success}
              style={styles.statCard}
            />
            <StatCard
              label="Best Agent"
              value={mockAgentData.name}
              icon="account"
              style={styles.statCard}
            />
            <StatCard
              label="Best Map"
              value={mockMapData.name}
              icon="map"
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performers</Text>
          <View style={styles.performersGrid}>
            <AgentBox {...mockAgentData} onPress={handleAgentPress} />
            <MapBox {...mockMapData} onPress={handleMapPress} />
            <GunBox {...mockWeaponData} onPress={handleWeaponPress} />
          </View>
        </View>

        {/* Recent Matches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Matches</Text>
            <TouchableOpacity onPress={handleSeeAllPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {mockRecentMatches.map((match) => (
            <MatchBox
              key={match.id}
              mapName={match.map}
              mapImage=""
              agentName={match.agent}
              agentImage={match.agentImageUrl}
              gameMode={match.mode}
              result={match.result.toLowerCase() as 'win' | 'loss' | 'draw'}
              score={match.score}
              kills={match.kills}
              deaths={match.deaths}
              assists={match.assists}
              date={match.date.toLocaleDateString()}
              onPress={() => handleMatchPress(match.id)}
              style={styles.matchBox}
            />
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sizes.lg,
    paddingTop: sizes.xl,
    paddingBottom: sizes.md,
    backgroundColor: colors.surface,
  },
  greeting: {
    ...fonts.styles.body,
    color: colors.textSecondary,
  },
  username: {
    ...fonts.styles.h4,
    color: colors.textPrimary,
    marginTop: sizes.xs,
  },
  settingsButton: {
    padding: sizes.sm,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  seeAllText: {
    ...fonts.styles.body,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -sizes.xs,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: sizes.xs,
    marginBottom: sizes.sm,
  },
  performersGrid: {
    gap: sizes.md,
  },
  matchBox: {
    marginBottom: sizes.sm,
  },
});

export default HomeScreen;
