import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import DetailedStats from '../DetailedStats'


interface Stat {
  name: string;
  value: string | number;
}

interface OverviewStats {
  stats1: Stat[],
  stats2: Stat[],
  stats3: Stat[],
}

const OverviewTab = ({stats1,stats2,stats3}:OverviewStats) => {
  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>
      <StatsSummary stats={stats1} />
      <StatsSummary stats={stats2} />
      <DetailedStats stats={stats3} />
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 8,
    marginBottom: 100,
    flex:1,
  },
});

export default OverviewTab