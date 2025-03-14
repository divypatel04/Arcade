import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDown from '../components/DropDown'
import { colors, fonts, sizes } from '../theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AgentBox from '../components/AgentBox';
import TabBar from '../components/TabBar';
import OverviewTab from '../components/Tabs/OverviewTab';
import SiteTab from '../components/Tabs/SiteTab';
import BestMapTab from '../components/Tabs/BestMapTab';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AgentStatType, SeasonPerformance } from '../types/AgentStatsType';
import { aggregateAgentStatsForAllActs, convertMillisToReadableTime, getAllAgentSeasonNames, mergeUtilitiesAndAbilities } from '../utils';
import UtilityTab from '../components/Tabs/UtilityTab';

const AgentInfoScreen = () => {
  const routeParams: any = useRoute().params;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const agent: AgentStatType = routeParams.agent;
  const selectedSeasonName = routeParams.seasonName;

  const [seasonStat, setSeasonStat] = useState<SeasonPerformance>();

  const seasonNames = getAllAgentSeasonNames([agent]);
  const [selectedSeason, setSeason] = useState(selectedSeasonName);


  useEffect(() => {
    const selectedSeasonData = agent.performanceBySeason.find(
      (season) => season.season.name === selectedSeason,
    );

    if (selectedSeasonData) {
      setSeasonStat(selectedSeasonData);
    } else {
      setSeasonStat(aggregateAgentStatsForAllActs(agent));
    }
  }, [selectedSeason]);


  const firstStatBox = [
    { name: 'Matches', value: String((seasonStat?.stats.matchesWon ?? 0) + (seasonStat?.stats.matchesLost ?? 0)) },
    { name: 'Hours', value: convertMillisToReadableTime(seasonStat?.stats.playtimeMillis ?? 0) },
    { name: 'Win Rate', value: String((((seasonStat?.stats.matchesWon ?? 0) + (seasonStat?.stats.matchesLost ?? 0)) / (seasonStat?.stats.matchesWon ?? 0) * 100).toFixed(1)) + '%' },
  ];

  const secondStatBox = [
    { name: 'Kills', value: String(seasonStat?.stats.kills ?? 0) },
    { name: 'M.Wins', value: String(seasonStat?.stats.matchesWon ?? 0) },
    { name: 'M.Lose', value: String(seasonStat?.stats.matchesLost ?? 0) },
  ];

  const thridStatBox = [
    { name: 'K/D', value: String(((seasonStat?.stats.kills ?? 0) / (seasonStat?.stats.deaths ?? 1)).toFixed(1)) },
    { name: 'Damage/R', value: String(seasonStat?.stats.deaths) },
    { name: 'Plants', value: String(seasonStat?.stats.plants) },
    { name: 'Aces', value: String(seasonStat?.stats.aces) },
    { name: 'First Blood', value: String(seasonStat?.stats.firstKills) },
    { name: 'Defuse', value: String(seasonStat?.stats.defuses) },
  ];

  const tabs = [
    { label: 'Overview', content: <OverviewTab stats1={firstStatBox} stats2={secondStatBox} stats3={thridStatBox} /> },
    { label: 'Site Stat', content: <SiteTab attackStats={seasonStat?.attackStats} defenceStats={seasonStat?.defenseStats} /> },
    { label: 'Best Map', content: <BestMapTab mapList={seasonStat?.mapStats} /> },
    { label: 'Utilities', content: <UtilityTab utilities={seasonStat?.abilityAndUltimateImpact} abilitiesData={agent.agent.abilities} totalRounds={seasonStat?.stats.totalRounds ?? 0} /> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={styles.meta}>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.goBack()}>
            <FontAwesome
              name="angles-left"
              color={colors.darkGray}
              size={18}
              style={styles.backicon}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 'auto', zIndex: 100 }}>
            <Text style={styles.subtext}>Agent</Text>
            <Text style={styles.title}>{agent.agent.name}</Text>
            <View style={styles.dropdowncontainer}>
              <DropDown
                list={seasonNames}
                name="Act"
                value={selectedSeason}
                onSelect={item => setSeason(item)}
              />
            </View>
          </View>
        </View>
        <Image
          style={styles.agentImage}
          source={{uri: agent.agent.imageUrl}}
        />
      </View>
      <View style={styles.tabs}>
        <TabBar tabs={tabs} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  details: {
    height: 260,
    paddingVertical: sizes['2xl'],
    paddingHorizontal: sizes['4xl'],
    position: 'relative',
  },
  meta: {
    height: '100%',
    paddingTop: sizes['3xl'],
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
  title: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['15xl'],
    color: colors.black,
    letterSpacing: -0.9,
    paddingBottom: sizes.md,
    textTransform: 'capitalize',
  },
  subtext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md + 1,
    paddingTop: sizes.md,
    marginBottom: -3,
    lineHeight: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
    zIndex: 100,
  },
  agentImage: {
    width: '60%',
    height: 240,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: -sizes.xl,
    zIndex: 0,
  },
  tabs: {
    zIndex: -1,
    flex: 1,
    backgroundColor: colors.white,
  }
});

export default AgentInfoScreen