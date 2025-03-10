import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { Icon } from '../lcon';
import DropDown from '../DropDown';
import Map from '../Map';

interface KillEvent {
  killer: string;
  victim: string;
  weapon: string;
  headshot: boolean;
  timestamp: string;
  round: number;
}

interface ClutchEvent {
  player: string;
  situation: string; // e.g. "1v3"
  round: number;
  won: boolean;
}

interface PlayerStats {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  firstBloods: number;
  clutchesWon: number;
  clutchAttempts: number;
  headshotPercentage: number;
  damagePerRound: number;
  kdRatio: number;
}

const PlayerVsTab = () => {
  const [selectedView, setSelectedView] = useState<'killFeed' | 'stats' | 'heatmap'>('stats');
  const [heatmapMode, setHeatmapMode] = useState<'kills' | 'deaths'>('kills');

  // Mock data - in a real app, this would come from props or API
  const userStats: PlayerStats = {
    name: "YourName",
    kills: 22,
    deaths: 14,
    assists: 5,
    firstBloods: 3,
    clutchesWon: 2,
    clutchAttempts: 3,
    headshotPercentage: 42,
    damagePerRound: 156,
    kdRatio: 1.57
  };

  const opponentStats: PlayerStats = {
    name: "Opponent",
    kills: 18,
    deaths: 19,
    assists: 8,
    firstBloods: 2,
    clutchesWon: 1,
    clutchAttempts: 4,
    headshotPercentage: 35,
    damagePerRound: 142,
    kdRatio: 0.95
  };

  const killFeed: KillEvent[] = [
    { killer: "YourName", victim: "Enemy1", weapon: "Vandal", headshot: true, timestamp: "1:42", round: 1 },
    { killer: "Enemy2", victim: "YourName", weapon: "Operator", headshot: false, timestamp: "2:15", round: 1 },
    { killer: "YourName", victim: "Enemy2", weapon: "Sheriff", headshot: true, timestamp: "0:35", round: 2 },
    { killer: "YourName", victim: "Enemy3", weapon: "Vandal", headshot: false, timestamp: "1:20", round: 3 },
    { killer: "Enemy4", victim: "YourName", weapon: "Phantom", headshot: true, timestamp: "0:55", round: 4 },
    { killer: "YourName", victim: "Enemy1", weapon: "Vandal", headshot: false, timestamp: "1:05", round: 5 },
    { killer: "YourName", victim: "Enemy4", weapon: "Vandal", headshot: true, timestamp: "1:42", round: 5 },
  ];

  const clutchEvents: ClutchEvent[] = [
    { player: "YourName", situation: "1v2", round: 3, won: true },
    { player: "YourName", situation: "1v3", round: 7, won: true },
    { player: "YourName", situation: "1v2", round: 11, won: false },
    { player: "Opponent", situation: "1v2", round: 15, won: true },
  ];

  // Mock heatmap data - in a real app, this would come from props or API
  const killLocations = [
    { x: 0.3, y: 0.4 },
    { x: 0.5, y: 0.6 },
    { x: 0.7, y: 0.3 },
    { x: 0.4, y: 0.5 },
    { x: 0.6, y: 0.7 },
  ];

  const deathLocations = [
    { x: 0.2, y: 0.8 },
    { x: 0.4, y: 0.2 },
    { x: 0.6, y: 0.4 },
  ];

  // Mock map coordinates - in a real app, this would be specific to the map being displayed
  const mapCoordinates = {
    xMultiplier: 1,
    xScalarToAdd: 0,
    yMultiplier: 1,
    yScalarToAdd: 0,
  };

  // Helper function to determine color based on who is better
  const getComparisonColor = (userValue: number, opponentValue: number) => {
    if (userValue > opponentValue) return colors.win;
    if (userValue < opponentValue) return colors.lose;
    return colors.darkGray;
  };

  // Render a comparison stat row
  const renderStatComparison = (label: string, userValue: number | string, opponentValue: number | string, higherIsBetter = true) => {
    const userColor = typeof userValue === 'number' && typeof opponentValue === 'number'
      ? (higherIsBetter
          ? getComparisonColor(userValue, opponentValue)
          : getComparisonColor(opponentValue, userValue))
      : colors.darkGray;

    const opponentColor = typeof userValue === 'number' && typeof opponentValue === 'number'
      ? (higherIsBetter
          ? getComparisonColor(opponentValue, userValue)
          : getComparisonColor(userValue, opponentValue))
      : colors.darkGray;

    return (
      <View style={styles.statRow}>
        <Text style={[styles.statValue, { color: userColor }]}>{userValue}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: opponentColor }]}>{opponentValue}</Text>
      </View>
    );
  };

  // Render a kill feed entry
  const renderKillFeedItem = ({ item }: { item: KillEvent }) => {
    const isUserKiller = item.killer === userStats.name;
    const isUserVictim = item.victim === userStats.name;

    return (
      <View style={styles.killFeedItem}>
        <View style={styles.killFeedRound}>
          <Text style={styles.roundNumber}>{item.round}</Text>
        </View>

        <View style={styles.killFeedContent}>
          <Text style={[
            styles.killFeedPlayerName,
            isUserKiller ? styles.killFeedUserName : styles.killFeedEnemyName
          ]}>
            {item.killer}
          </Text>

          <View style={styles.killFeedWeaponContainer}>
            <Icon name="sword-line" size={14} color={colors.darkGray} />
            <Text style={styles.killFeedWeapon}>{item.weapon}</Text>
            {item.headshot && <Icon name="crosshairs-fill" size={14} color={colors.lose} style={styles.headshot} />}
          </View>

          <Text style={[
            styles.killFeedPlayerName,
            isUserVictim ? styles.killFeedUserName : styles.killFeedEnemyName
          ]}>
            {item.victim}
          </Text>

          <Text style={styles.killFeedTimestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  // Render clutch events
  const renderClutchItem = ({ item }: { item: ClutchEvent }) => {
    const isUserClutch = item.player === userStats.name;

    return (
      <View style={styles.clutchItem}>
        <View style={styles.clutchRound}>
          <Text style={styles.roundNumber}>{item.round}</Text>
        </View>

        <View style={[
          styles.clutchContent,
          item.won ? styles.clutchWon : styles.clutchLost
        ]}>
          <Text style={[
            styles.clutchPlayerName,
            isUserClutch ? styles.killFeedUserName : styles.killFeedEnemyName
          ]}>
            {item.player}
          </Text>

          <View style={styles.clutchSituation}>
            <Text style={styles.clutchSituationText}>{item.situation}</Text>
            {item.won && <Icon name="trophy-line" size={16} color={colors.win} style={styles.clutchIcon} />}
            {!item.won && <Icon name="close-line" size={16} color={colors.lose} style={styles.clutchIcon} />}
          </View>
        </View>
      </View>
    );
  };

  // Render headshot comparison
  const renderHeadshotComparison = () => {
    return (
      <View style={styles.headshotContainer}>
        <Text style={styles.headshotTitle}>HEADSHOT ACCURACY</Text>

        <View style={styles.headshotComparisonContainer}>
          <View style={styles.headshotPlayerContainer}>
            <Text style={styles.headshotPercentage}>{userStats.headshotPercentage}%</Text>
            <Text style={styles.headshotPlayerName}>{userStats.name}</Text>
            <View style={styles.headshotBarContainer}>
              <View
                style={[
                  styles.headshotBar,
                  { width: `${userStats.headshotPercentage}%`, backgroundColor: colors.win }
                ]}
              />
            </View>
          </View>

          <View style={styles.headshotPlayerContainer}>
            <Text style={styles.headshotPercentage}>{opponentStats.headshotPercentage}%</Text>
            <Text style={styles.headshotPlayerName}>{opponentStats.name}</Text>
            <View style={styles.headshotBarContainer}>
              <View
                style={[
                  styles.headshotBar,
                  { width: `${opponentStats.headshotPercentage}%`, backgroundColor: colors.lose }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.tabContainer}>
      {/* View selector */}
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[styles.viewButton, selectedView === 'stats' && styles.selectedViewButton]}
          onPress={() => setSelectedView('stats')}
        >
          <Text style={[styles.viewButtonText, selectedView === 'stats' && styles.selectedViewButtonText]}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewButton, selectedView === 'killFeed' && styles.selectedViewButton]}
          onPress={() => setSelectedView('killFeed')}
        >
          <Text style={[styles.viewButtonText, selectedView === 'killFeed' && styles.selectedViewButtonText]}>Kill Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewButton, selectedView === 'heatmap' && styles.selectedViewButton]}
          onPress={() => setSelectedView('heatmap')}
        >
          <Text style={[styles.viewButtonText, selectedView === 'heatmap' && styles.selectedViewButtonText]}>Heatmap</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on selected view */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {selectedView === 'stats' && (
          <>
            <View style={styles.playerNamesContainer}>
              <Text style={styles.playerName}>{userStats.name}</Text>
              <Text style={styles.vsText}>vs</Text>
              <Text style={styles.playerName}>{opponentStats.name}</Text>
            </View>

            <View style={styles.statsContainer}>
              {renderStatComparison("K/D RATIO", userStats.kdRatio.toFixed(2), opponentStats.kdRatio.toFixed(2))}
              {renderStatComparison("KILLS", userStats.kills, opponentStats.kills)}
              {renderStatComparison("DEATHS", userStats.deaths, opponentStats.deaths, false)}
              {renderStatComparison("ASSISTS", userStats.assists, opponentStats.assists)}
              {renderStatComparison("FIRST BLOODS", userStats.firstBloods, opponentStats.firstBloods)}
              {renderStatComparison("DAMAGE/ROUND", userStats.damagePerRound, opponentStats.damagePerRound)}
              {renderStatComparison("CLUTCHES", `${userStats.clutchesWon}/${userStats.clutchAttempts}`, `${opponentStats.clutchesWon}/${opponentStats.clutchAttempts}`)}
            </View>

            {renderHeadshotComparison()}

            <View style={styles.clutchListContainer}>
              <Text style={styles.sectionTitle}>CLUTCH MOMENTS</Text>
              {clutchEvents.map((event, index) => (
                <View key={index} style={styles.clutchItem}>
                  <View style={styles.clutchRound}>
                    <Text style={styles.roundNumber}>{event.round}</Text>
                  </View>

                  <View style={[
                    styles.clutchContent,
                    event.won ? styles.clutchWon : styles.clutchLost
                  ]}>
                    <Text style={[
                      styles.clutchPlayerName,
                      event.player === userStats.name ? styles.killFeedUserName : styles.killFeedEnemyName
                    ]}>
                      {event.player}
                    </Text>

                    <View style={styles.clutchSituation}>
                      <Text style={styles.clutchSituationText}>{event.situation}</Text>
                      {event.won && <Icon name="trophy-line" size={16} color={colors.win} style={styles.clutchIcon} />}
                      {!event.won && <Icon name="close-line" size={16} color={colors.lose} style={styles.clutchIcon} />}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedView === 'killFeed' && (
          <View style={styles.killFeedContainer}>
            <Text style={styles.sectionTitle}>KILL FEED</Text>
            <FlatList
              data={killFeed}
              renderItem={renderKillFeedItem}
              keyExtractor={(item, index) => `kill-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedView === 'heatmap' && (
          <View style={styles.heatmapContainer}>
            <View style={styles.heatmapHeader}>
              <Text style={styles.sectionTitle}>PLAYER HEATMAP</Text>
              <View style={styles.heatmapModeSelector}>
                <TouchableOpacity
                  style={[styles.modeButton, heatmapMode === 'kills' && styles.selectedModeButton]}
                  onPress={() => setHeatmapMode('kills')}
                >
                  <Text style={[styles.modeButtonText, heatmapMode === 'kills' && styles.selectedModeButtonText]}>
                    Kills
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modeButton, heatmapMode === 'deaths' && styles.selectedModeButton]}
                  onPress={() => setHeatmapMode('deaths')}
                >
                  <Text style={[styles.modeButtonText, heatmapMode === 'deaths' && styles.selectedModeButtonText]}>
                    Deaths
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heatmapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: 'rgba(0, 34, 255, 0.5)' }]} />
                <Text style={styles.legendText}>Kills</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 0, 0, 0.5)' }]} />
                <Text style={styles.legendText}>Deaths</Text>
              </View>
            </View>

            <Map
              locations={heatmapMode === 'kills' ? killLocations : deathLocations}
              mapImage="https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Ascent.png"
              mapCoordinate={mapCoordinates}
              mode={heatmapMode === 'kills' ? 'Kills' : 'Deaths'}
            />

            <Text style={styles.heatmapDescription}>
              The heatmap shows the locations where you {heatmapMode === 'kills' ? 'eliminated opponents' : 'were eliminated'} during this match.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['3xl'],
    flex: 1,
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '40',
    borderRadius: 8,
    marginBottom: sizes.xl,
    overflow: 'hidden',
  },
  viewButton: {
    flex: 1,
    paddingVertical: sizes.md,
    alignItems: 'center',
  },
  selectedViewButton: {
    backgroundColor: colors.primary,
  },
  viewButtonText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  selectedViewButtonText: {
    color: colors.black,
  },
  contentContainer: {
    flex: 1,
  },
  playerNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes.lg,
    borderRadius: 4,
  },
  playerName: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['4xl'],
    color: colors.black,
  },
  vsText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
  },
  statsContainer: {
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes.lg,
    borderRadius: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray + '20',
  },
  statLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    textAlign: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['3xl'],
    width: 80,
    textAlign: 'center',
  },
  headshotContainer: {
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes.lg,
    borderRadius: 4,
  },
  headshotTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.md,
  },
  headshotComparisonContainer: {
    flexDirection: 'column',
    gap: sizes.xl,
  },
  headshotPlayerContainer: {
    marginBottom: sizes.md,
  },
  headshotPercentage: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['5xl'],
    color: colors.black,
  },
  headshotPlayerName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.sm,
  },
  headshotBarContainer: {
    height: 8,
    backgroundColor: colors.darkGray + '20',
    borderRadius: 4,
  },
  headshotBar: {
    height: 8,
    borderRadius: 4,
  },
  killFeedContainer: {
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes.lg,
    borderRadius: 4,
  },
  killFeedItem: {
    flexDirection: 'row',
    marginBottom: sizes.lg,
  },
  killFeedRound: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.md,
  },
  roundNumber: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.md,
    color: colors.white,
  },
  killFeedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGray + '10',
    padding: sizes.md,
    borderRadius: 4,
  },
  killFeedPlayerName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
    marginRight: sizes.sm,
  },
  killFeedUserName: {
    color: colors.win,
  },
  killFeedEnemyName: {
    color: colors.lose,
  },
  killFeedWeaponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: sizes.md,
  },
  killFeedWeapon: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginLeft: sizes.xs,
  },
  headshot: {
    marginLeft: sizes.xs,
  },
  killFeedTimestamp: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginLeft: 'auto',
  },
  clutchListContainer: {
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes.lg,
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.lg,
  },
  clutchItem: {
    flexDirection: 'row',
    marginBottom: sizes.md,
  },
  clutchRound: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.md,
  },
  clutchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.md,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  clutchWon: {
    backgroundColor: colors.win + '20',
  },
  clutchLost: {
    backgroundColor: colors.lose + '20',
  },
  clutchPlayerName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
  },
  clutchSituation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clutchSituationText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.lg,
    marginRight: sizes.xs,
    color: colors.black,
  },
  clutchIcon: {
    marginLeft: sizes.xs,
  },
  heatmapContainer: {
    padding: sizes.lg,
    marginBottom: sizes.lg,
    borderRadius: 4,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.lg,
    backgroundColor: colors.primary,
    padding: sizes.md,
    borderRadius: 4,
  },
  heatmapModeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.darkGray + '20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  modeButton: {
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
  },
  selectedModeButton: {
    backgroundColor: colors.black,
  },
  modeButtonText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  selectedModeButtonText: {
    color: colors.white,
  },
  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: sizes.md,
    gap: sizes.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: sizes.md,
    height: sizes.md,
    borderRadius: sizes.md / 2,
    marginRight: sizes.xs,
  },
  legendText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  heatmapDescription: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: sizes.md,
    backgroundColor: colors.primary,
    padding: sizes.md,
    borderRadius: 4,
  },
});

export default PlayerVsTab;
