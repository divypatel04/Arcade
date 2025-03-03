import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import { colors, fonts, sizes } from '../../theme';
import DropDown from '../DropDown';


type Stats = {
  deaths: number;
  kills: number;
  roundsLost: number;
  roundsWon: number;
}

type AttackDefenseStats = {
  attackStats: Stats | undefined,
  defenceStats: Stats | undefined
};

const SiteTab = ({attackStats, defenceStats}:AttackDefenseStats) => {

  const siteNames = ['Attack','Defence'];
  const [siteStat, setSiteStat] = useState<Stats>();
  const [selectedSite, setSelectedSite] = useState(siteNames[0]);

  const Stats = [
    { name: 'Round Win%', value: String((((siteStat?.roundsWon ?? 0) + (siteStat?.roundsLost ?? 0)) / (siteStat?.roundsWon ?? 0) * 100).toFixed(1)) + '%' },
    { name: 'Atk. Kills', value: String(siteStat?.kills ?? 0) },
    { name: 'Atk. K/D', value: String(((siteStat?.kills ?? 0) / (siteStat?.deaths ?? 1)).toFixed(1)) },
  ];

  const roundWinPercentage = (siteStat?.roundsWon !== undefined && siteStat?.roundsLost !== undefined)
    ? (siteStat?.roundsWon / (siteStat?.roundsWon + siteStat?.roundsLost)) * 100
    : 0;

  useEffect(() => {
    if(selectedSite === 'Attack'){
      setSiteStat(attackStats);
    }else{
      setSiteStat(defenceStats);
    }
  }, [selectedSite]);

  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={siteNames}
            name="Side"
            value={selectedSite}
            onSelect={item => setSelectedSite(item)}
          />
        </View>
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
            {siteStat?.roundsWon} R.Wins
          </Text>
          <Text style={styles.roundResult}>
            {siteStat?.roundsLost} R.Lose
          </Text>
        </View>
      </View>

      <StatsSummary stats={Stats} />
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes.lg,
    flex:1,
  },
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes['8xl'],
    paddingVertical: sizes['6xl'],
    marginBottom: sizes['4xl'],
  },
  dropdowncontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: sizes.lg,
  },
  roundText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md + 1,
    paddingTop: sizes.sm,
    textAlign: 'center',
    paddingBottom: sizes.xs,
    lineHeight: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  progressContainer: {
    height: sizes.lg,
    backgroundColor: colors.lose,
    marginVertical: sizes.md,
  },
  bar: {
    height: sizes.lg,
    backgroundColor: colors.win,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundResult: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.lg,
    paddingTop: sizes.sm,
    paddingBottom: sizes.xs,
    lineHeight: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.black,
  },
});

export default SiteTab