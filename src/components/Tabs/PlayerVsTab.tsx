/**
 * Player vs Tab Container
 * Main container for player-vs-player match statistics
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import DropDown from '../DropDown';
import { PlayerVsPlayerStat } from '../../types/MatchStatsType';
import { StatsView } from './PlayerVsTab/StatsView';
import { KillFeedView } from './PlayerVsTab/KillFeedView';
import { HeatmapView } from './PlayerVsTab/HeatmapView';

interface MapDetails {
  id: string;
  name: string;
  location: string;
  image: string;
  mapcoordinates?: {
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
  };
}

interface PlayerVsTabProps {
  pvpStats: PlayerVsPlayerStat;
  map: MapDetails;
}

const PlayerVsTab = ({ pvpStats, map }: PlayerVsTabProps) => {
  const [selectedView, setSelectedView] = useState<'killFeed' | 'stats' | 'heatmap'>(
    'stats'
  );
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(
    pvpStats.enemies.length > 0 ? pvpStats.enemies[0].id : ''
  );

  // Get current opponent data
  const selectedOpponent = pvpStats.enemies.find(
    enemy => enemy.id === selectedOpponentId
  );
  const opponentStats = selectedOpponent?.stats || pvpStats.enemies[0].stats;
  const opponentName = selectedOpponent?.name || pvpStats.enemies[0].name;

  // Get user stats
  const userStats = pvpStats.user.stats;
  const userName = pvpStats.user.name;

  // Get enemy names for dropdown
  const enemyNames = pvpStats.enemies.map(enemy => enemy.name);

  // Filter kill feed to only show events related to the selected opponent and user
  const killFeed = pvpStats.killEvents.filter(
    event =>
      (event.killer === userName && event.victim === opponentName) ||
      (event.killer === opponentName && event.victim === userName)
  );

  // Filter clutch events to only show those relevant to selected opponent and user
  const clutchEvents = pvpStats.clutchEvents.filter(
    event => event.player === userName || event.player === opponentName
  );

  // Get current kill and death locations
  const killLocations = pvpStats.mapData.kills[selectedOpponentId] || [];
  const deathLocations = pvpStats.mapData.deaths[selectedOpponentId] || [];

  // Handle opponent selection change
  const handleOpponentChange = (opponent: string) => {
    const selectedEnemy = pvpStats.enemies.find(enemy => enemy.name === opponent);
    if (selectedEnemy) {
      setSelectedOpponentId(selectedEnemy.id);
    }
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
          style={[
            styles.viewButton,
            selectedView === 'stats' && styles.selectedViewButton
          ]}
          onPress={() => setSelectedView('stats')}
        >
          <Text
            style={[
              styles.viewButtonText,
              selectedView === 'stats' && styles.selectedViewButtonText
            ]}
          >
            Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewButton,
            selectedView === 'killFeed' && styles.selectedViewButton
          ]}
          onPress={() => setSelectedView('killFeed')}
        >
          <Text
            style={[
              styles.viewButtonText,
              selectedView === 'killFeed' && styles.selectedViewButtonText
            ]}
          >
            Kill Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewButton,
            selectedView === 'heatmap' && styles.selectedViewButton
          ]}
          onPress={() => setSelectedView('heatmap')}
        >
          <Text
            style={[
              styles.viewButtonText,
              selectedView === 'heatmap' && styles.selectedViewButtonText
            ]}
          >
            Heatmap
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on selected view */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {selectedView === 'stats' && (
          <StatsView
            userStats={userStats}
            opponentStats={opponentStats}
            clutchEvents={clutchEvents}
          />
        )}

        {selectedView === 'killFeed' && (
          <KillFeedView killFeed={killFeed} userName={userName} />
        )}

        {selectedView === 'heatmap' && (
          <HeatmapView
            killLocations={killLocations}
            deathLocations={deathLocations}
            map={map}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['5xl'],
    flex: 1,
    marginBottom: 10
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '40',
    marginBottom: sizes['3xl'],
    marginTop: sizes.md,
    overflow: 'hidden',
    borderRadius: 0
  },
  viewButton: {
    flex: 1,
    paddingVertical: sizes.xl,
    alignItems: 'center',
    borderRadius: 0
  },
  selectedViewButton: {
    backgroundColor: colors.primary,
    borderRadius: 0
  },
  viewButtonText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray
  },
  selectedViewButtonText: {
    color: colors.black
  },
  contentContainer: {
    flex: 1
  },
  opponentSelectorContainer: {
    flexDirection: 'row',
    marginTop: sizes.md,
    alignItems: 'center',
    paddingBottom: sizes.lg,
    justifyContent: 'flex-end'
  }
});

export default PlayerVsTab;
