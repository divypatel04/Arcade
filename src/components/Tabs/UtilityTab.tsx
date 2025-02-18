import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import DetailedStats from '../DetailedStats'


interface Stat {
  name: string;
  value: string | number;
}

interface UtilityStats {
  stats1: Stat[],
  stats2: Stat[],
  stats3: Stat[],
}

const UtilityTab = ({stats1,stats2,stats3}:UtilityStats) => {
  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 8,
    flex:1,
  },
});

export default UtilityStats