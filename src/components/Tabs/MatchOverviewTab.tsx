import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { convertMillisToReadableTime } from '../../utils';
import StatsSummary from '../StatsSummary';
import DetailedStats from '../DetailedStats';
import { MatchStatType } from '../../types/MatchStatType';

interface MatchOverviewTabProps {
  matchStats: MatchStatType;
}

const MatchOverviewTab = ({matchStats}:MatchOverviewTabProps) => {

  const isWon = matchStats.general.winningTeam === matchStats.playerVsplayerStat.user.teamId;

  const firstStatBoxData = [
    {name: 'Kills', value: String(matchStats.playerVsplayerStat.user.stats.kills)},
    {name: 'Deaths', value: String(matchStats.playerVsplayerStat.user.stats.deaths)},
    {
      name: 'K/D',
      value: String(
        ( matchStats.playerVsplayerStat.user.stats.kills / matchStats.playerVsplayerStat.user.stats.deaths).toFixed(1),
      ),
    },
  ];

  const statBoxTwoData = [
    {
      name: 'Avg.Damage',
      value: String(matchStats.playerVsplayerStat.user.stats.damagePerRound),
    },
    {name: 'Aces', value: String(matchStats.playerVsplayerStat.user.stats.aces)},
    {name: 'PlayTime', value: convertMillisToReadableTime(matchStats.playerVsplayerStat.user.stats.playtimeMillis)},
    {name: 'First Blood', value: String(matchStats.playerVsplayerStat.user.stats.firstBloods)},
    {name: 'Assists', value: String(matchStats.playerVsplayerStat.user.stats.assists)},
    {name: 'HS%', value: String(matchStats.playerVsplayerStat.user.stats.headshotPercentage) + '%'},
  ];


  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>

        <View style={styles.scoreContainer}>
          <Image
            style={styles.scoreImage}
            source={{
              uri: matchStats.general.agent.imageUrl,
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
                {matchStats.playerVsplayerStat.user.stats.roundsWon}-{matchStats.playerVsplayerStat.user.stats.roundsPlayed - matchStats.playerVsplayerStat.user.stats.roundsWon}
            </Text>

          <View style={styles.scoreStats}>
            <Text style={styles.scoreStat}>05/02/2025</Text>
            <Text style={styles.scoreStat}>{matchStats.general.queueId}</Text>
            <Text style={[styles.scoreStat, {color: colors.black}]}>
              Map - {matchStats.general.map.name}
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
    paddingTop: sizes['3xl'],
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