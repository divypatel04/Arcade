/**
 * Stats View Component
 * Displays head-to-head statistical comparison between user and opponent
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../../../theme';
import { Icon } from '../../Icon';
import { ClutchEvent } from '../../../types/MatchStatsType';

interface PlayerStats {
  name: string;
  kdRatio: number;
  kills: number;
  deaths: number;
  assists: number;
  firstBloods: number;
  damagePerRound: number;
  clutchesWon: number;
  clutchAttempts: number;
  headshotPercentage: number;
}

interface StatsViewProps {
  userStats: PlayerStats;
  opponentStats: PlayerStats;
  clutchEvents: ClutchEvent[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  userStats,
  opponentStats,
  clutchEvents
}) => {
  // Helper function to determine color based on who is better
  const getComparisonColor = (userValue: number, opponentValue: number) => {
    if (userValue > opponentValue) return colors.win;
    if (userValue < opponentValue) return colors.lose;
    return colors.darkGray;
  };

  // Render a comparison stat row
  const renderStatComparison = (
    label: string,
    userValue: number | string,
    opponentValue: number | string,
    higherIsBetter = true
  ) => {
    const userColor =
      typeof userValue === 'number' && typeof opponentValue === 'number'
        ? higherIsBetter
          ? getComparisonColor(userValue, opponentValue)
          : getComparisonColor(opponentValue, userValue)
        : colors.darkGray;

    const opponentColor =
      typeof userValue === 'number' && typeof opponentValue === 'number'
        ? higherIsBetter
          ? getComparisonColor(opponentValue, userValue)
          : getComparisonColor(userValue, opponentValue)
        : colors.darkGray;

    return (
      <View style={styles.statRow}>
        <Text style={[styles.statValue, { color: userColor }]}>{userValue}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: opponentColor }]}>{opponentValue}</Text>
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
            <Text style={styles.headshotPercentage}>
              {userStats.headshotPercentage.toFixed(2)}%
            </Text>
            <Text style={styles.headshotPlayerName}>{userStats.name}</Text>
            <View style={styles.headshotBarContainer}>
              <View
                style={[
                  styles.headshotBar,
                  {
                    width: `${userStats.headshotPercentage}%`,
                    backgroundColor: colors.win
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.headshotPlayerContainer}>
            <Text style={styles.headshotPercentage}>
              {opponentStats.headshotPercentage.toFixed(2)}%
            </Text>
            <Text style={styles.headshotPlayerName}>{opponentStats.name}</Text>
            <View style={styles.headshotBarContainer}>
              <View
                style={[
                  styles.headshotBar,
                  {
                    width: `${opponentStats.headshotPercentage}%`,
                    backgroundColor: colors.lose
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render clutch events
  const renderClutchItem = (event: ClutchEvent, index: number) => {
    return (
      <View key={index} style={styles.clutchItem}>
        <View style={styles.clutchRound}>
          <Text style={styles.roundNumber}>{event.round}</Text>
        </View>

        <View
          style={[
            styles.clutchContent,
            event.won ? styles.clutchWon : styles.clutchLost
          ]}
        >
          <Text
            style={[
              styles.clutchPlayerName,
              event.player === userStats.name
                ? styles.killFeedUserName
                : styles.killFeedEnemyName
            ]}
          >
            {event.player}
          </Text>

          <View style={styles.clutchSituation}>
            <Text style={styles.clutchSituationText}>{event.situation}</Text>
            {event.won && (
              <Icon
                name="trophy-line"
                size={16}
                color={colors.win}
                style={styles.clutchIcon}
              />
            )}
            {!event.won && (
              <Icon
                name="close-line"
                size={16}
                color={colors.lose}
                style={styles.clutchIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.playerNamesContainer}>
        <Text style={styles.playerName}>{userStats.name}</Text>
        <Text style={styles.vsText}>vs</Text>
        <Text style={styles.playerName}>{opponentStats.name}</Text>
      </View>

      <View style={styles.statsContainer}>
        {renderStatComparison(
          'K/D RATIO',
          userStats.kdRatio.toFixed(2),
          opponentStats.kdRatio.toFixed(2)
        )}
        {renderStatComparison('KILLS', userStats.kills, opponentStats.kills)}
        {renderStatComparison('DEATHS', userStats.deaths, opponentStats.deaths, false)}
        {renderStatComparison('ASSISTS', userStats.assists, opponentStats.assists)}
        {renderStatComparison(
          'FIRST BLOODS',
          userStats.firstBloods,
          opponentStats.firstBloods
        )}
        {renderStatComparison(
          'DAMAGE/ROUND',
          userStats.damagePerRound.toFixed(2),
          opponentStats.damagePerRound.toFixed(2)
        )}
        {renderStatComparison(
          'CLUTCHES',
          `${userStats.clutchesWon}/${userStats.clutchAttempts}`,
          `${opponentStats.clutchesWon}/${opponentStats.clutchAttempts}`
        )}
      </View>

      {renderHeadshotComparison()}

      {clutchEvents.length > 0 && (
        <View style={styles.clutchListContainer}>
          <Text style={styles.sectionTitle}>CLUTCH MOMENTS</Text>
          {clutchEvents.map((event, index) => renderClutchItem(event, index))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  playerNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: sizes['2xl'],
    marginBottom: sizes.xl
  },
  playerName: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['2xl'],
    textTransform: 'lowercase',
    color: colors.black
  },
  vsText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray
  },
  statsContainer: {
    backgroundColor: colors.primary,
    padding: sizes['2xl'],
    marginBottom: sizes.xl
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray + '20'
  },
  statLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    textAlign: 'center',
    flex: 1
  },
  statValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['3xl'],
    width: 80,
    textAlign: 'center'
  },
  headshotContainer: {
    backgroundColor: colors.primary,
    padding: sizes['3xl'],
    marginBottom: sizes.xl
  },
  headshotTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.md
  },
  headshotComparisonContainer: {
    flexDirection: 'column',
    gap: sizes.lg
  },
  headshotPlayerContainer: {
    marginBottom: sizes.md
  },
  headshotPercentage: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['5xl'],
    color: colors.black
  },
  headshotPlayerName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.sm
  },
  headshotBarContainer: {
    height: 8,
    backgroundColor: colors.darkGray + '20'
  },
  headshotBar: {
    height: 8
  },
  clutchListContainer: {
    backgroundColor: colors.primary,
    padding: sizes['2xl'],
    marginBottom: sizes.xl
  },
  sectionTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.xl
  },
  clutchItem: {
    flexDirection: 'row',
    marginBottom: sizes.md,
    alignItems: 'center'
  },
  clutchRound: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.md
  },
  roundNumber: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.md,
    color: colors.white
  },
  clutchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.xl,
    justifyContent: 'space-between'
  },
  clutchWon: {
    backgroundColor: colors.win + '20'
  },
  clutchLost: {
    backgroundColor: colors.lose + '20'
  },
  clutchPlayerName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.lg
  },
  killFeedUserName: {
    color: colors.win
  },
  killFeedEnemyName: {
    color: colors.lose
  },
  clutchSituation: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  clutchSituationText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.xl,
    lineHeight: fonts.sizes.xl,
    marginRight: sizes.xs,
    color: colors.black
  },
  clutchIcon: {
    marginLeft: sizes.xs
  }
});
