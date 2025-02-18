import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import DetailedStats from '../DetailedStats'
import { colors, fonts } from '../../theme';


interface Stat {
  name: string;
  value: number | string;
}

interface OverviewStats {
  stats1: Stat[],
  roundwon: number,
  roundlose: number
}

const SiteTab = ({stats1,roundwon,roundlose}:OverviewStats) => {

  const roundWinPercentage = (roundwon / (roundwon + roundlose)) * 100;

  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>

      <View style={styles.container}>
        <Text style={styles.roundText}>Rounds</Text>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.bar,
              {width: roundWinPercentage ? `${roundWinPercentage}%` : 0},
            ]}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.roundResult}>
            {roundwon} R.Wins
          </Text>
          <Text style={styles.roundResult}>
            {roundlose} R.Lose
          </Text>
        </View>
      </View>

      <StatsSummary stats={stats1} />
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 8,
    flex:1,
  },
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginBottom: 14,
  },
  roundText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: 13,
    paddingTop: 5,
    textAlign: 'center',
    paddingBottom: 3,
    lineHeight: 13,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.lose,
    marginVertical: 6,
  },
  bar: {
    height: 8,
    backgroundColor: colors.win,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundResult: {
    fontFamily: fonts.family.proximaBold,
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 3,
    lineHeight: 13,
    textTransform: 'uppercase',
    color: colors.black,
  },
});

export default SiteTab