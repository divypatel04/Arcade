import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, sizes } from '../theme';
import AgentBox from '../components/AgentBox';
import MapBox from '../components/MapBox';
import GunBox from '../components/GunBox';
import SeasonBox from '../components/SeasonBox';
import { AgentStats, MapStats } from '../data/dummyData';
import { AgentStatType } from '../types/AgentStatsType';
import { MapStatsType } from '../types/MapStatsType';
import { getTopAgentByKills, getTopMapByWinRate } from '../utils';


const HomeScreen = () => {

  const bestAgentStats: AgentStatType = getTopAgentByKills(AgentStats);
  const bestMapStats: MapStatsType = getTopMapByWinRate(MapStats);

  return (
    <View style={styles.container}>
      <AgentBox bestAgent={bestAgentStats}/>
      <View style={styles.twoboxcontainer}>
        <MapBox bestMap={bestMapStats} />
        <GunBox />
      </View>
      <SeasonBox />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: sizes.xl,
    backgroundColor: colors.white,
  },
  twoboxcontainer: {
    paddingVertical: sizes['3xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen