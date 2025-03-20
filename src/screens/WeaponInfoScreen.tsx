import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDown from '../components/DropDown'
import { colors, fonts, sizes } from '../theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SeasonPerformance, WeaponStatType } from '../types/WeaponStatsType';
import { aggregateWeaponStatsForAllActs, getAllWeaponSeasonNames, getSupabaseImageUrl } from '../utils';
import OverviewTab from '../components/Tabs/OverviewTab';
import TabBar from '../components/TabBar';
import HitsTab from '../components/Tabs/HitsTab';
import { useTranslation } from 'react-i18next';

const WeaponInfoScreen = () => {

  const {t} = useTranslation();

  const routeParams: any = useRoute().params;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const weapon: WeaponStatType = routeParams.weapon;
  const selectedSeasonName = routeParams.seasonName;

  const [seasonStat, setSeasonStat] = useState<SeasonPerformance>();
  const seasonNames = getAllWeaponSeasonNames([weapon]);
  const [selectedSeason, setSeason] = useState(selectedSeasonName);

  useEffect(() => {
    const selectedSeasonData = weapon.performanceBySeason.find(
      (season) => season.season.name === selectedSeason,
    );

    if (selectedSeasonData) {
      setSeasonStat(selectedSeasonData);
    } else {
      setSeasonStat(aggregateWeaponStatsForAllActs(weapon));
    }
  }, [selectedSeason]);

  const firstStatBox = [
      { name: t('common.kills'), value: String((seasonStat?.stats.kills ?? 0))},
      { name: t('common.killsR'), value: String(((seasonStat?.stats.kills ?? 0) / (seasonStat?.stats.roundsPlayed ?? 1)).toFixed(2)) },
      { name: t('common.headshots%'), value: String((
        ((seasonStat?.stats.headshots ?? 0) /
          ((seasonStat?.stats.headshots ?? 0) + (seasonStat?.stats?.bodyshots ?? 0) + (seasonStat?.stats?.legshots ?? 0))) *
        100
      ).toFixed(2)) + '%' },
    ];

    const secondStatBox = [
      { name: t('common.damageR'), value: String(((seasonStat?.stats.damage ?? 0) / (seasonStat?.stats?.roundsPlayed ?? 0)).toFixed(2)) },
      { name: t('common.aces'), value: String(seasonStat?.stats.aces ?? 0) },
      { name: t('common.mLose'), value: String(seasonStat?.stats.firstKills ?? 0) },
    ];

  const tabs = [
    { label: t('tabs.overview'), content: <OverviewTab stats1={firstStatBox} stats2={secondStatBox} stats3={null} /> },
    { label: t('tabs.accuracy'), content: <HitsTab stats={seasonStat} /> },

  ];

  return (
   <View style={styles.container}>
    <View style={styles.details}>
      <View style={styles.imagecontainer}>
          <ImageBackground
            style={styles.image}
            source={{ uri: getSupabaseImageUrl(weapon.weapon.image) }}
          />
      </View>
      <View style={styles.meta}>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.goBack()}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={20}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <View style={{marginTop:'auto'}}>
        <Text style={styles.subtext}>{t('common.weapon')}</Text>
        <Text style={styles.title}>{weapon.weapon.name}</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={seasonNames}
            name={t('common.season')}
            value={selectedSeason}
            onSelect={item => setSeason(item)}
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
    bottom:'20%',
    paddingBottom:sizes['6xl'],
    marginRight: sizes['4xl'],
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
});

export default WeaponInfoScreen