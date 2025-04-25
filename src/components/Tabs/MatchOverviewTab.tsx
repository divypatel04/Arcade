import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { convertMillisToReadableTime, getSupabaseImageUrl } from '../../utils';
import StatsSummary from '../StatsSummary';
import DetailedStats from '../DetailedStats';
import { MatchStatType } from '../../types/MatchStatsType';

interface MatchOverviewTabProps {
  matchStats: MatchStatType;
}

const MatchOverviewTab = ({matchStats}:MatchOverviewTabProps) => {

  const isWon = matchStats.stats.general.winningTeam === matchStats.stats.playerVsplayerStat.user.teamId;

  const firstStatBoxData = [
    {name: 'Kills', value: String(matchStats.stats.playerVsplayerStat.user.stats.kills)},
    {name: 'Deaths', value: String(matchStats.stats.playerVsplayerStat.user.stats.deaths)},
    {
      name: 'K/D',
      value: String(
        ( matchStats.stats.playerVsplayerStat.user.stats.kills / matchStats.stats.playerVsplayerStat.user.stats.deaths).toFixed(1),
      ),
    },
  ];

  const statBoxTwoData = [
    {
      name: 'Avg.Damage',
      value: String((matchStats.stats.playerVsplayerStat.user.stats.damagePerRound).toFixed(2)),
    },
    {name: 'Aces', value: String(matchStats.stats.playerVsplayerStat.user.stats.aces)},
    {name: 'PlayTime', value: convertMillisToReadableTime(matchStats.stats.playerVsplayerStat.user.stats.playtimeMillis)},
    {name: 'First Blood', value: String(matchStats.stats.playerVsplayerStat.user.stats.firstBloods)},
    {name: 'Assists', value: String(matchStats.stats.playerVsplayerStat.user.stats.assists)},
    {name: 'HS%', value: String((matchStats.stats.playerVsplayerStat.user.stats.headshotPercentage).toFixed(2)) + '%'},
  ];


  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>

        <View style={styles.scoreContainer}>
          <Image
            style={styles.scoreImage}
            source={{
              uri: getSupabaseImageUrl(matchStats.stats.general.agent.image),
            }}
          />
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreSubText}>
              {isWon ? 'Victory' : 'Defeat'}
            </Text>
            <Text
              style={[
                styles.scorePrimaryText,
                {color: isWon ? colors.win : colors.lose},
              ]}>
                {matchStats.stats.playerVsplayerStat.user.stats.roundsWon}-{matchStats.stats.playerVsplayerStat.user.stats.roundsPlayed - matchStats.stats.playerVsplayerStat.user.stats.roundsWon}
            </Text>

          <View style={styles.scoreStats}>
            <Text style={styles.scoreStat}>05/02/2025</Text>
            <Text style={styles.scoreStat}>{matchStats.stats.general.queueId}</Text>
            <Text style={[styles.scoreStat, {color: colors.black}]}>
              Map - {matchStats.stats.general.map.name}
            </Text>
          </View>
        </View>
      </View>

      <StatsSummary stats={firstStatBoxData} />
      <DetailedStats stats={statBoxTwoData} />
    </View>
  )
};


const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['5xl'],
    flex:1,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingLeft: 20,
    marginTop: 30,
    marginBottom: 15,
    position: 'relative',
  },
  scoreMeta: {
    zIndex: 1,
  },
  scoreSubText: {
    paddingTop: 4,
    fontFamily: fonts.family.proximaBold,
    fontSize: 14,
    letterSpacing: -0.3,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  scorePrimaryText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 46,
    lineHeight: 46,
    textTransform: 'uppercase',
    color: colors.win,
  },
  scoreStats: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  scoreStat: {
    color: colors.darkGray,
    fontFamily: fonts.family.proximaBold,
    fontSize: 10,
    letterSpacing: 0.4,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  scoreImage: {
    width: '45%',
    height: 210,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});

export default MatchOverviewTab