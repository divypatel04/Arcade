import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { colors, sizes } from '../theme';
import AgentBox from '../components/AgentBox';
import MapBox from '../components/MapBox';
import GunBox from '../components/GunBox';
import SeasonBox from '../components/SeasonBox';
import { AgentStatType } from '../types/AgentStatsType';
import { MapStatsType } from '../types/MapStatsType';
import { getCurrentorRecentSeasonStats, getTopAgentByKills, getTopMapByWinRate } from '../utils';
import { WeaponStatType } from '../types/WeaponStatsType';
import { getTopWeaponByKills } from '../utils/weaponUtils';
import { useDataContext } from '../context/DataContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { SeasonStatsType } from '../types/SeasonStatsType';


const HomeScreen = () => {
  const { t } = useTranslation();
  const { isLoading } = useLanguage();
  const {agentStats, mapStats, weaponStats, seasonStats} = useDataContext();

  const bestAgentStats: AgentStatType = getTopAgentByKills(agentStats);
  const bestMapStats: MapStatsType = getTopMapByWinRate(mapStats);
  const bestWeaponStats: WeaponStatType = getTopWeaponByKills(weaponStats);
  const currentSeason: SeasonStatsType = getCurrentorRecentSeasonStats(seasonStats);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <AgentBox bestAgent={bestAgentStats}/>
       <View style={styles.twoboxcontainer}>
         <MapBox bestMap={bestMapStats} />
         <GunBox bestWeapon={bestWeaponStats}/>
       </View>
       <SeasonBox season={currentSeason}/>
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

export default HomeScreen;