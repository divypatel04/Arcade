import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { Icon } from '../lcon';
import DropDown from '../DropDown';
import Map from '../Map';
import { ClutchEvent, KillEvent, PlayerVsPlayerStat } from '../../types/MatchStatType';

interface PlayerVsTabProps {
  pvpStats: PlayerVsPlayerStat;
  map: any
}

const PlayerVsTab = ({pvpStats, map}:PlayerVsTabProps) => {
  const [selectedView, setSelectedView] = useState<'killFeed' | 'stats' | 'heatmap'>('stats');
  const [heatmapMode, setHeatmapMode] = useState<'kills' | 'deaths'>('kills');
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(
    pvpStats.enemies.length > 0 ? pvpStats.enemies[0].id : ""
  );


  // Get current opponent data
  const selectedOpponent = pvpStats.enemies.find(enemy => enemy.id === selectedOpponentId);
  const opponentStats = selectedOpponent?.stats || pvpStats.enemies[0].stats;
  const opponentName = selectedOpponent?.name || pvpStats.enemies[0].name;

  // Get user stats
  const userStats = pvpStats.user.stats;
  const userName = pvpStats.user.name;

  // Get enemy names for dropdown
  const enemyNames = pvpStats.enemies.map(enemy => enemy.name);

  // Filter kill feed to only show events related to the selected opponent and user
  const killFeed = pvpStats.killEvents.filter(event =>
    (event.killer === userName && event.victim === opponentName) ||
    (event.killer === opponentName && event.victim === userName)
  );

  // Filter clutch events to only show those relevant to selected opponent and user
  const clutchEvents = pvpStats.clutchEvents.filter(event =>
    event.player === userName || event.player === opponentName
  );

  // Get current kill and death locations
  const killLocations = pvpStats.mapData.kills[selectedOpponentId] || [];
  const deathLocations = pvpStats.mapData.deaths[selectedOpponentId] || [];

  // Handle opponent selection change
  const handleOpponentChange = (opponent: string) => {
    // Find the enemy id from the selected name
    const selectedEnemy = pvpStats.enemies.find(enemy => enemy.name === opponent);
    if (selectedEnemy) {
      setSelectedOpponentId(selectedEnemy.id);
    }
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
            {item.headshot && <Icon name="skull-fill" size={14} color={colors.lose} style={styles.headshot} />}
          </View>

          <Text style={[
            styles.killFeedPlayerName,
            isUserVictim ? styles.killFeedUserName : styles.killFeedEnemyName
          ]}>
            {item.victim}
          </Text>

          {/* <Text style={styles.killFeedTimestamp}>{item.timestamp}</Text> */}
        </View>
      </View>
    );
  };

  // Render clutch events
  const renderClutchItem = (event: ClutchEvent, index: number) => {
    const isUserClutch = event.player === userStats.name;

    return (
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
    );
  };

  // Render headshot comparison
  const renderHeadshotComparison = () => {
    return (
      <View style={styles.headshotContainer}>
        <Text style={styles.headshotTitle}>HEADSHOT ACCURACY</Text>

        <View style={styles.headshotComparisonContainer}>
          <View style={styles.headshotPlayerContainer}>
            <Text style={styles.headshotPercentage}>{(userStats.headshotPercentage).toFixed(2)}%</Text>
            <Text style={styles.headshotPlayerName}>{userStats.name}</Text>
            <View style={styles.headshotBarContainer}>
              <View
                style={[
                  styles.headshotBar,
                  { width: `${(userStats.headshotPercentage)}%`, backgroundColor: colors.win }
                ]}
              />
            </View>
          </View>

          <View style={styles.headshotPlayerContainer}>
            <Text style={styles.headshotPercentage}>{(opponentStats.headshotPercentage).toFixed(2)}%</Text>
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
      {/* Opponent Selector */}
      <View style={styles.opponentSelectorContainer}>
        <DropDown
          list={enemyNames}
          name="Opponent"
          value={opponentName}
          onSelect={handleOpponentChange}
        />
      </View>

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
              {renderStatComparison("DAMAGE/ROUND", (userStats.damagePerRound).toFixed(2), (opponentStats.damagePerRound).toFixed(2))}
              {renderStatComparison("CLUTCHES", `${userStats.clutchesWon}/${userStats.clutchAttempts}`, `${opponentStats.clutchesWon}/${opponentStats.clutchAttempts}`)}
            </View>

            {renderHeadshotComparison()}

            {clutchEvents.length > 0 && (
            <View style={styles.clutchListContainer}>
              <Text style={styles.sectionTitle}>CLUTCH MOMENTS</Text>
              {clutchEvents.map((event, index) => renderClutchItem(event, index))}
            </View>
            )}

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
              <Text style={styles.sectionTitle2}>PLAYER HEATMAP</Text>
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
              mapImage={map.image}
              mapCoordinate={map.mapcoordinates}
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
    paddingTop: sizes['5xl'],
    flex: 1,
    marginBottom:10,
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '40',
    marginBottom: sizes['3xl'],
    marginTop: sizes.md,
    overflow: 'hidden',
    borderRadius: 0,
  },
  viewButton: {
    flex: 1,
    paddingVertical: sizes.xl,
    alignItems: 'center',
    borderRadius: 0,
  },
  selectedViewButton: {
    backgroundColor: colors.primary,
    borderRadius: 0,
  },
  viewButtonText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
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
    padding: sizes['2xl'],
    marginBottom: sizes.xl,
  },
  playerName: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['2xl'],
    textTransform: 'lowercase',
    color: colors.black,
  },
  vsText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
  },
  statsContainer: {
    backgroundColor: colors.primary,
    padding: sizes['2xl'],
    marginBottom: sizes.xl,
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
    padding: sizes['3xl'],
    marginBottom: sizes.xl,
  },
  headshotTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.md,
  },
  headshotComparisonContainer: {
    flexDirection: 'column',
    gap: sizes.lg,
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
  },
  headshotBar: {
    height: 8,
  },
  killFeedContainer: {
    backgroundColor: colors.primary,
    padding: sizes['2xl'],
    marginBottom: sizes.lg,
  },
  killFeedItem: {
    flexDirection: 'row',
    marginBottom: sizes.lg,
    alignItems: 'center',
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
    padding: sizes.xl,
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
    padding: sizes['2xl'],
    marginBottom: sizes.xl,
  },
  sectionTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.xl,
  },
  clutchItem: {
    flexDirection: 'row',
    marginBottom: sizes.md,
    alignItems: 'center',
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
    padding: sizes.xl,
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
    fontSize: fonts.sizes.lg,
  },
  clutchSituation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clutchSituationText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.xl,
    lineHeight: fonts.sizes.xl,
    marginRight: sizes.xs,
    color: colors.black,
  },
  clutchIcon: {
    marginLeft: sizes.xs,
  },
  heatmapContainer: {
    marginBottom: sizes.lg,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.lg,
    backgroundColor: colors.primary,
    padding: sizes.lg,
  },
  heatmapModeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.darkGray + '20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  modeButton: {
    paddingVertical: sizes.lg,
    paddingHorizontal: sizes.xl,
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
  },
  opponentSelectorContainer: {
    flexDirection: 'row',
    marginTop: sizes.md,
    alignItems: 'center',
    paddingBottom: sizes.lg,
    justifyContent: 'flex-end',
  },
  sectionTitle2: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
  }
});

export default PlayerVsTab;
