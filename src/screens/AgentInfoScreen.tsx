import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { getSeasonNames } from '../utils';
import { AgentStatType, SeasonPerformance } from '../types/AgentStatsType';
import { aggregateStatsForAllActs, convertMillisToTime } from '../utils/agentUtils';
import { AgentStats } from '../data/dummyData';

const AgentInfoScreen = () => {
  const routeParams: any = useRoute().params;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const agent: AgentStatType = routeParams.agent;
  const selectedSeasonName = routeParams.seasonName;

  const [seasonStat, setSeasonStat] = useState<SeasonPerformance>();

  const seasonNames = getSeasonNames([agent]);
  const [selectedSeason, setSeason] = useState(selectedSeasonName);


  useEffect(() => {
    const selectedSeasonData = agent.performanceBySeason.find(
      (season) => season.season.name === selectedSeason,
    );

    if (selectedSeasonData) {
      setSeasonStat(selectedSeasonData);
    } else {
      setSeasonStat(aggregateStatsForAllActs(agent));
    }
  }, [selectedSeason]);


  const firstStatBox = [
    { name: 'Matches', value: (seasonStat?.stats.matchesWon ?? 0) + (seasonStat?.stats.matchesLost ?? 0) },
    { name: 'Hours', value: convertMillisToTime(seasonStat?.stats.playtimeMillis ?? 0) },
    { name: 'Win Rate', value: ((seasonStat?.stats.matchesWon ?? 0) + (seasonStat?.stats.matchesLost ?? 0)) / (seasonStat?.stats.matchesWon ?? 0) * 100 + '%' },
  ];

  const secondStatBox = [
    { name: 'Kills', value: seasonStat?.stats.kills ?? 0 },
    { name: 'M.Wins', value: seasonStat?.stats.matchesWon ?? 0 },
    { name: 'M.Lose', value: seasonStat?.stats.matchesLost ?? 0 },
  ];

  const thridStatBox = [
    { name: 'K/D', value: (seasonStat?.stats.kills ?? 0) / (seasonStat?.stats.deaths ?? 1) },
    { name: 'Damage/R', value: seasonStat?.stats.deaths },
    { name: 'Plants', value: seasonStat?.stats.plants },
    { name: 'Aces', value: seasonStat?.stats.aces },
    { name: 'First Blood', value: seasonStat?.stats.firstKills },
    { name: 'Defuse', value: seasonStat?.stats.defuses },
  ];

  const mapList = [
    {
      mapName: "Ascent",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 15,
      mapLose: 8,
    },
    {
      mapName: "Bind",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 12,
      mapLose: 10,
    },
    {
      mapName: "Haven",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 20,
      mapLose: 5,
    },
    {
      mapName: "Split",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 7,
      mapLose: 14,
    },
    {
      mapName: "Icebox",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 11,
      mapLose: 9,
    }
  ];


  const tabs = [
    { label: 'Overview', content: <OverviewTab stats1={firstStatBox} stats2={secondStatBox} stats3={thridStatBox} /> },
    { label: 'On Attack', content: <SiteTab stats1={firstStatBox} roundwon={50} roundlose={100} /> },
    { label: 'On Defense', content: <SiteTab stats1={firstStatBox} roundwon={50} roundlose={100} /> },
    { label: 'Best Map', content: <BestMapTab mapList={mapList} /> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={styles.imagecontainer}>
          <ImageBackground
            style={styles.image}
            source={require('../assets/images/raze.png')}
          />
        </View>
        <View style={styles.meta}>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.goBack()}>
            <FontAwesome
              name="angles-left"
              color={colors.darkGray}
              size={18}
              style={styles.backicon}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 'auto' }}>
            <Text style={styles.subtext}>Agent</Text>
            <Text style={styles.title}>Raze</Text>
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
    flexDirection: 'row',
    height: 260,
    borderBottomWidth: 0.6,
    borderBottomColor: colors.black,
    paddingVertical: sizes['2xl'],
    paddingHorizontal: sizes['4xl'],
  },
  meta: {
    paddingTop: sizes['3xl'],
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
    zIndex: 1,
  },
  imagecontainer: {
    width: '60%',
    position: 'absolute',
    right: 0,
    marginRight: -sizes.xl,
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
  },
  tabs: {
    flex: 1,
    zIndex: 0
  }
});

export default AgentInfoScreen