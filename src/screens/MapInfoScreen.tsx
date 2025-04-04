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
import { MapStatsType, SeasonPerformance } from '../types/MapStatsType';
import MapHeatmap from '../components/Tabs/MapHeatmap';
import { aggregateMapStatsForAllActs, convertMillisToReadableTime, getAllMapSeasonNames, getSupabaseImageUrl } from '../utils';
import { mapStats } from '../data';
import { useTranslation } from 'react-i18next';

const MapInfoScreen = () => {

  const { t } = useTranslation();

  const navigation = useNavigation<StackNavigationProp<any>>();
  const routeParams: any = useRoute().params;
  const map: MapStatsType = routeParams.map;
  const selectedSeasonName = routeParams.seasonName;

  const seasonNames = getAllMapSeasonNames([map]);
  const [seasonStat, setSeasonStat] = useState<SeasonPerformance>();
  const [selectedSeason, setSelectedSeason] = useState(selectedSeasonName);


  useEffect(() => {
      const selectedSeasonData = map.performanceBySeason.find(
        (season) => season.season.name === selectedSeason,
      );

      if (selectedSeasonData) {
        setSeasonStat(selectedSeasonData);
      } else {
        setSeasonStat(aggregateMapStatsForAllActs(map));

      }
    }, [selectedSeason]);

  const firstStatBox = [
      { name: t('common.matches'), value: String((seasonStat?.stats.matchesWon ?? 0) + (seasonStat?.stats.matchesLost ?? 0)) },
      { name: t('common.hours'), value: convertMillisToReadableTime(seasonStat?.stats.playtimeMillis ?? 0) },
      { name: t('common.winRate'), value: String(((seasonStat?.stats.matchesWon ?? 0)  / ((seasonStat?.stats.matchesWon ?? 0)+ (seasonStat?.stats.matchesLost ?? 0)) * 100).toFixed(1)) + '%' },
    ];

    const secondStatBox = [
      { name: t('common.kills'), value: String(seasonStat?.stats.kills ?? 0) },
      { name: t('common.mWins'), value: String(seasonStat?.stats.matchesWon ?? 0) },
      { name: t('common.mLose'), value: String(seasonStat?.stats.matchesLost ?? 0) },
    ];

    const thridStatBox = [
      { name: t('common.kd'), value: String(((seasonStat?.stats.kills ?? 0) / (seasonStat?.stats.deaths ?? 1)).toFixed(1)) },
      { name: t('common.damageR'), value: String(seasonStat?.stats.deaths) },
      { name: t('common.plants'), value: String(seasonStat?.stats.plants) },
      { name: t('common.aces'), value: String(seasonStat?.stats.aces) },
      { name: t('common.firstBlood'), value: String(seasonStat?.stats.firstKills) },
      { name: t('common.defuses'), value: String(seasonStat?.stats.defuses) },
    ];
  // Move tabs array here so it updates when seasonStat changes
  const tabs = [
    { label: t('tabs.overview'), content: <OverviewTab stats1={firstStatBox} stats2={secondStatBox} stats3={thridStatBox} /> },
    { label: t('tabs.attackDefence'), content: <SiteTab attackStats={seasonStat?.attackStats} defenceStats={seasonStat?.defenseStats} /> },
    { label: t('tabs.mapHeatmap'), content: <MapHeatmap seasonStats={seasonStat} mapImage={map.map.image} mapCoordinate={map.map.mapcoordinates} /> },
  ];

  return (
   <View style={styles.container}>
    <View style={styles.details}>
      <View style={styles.imagecontainer}>
          <ImageBackground
            style={styles.image}
            source={{ uri: getSupabaseImageUrl(map.map.image) }}
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
        <Text style={styles.subtext}>{t('common.map')}</Text>
        <Text style={styles.title}>{map.map.name}</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={seasonNames}
            name={t('common.season')}
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