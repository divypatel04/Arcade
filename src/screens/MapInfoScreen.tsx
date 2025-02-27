import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDown from '../components/DropDown'
import { colors, fonts, sizes } from '../theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AgentBox from '../components/AgentBox';
import TabBar from '../components/TabBar';
import OverviewTab from '../components/Tabs/OverviewTab';
import SiteTab from '../components/Tabs/SiteTab';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { convertMillisToTime, getMapsSeasonNames } from '../utils';
import { MapStats } from '../data/dummyData';
import { MapStatsType, SeasonPerformance } from '../types/MapStatsType';
import MapHeatmap from '../components/Tabs/MapHeatmap';

const MapInfoScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();
  const routeParams: any = useRoute().params;
  const map: MapStatsType = routeParams.map;
  const selectedSeasonName = routeParams.seasonName;

  const seasonNames = getMapsSeasonNames(MapStats);
  const [seasonStat, setSeasonStat] = useState<SeasonPerformance>();
  const [selectedSeason, setSelectedSeason] = useState(selectedSeasonName);


  useEffect(() => {
      const selectedSeasonData = map.performanceBySeason.find(
        (season) => season.season.name === selectedSeason,
      );

      if (selectedSeasonData) {
        setSeasonStat(selectedSeasonData);
      } else {
        // setSeasonStat(aggregateStatsForAllActs(agent));

      }
    }, [selectedSeason]);

  const firstStatBox = [
      { name: 'Matches', value: String((seasonStat?.stats.matchesWon ?? 0) + (seasonStat?.stats.matchesLost ?? 0)) },
      { name: 'Hours', value: convertMillisToTime(seasonStat?.stats.playtimeMillis ?? 0) },
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
    { label: 'Site Stat', content: <SiteTab attackStats={seasonStat?.attackStats} defenceStats={seasonStat?.defenseStats} /> },
    // { label: 'On Defense', content: <SiteTab stats1={firstStatBoxData} roundwon={50} roundlose={100} /> },
    { label: 'Heatmap', content: <MapHeatmap seasonStats={seasonStat} mapImage={map.map.imageUrl} mapCoordinate={map.map.mapCoordinate} /> },
  ];

  return (
   <View style={styles.container}>
    <View style={styles.details}>
      <View style={styles.imagecontainer}>
          <ImageBackground
            style={styles.image}
            source={{ uri: map.map.imageUrl }}
          />
      </View>
      <View style={styles.meta}>
      <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={20}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <View style={{marginTop:'auto'}}>
        <Text style={styles.subtext}>Map</Text>
        <Text style={styles.title}>{map.map.name}</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={seasonNames}
            name="Act"
            value={selectedSeason}
            onSelect={item => setSelectedSeason(item)}
          />
        </View>
        </View>
      </View>
    </View>
    <View>
      <TabBar tabs={tabs}/>
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
    flexDirection:'row',
    height: 260,
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
    fontSize: fonts.sizes.md+1,
    paddingTop: sizes.md,
    marginBottom: -3,
    lineHeight: fonts.sizes.md+1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
  },
  imagecontainer: {
    width: '60%',
    position: 'absolute',
    right: 0,
    bottom:0,
    paddingBottom:sizes['6xl'],
    alignItems:'flex-end',
  },
  image: {
    width: '90%',
    height: 180,
    resizeMode: 'contain',
  },
});

export default MapInfoScreen