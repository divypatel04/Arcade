import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, sizes } from '../theme';
import { AgentBox, GunBox, MapBox, SeasonBox, BannerAdContainer } from '../components';
import { getCurrentorRecentSeasonStats, getTopAgentByKills, getTopMapByWinRate, getTopWeaponByKills } from '../utils';
import { useDataContext } from '../context/DataContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { AgentStatType, MapStatsType, SeasonStatsType, WeaponStatType } from '../types';


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
      <></>
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
       <BannerAdContainer containerStyle={{ marginHorizontal: sizes.xl }} />
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