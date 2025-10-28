import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import {
  Icon,
  Button,
  StatCard,
  Dropdown,
  RankBadge,
} from '@components';

interface Player {
  id: string;
  name: string;
  agent: string;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  rank: string;
  rr: number;
  team: 'red' | 'blue';
}

interface Round {
  number: number;
  winner: 'attack' | 'defense';
  type: 'elimination' | 'spike' | 'defuse' | 'time';
  duration: string;
}

export const MatchDetailScreen: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<'all' | 'red' | 'blue'>('all');

  // Mock data
  const matchData = {
    id: '1',
    map: 'Ascent',
    date: '2024-01-15',
    mode: 'Competitive',
    result: 'Victory',
    score: '13-7',
    duration: '42:18',
    redScore: 13,
    blueScore: 7,
  };

  const players: Player[] = [
    // Red Team (Won)
    { id: '1', name: 'You', agent: 'Jett', kills: 24, deaths: 15, assists: 4, score: 5280, rank: 'Immortal 2', rr: 42, team: 'red' },
    { id: '2', name: 'Player2', agent: 'Sage', kills: 18, deaths: 16, assists: 8, score: 4320, rank: 'Immortal 1', rr: 89, team: 'red' },
    { id: '3', name: 'Player3', agent: 'Sova', kills: 16, deaths: 14, assists: 12, score: 4180, rank: 'Diamond 3', rr: 67, team: 'red' },
    { id: '4', name: 'Player4', agent: 'Omen', kills: 14, deaths: 17, assists: 10, score: 3890, rank: 'Diamond 3', rr: 45, team: 'red' },
    { id: '5', name: 'Player5', agent: 'Killjoy', kills: 12, deaths: 18, assists: 6, score: 3420, rank: 'Diamond 2', rr: 78, team: 'red' },
    
    // Blue Team (Lost)
    { id: '6', name: 'Enemy1', agent: 'Reyna', kills: 22, deaths: 18, assists: 3, score: 4890, rank: 'Immortal 1', rr: 56, team: 'blue' },
    { id: '7', name: 'Enemy2', agent: 'Cypher', kills: 15, deaths: 17, assists: 9, score: 3980, rank: 'Diamond 3', rr: 91, team: 'blue' },
    { id: '8', name: 'Enemy3', agent: 'Breach', kills: 13, deaths: 16, assists: 11, score: 3670, rank: 'Diamond 3', rr: 34, team: 'blue' },
    { id: '9', name: 'Enemy4', agent: 'Brimstone', kills: 11, deaths: 18, assists: 7, score: 3280, rank: 'Diamond 2', rr: 62, team: 'blue' },
    { id: '10', name: 'Enemy5', agent: 'Viper', kills: 9, deaths: 15, assists: 5, score: 2840, rank: 'Diamond 2', rr: 28, team: 'blue' },
  ];

  const rounds: Round[] = [
    { number: 1, winner: 'attack', type: 'spike', duration: '1:45' },
    { number: 2, winner: 'defense', type: 'elimination', duration: '1:28' },
    { number: 3, winner: 'attack', type: 'defuse', duration: '2:05' },
    { number: 4, winner: 'attack', type: 'spike', duration: '1:52' },
    { number: 5, winner: 'attack', type: 'elimination', duration: '1:33' },
    { number: 6, winner: 'defense', type: 'defuse', duration: '1:58' },
    { number: 7, winner: 'attack', type: 'spike', duration: '1:47' },
    { number: 8, winner: 'defense', type: 'elimination', duration: '1:41' },
    { number: 9, winner: 'attack', type: 'spike', duration: '1:55' },
    { number: 10, winner: 'defense', type: 'time', duration: '2:00' },
    { number: 11, winner: 'defense', type: 'elimination', duration: '1:36' },
    { number: 12, winner: 'attack', type: 'spike', duration: '1:49' },
    { number: 13, winner: 'attack', type: 'elimination', duration: '1:42' },
    { number: 14, winner: 'defense', type: 'defuse', duration: '1:54' },
    { number: 15, winner: 'attack', type: 'spike', duration: '1:51' },
    { number: 16, winner: 'defense', type: 'elimination', duration: '1:38' },
    { number: 17, winner: 'attack', type: 'spike', duration: '1:46' },
    { number: 18, winner: 'attack', type: 'elimination', duration: '1:35' },
    { number: 19, winner: 'attack', type: 'spike', duration: '1:50' },
    { number: 20, winner: 'attack', type: 'elimination', duration: '1:44' },
  ];

  const teamOptions = [
    { label: 'All Players', value: 'all' },
    { label: 'Red Team', value: 'red' },
    { label: 'Blue Team', value: 'blue' },
  ];

  const filteredPlayers = selectedTeam === 'all' 
    ? players 
    : players.filter(p => p.team === selectedTeam);

  const renderPlayer = ({ item }: { item: Player }) => {
    const kd = item.deaths > 0 ? (item.kills / item.deaths).toFixed(2) : item.kills.toFixed(2);
    const isCurrentUser = item.name === 'You';
    
    return (
      <View style={[
        styles.playerRow,
        isCurrentUser && styles.currentUserRow,
        { borderLeftColor: item.team === 'red' ? colors.error : colors.info },
      ]}>
        <View style={styles.playerLeft}>
          <View style={styles.playerRank}>
            <Text style={styles.playerRankText}>#{players.indexOf(item) + 1}</Text>
          </View>
          
          <View style={styles.playerInfo}>
            <View style={styles.playerNameRow}>
              <Text style={[styles.playerName, isCurrentUser && styles.currentUserName]}>
                {item.name}
              </Text>
              {isCurrentUser && (
                <View style={styles.youBadge}>
                  <Text style={styles.youBadgeText}>YOU</Text>
                </View>
              )}
            </View>
            <Text style={styles.playerAgent}>{item.agent}</Text>
          </View>
        </View>

        <View style={styles.playerStats}>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{item.kills}</Text>
            <Text style={styles.statLabel}>K</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{item.deaths}</Text>
            <Text style={styles.statLabel}>D</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{item.assists}</Text>
            <Text style={styles.statLabel}>A</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{kd}</Text>
            <Text style={styles.statLabel}>K/D</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRound = ({ item }: { item: Round }) => {
    const isWin = (item.number <= 12 && item.winner === 'attack') || 
                  (item.number > 12 && item.winner === 'defense');
    
    return (
      <View style={[
        styles.roundItem,
        { backgroundColor: isWin ? colors.success + '20' : colors.error + '20' },
      ]}>
        <View style={styles.roundNumber}>
          <Text style={styles.roundNumberText}>{item.number}</Text>
        </View>
        <View style={styles.roundInfo}>
          <Icon 
            name={isWin ? 'check-circle' : 'close-circle'} 
            size="sm" 
            color={isWin ? colors.success : colors.error} 
          />
          <Text style={styles.roundType}>{item.type}</Text>
        </View>
        <Text style={styles.roundDuration}>{item.duration}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Match Header */}
        <View style={[
          styles.header,
          { backgroundColor: matchData.result === 'Victory' ? colors.success : colors.error },
        ]}>
          <Text style={styles.resultText}>{matchData.result.toUpperCase()}</Text>
          <Text style={styles.scoreText}>{matchData.score}</Text>
          <View style={styles.headerInfo}>
            <View style={styles.headerInfoItem}>
              <Icon name="map-marker" size="sm" color={colors.white} />
              <Text style={styles.headerInfoText}>{matchData.map}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Icon name="clock-outline" size="sm" color={colors.white} />
              <Text style={styles.headerInfoText}>{matchData.duration}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Icon name="gamepad-variant" size="sm" color={colors.white} />
              <Text style={styles.headerInfoText}>{matchData.mode}</Text>
            </View>
          </View>
        </View>

        {/* Team Filter */}
        <View style={styles.section}>
          <Dropdown
            options={teamOptions}
            selectedValue={selectedTeam}
            onSelect={(value) => setSelectedTeam(value as 'all' | 'red' | 'blue')}
            placeholder="Select Team"
          />
        </View>

        {/* Scoreboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scoreboard</Text>
          <FlatList
            data={filteredPlayers}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Round Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Round Timeline</Text>
          <FlatList
            data={rounds}
            renderItem={renderRound}
            keyExtractor={(item) => item.number.toString()}
            scrollEnabled={false}
            numColumns={5}
            columnWrapperStyle={styles.roundsGrid}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            View Full Details
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
    paddingTop: sizes.xl,
    paddingBottom: sizes.lg,
    paddingHorizontal: sizes.lg,
    alignItems: 'center',
  },
  resultText: {
    ...fonts.styles.h3,
    color: colors.white,
    fontWeight: fonts.weights.bold,
    letterSpacing: 2,
  },
  scoreText: {
    ...fonts.styles.h1,
    color: colors.white,
    fontWeight: fonts.weights.bold,
    marginTop: sizes.sm,
  },
  headerInfo: {
    flexDirection: 'row',
    marginTop: sizes.md,
    gap: sizes.md,
  },
  headerInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  headerInfoText: {
    ...fonts.styles.caption,
    color: colors.white,
  },
  section: {
    padding: sizes.lg,
  },
  sectionTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    marginBottom: sizes.sm,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  currentUserRow: {
    backgroundColor: colors.primary + '15',
    borderLeftColor: colors.primary,
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerRank: {
    width: 32,
    height: 32,
    borderRadius: sizes.borderRadius.full,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.md,
  },
  playerRankText: {
    ...fonts.styles.caption,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
  },
  playerName: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  currentUserName: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  youBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.sm,
    paddingVertical: 2,
    borderRadius: sizes.borderRadius.sm,
  },
  youBadgeText: {
    ...fonts.styles.caption,
    fontSize: 10,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  playerAgent: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  playerStats: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  statColumn: {
    alignItems: 'center',
  },
  statValue: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold,
  },
  statLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  roundsGrid: {
    justifyContent: 'space-between',
    marginBottom: sizes.sm,
  },
  roundItem: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: sizes.borderRadius.md,
    padding: sizes.xs,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  roundNumber: {
    width: 20,
    height: 20,
    borderRadius: sizes.borderRadius.full,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundNumberText: {
    ...fonts.styles.caption,
    fontSize: 10,
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },
  roundInfo: {
    alignItems: 'center',
  },
  roundType: {
    ...fonts.styles.caption,
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roundDuration: {
    ...fonts.styles.caption,
    fontSize: 9,
    color: colors.textPrimary,
  },
  actions: {
    paddingHorizontal: sizes.lg,
    paddingBottom: sizes.xl,
  },
  actionButton: {
    width: '100%',
  },
});

export default MatchDetailScreen;
