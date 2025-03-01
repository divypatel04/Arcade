import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import DetailedStats from '../DetailedStats'


interface Stat {
  name: string;
  value: number | string;
}

interface OverviewStats {
  stats1: Stat[] | null,
  stats2: Stat[] | null,
  stats3: Stat[] | null,
}

const OverviewTab = ({stats1,stats2,stats3}:OverviewStats) => {
  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>
      {stats1 && <StatsSummary stats={stats1} />}
      {stats2 && <StatsSummary stats={stats2} />}
      {stats3 && <DetailedStats stats={stats3} />}
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 8,
    flex:1,
  },
});

export default OverviewTab