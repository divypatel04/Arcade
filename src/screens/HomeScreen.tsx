import { StyleSheet, View, Text, ScrollView } from 'react-native'
import React from 'react'
import { colors, fonts, sizes } from '../theme';
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
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';


const HomeScreen = () => {
  const { t } = useTranslation();
  const { isLoading } = useLanguage();
  const {agentStats, mapStats, weaponStats, seasonStats, matchStats} = useDataContext();

  const bestAgentStats: AgentStatType = getTopAgentByKills(agentStats);
  const bestMapStats: MapStatsType = getTopMapByWinRate(mapStats);
  const bestWeaponStats: WeaponStatType = getTopWeaponByKills(weaponStats);
  const currentSeason = getCurrentorRecentSeasonStats(seasonStats);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}>{t('home.title')}</Text>
        <LanguageSelector compact />
      </View>
      <AgentBox bestAgent={bestAgentStats}/>
      <View style={styles.twoboxcontainer}>
        <MapBox bestMap={bestMapStats} />
        <GunBox bestWeapon={bestWeaponStats}/>
      </View>
      <SeasonBox season={currentSeason}/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  twoboxcontainer: {
    paddingVertical: sizes['3xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: sizes.xl,
    paddingTop: sizes.xl,
    paddingBottom: sizes.sm,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;