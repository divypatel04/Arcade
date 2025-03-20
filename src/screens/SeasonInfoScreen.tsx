import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import DropDown from '../components/DropDown';
import { colors, fonts, sizes } from '../theme';
import StatsSummary from '../components/StatsSummary';
import DetailedStats from '../components/DetailedStats';
import { aggregateSeasonStatsForAllActs, convertMillisToReadableTime, getSeasonNames } from '../utils';
import { SeasonStatsType } from '../types/SeasonStatsType';
import { useTranslation } from 'react-i18next';
import { useDataContext } from '../context/DataContext';


const SeasonInfoScreen = () => {

  const {t} = useTranslation();

  const {seasonStats} = useDataContext();

  const seasonName = getSeasonNames(seasonStats);
  const [selectedSeason, setSelectedSeason] = useState(seasonName[1]);
  const [mainSeasonStats, setMainSeasonStats] = useState<SeasonStatsType>();

  useEffect(() => {
    const selectedseason = seasonStats.find(
      (season: SeasonStatsType) => season.season.name === selectedSeason,
    );
    if (selectedseason) {
      setMainSeasonStats(selectedseason);
    } else {
      setMainSeasonStats(aggregateSeasonStatsForAllActs(seasonStats));
    }

  }, [selectedSeason]);

  const firstStats = [
    {
      name: t('common.winRate'),
      value:
        (
          ((mainSeasonStats?.stats.matchesWon ?? 0) /
            ((mainSeasonStats?.stats.matchesWon ?? 0) +
              (mainSeasonStats?.stats.matchesLost ?? 0))) *
          100
        ).toFixed(1) + '%',
    },
    {
      name: t('common.hours'),
      value: convertMillisToReadableTime(mainSeasonStats?.stats.playtimeMillis ?? 0),
    },
    {
      name: t('common.kd'),
      value: ((mainSeasonStats?.stats.kills ?? 0) / (mainSeasonStats?.stats.deaths ?? 0)).toFixed(
        2,
      ),
    },
  ];

  const secondStats = [
    {name: t('common.kills'), value: mainSeasonStats?.stats.kills ?? 0},
    {
      name: t('common.damageR'),
      value: (
        (mainSeasonStats?.stats.damage ?? 0) / (mainSeasonStats?.stats.totalRounds ?? 0)
      ).toFixed(2),
    },
    {name: t('common.plants'), value: mainSeasonStats?.stats.plants ?? 0},
    {name: t('common.aces'), value: mainSeasonStats?.stats.aces ?? 0},
    {name: t('common.firstBlood'), value: mainSeasonStats?.stats.firstKill ?? 0},
    {name: t('common.MVPS'), value: mainSeasonStats?.stats.mvps ?? 0},
  ];

  const barWidth: number =
    ((mainSeasonStats?.stats.matchesWon ?? 0) /
      ((mainSeasonStats?.stats.matchesWon ?? 0) + (mainSeasonStats?.stats.matchesLost ?? 0))) *
    100;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headertitle}>{t('infoScreen.statistics')}</Text>
        <View style={styles.filtersection}>
          <DropDown
            list={seasonName}
            name={t('common.season')}
            value={selectedSeason}
            onSelect={item => setSelectedSeason(item)}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} overScrollMode={'never'}>
        <View style={styles.rankcontainer}>
          <View style={styles.rankdetails}>
            <Image
              style={styles.rankimage}
              source={{uri: 'https://i.imgur.com/1zvz1Zb.png'}}
            />
            <View style={styles.rankmeta}>
              <Text style={styles.rankepisode}>{t('infoScreen.highestRank')}</Text>
              <Text style={styles.ranktitle}>Radiant</Text>
            </View>
          </View>

          <View style={styles.rankprogress}>
            <View>
              <View style={styles.rankprogresscontainer}>
                <View style={[styles.rankbar, {width: `${barWidth}%`}]} />
              </View>
              <View style={styles.rankmetatexts}>
                <Text style={styles.ranktext}>
                  {mainSeasonStats?.stats.matchesWon} {t('common.wins')}
                </Text>
                <Text style={styles.ranktext2}>
                {mainSeasonStats?.stats.matchesLost} {t('common.losses')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <StatsSummary stats={firstStats} />
        <DetailedStats stats={secondStats} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes['2xl'],
    paddingBottom: 0,
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingVertical: sizes['3xl'],
    paddingBottom: 0,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    // marginBottom: sizes.xl,
    color: colors.black,
    letterSpacing: -0.7,
  },
  filtersection: {
    flexDirection: 'row',
    paddingTop: sizes.xl,
    alignItems: 'center',
    marginBottom: sizes.xl,
  },
  rankcontainer: {
    backgroundColor: colors.primary,
    padding: sizes['3xl'],
    marginBottom: sizes['6xl'],
    // elevation: 10,
    // shadowColor: Colors.black,
  },
  rankdetails: {
    paddingHorizontal: sizes.xs,
    flexDirection: 'row',
    paddingTop: sizes.md,
  },
  rankimage: {
    width: '16%',
    aspectRatio: 1 / 1,
    resizeMode: 'center',
  },
  rankmeta: {
    width: '82%',
    justifyContent: 'center',
    paddingLeft: sizes.md,
    // backgroundColor: 'red',
  },
  ranktitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    textTransform: 'lowercase',
    lineHeight: fonts.sizes['5xl'],
    letterSpacing: -0.3,
    color: colors.black,
    textAlignVertical: 'center',
  },
  rankepisode: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  rankprogress: {
    paddingVertical: sizes['13xl'],
    paddingTop: sizes['9xl'],
  },
  rankprogresscontainer: {
    height: sizes.lg,
    backgroundColor: '#3b3d44',
    marginHorizontal: sizes.lg,
    marginBottom: sizes.md,
  },
  rankbar: {
    height: sizes.md,
    backgroundColor: '#717c87',
  },
  rankmetatexts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: sizes.xl,
  },
  ranktext: {
    fontFamily: fonts.family.proximaBold,
    color: colors.black,
    fontSize: fonts.sizes.md + 1,
  },
  ranktext2: {
    fontFamily: fonts.family.proximaBold,
    color: colors.black,
    fontSize: fonts.sizes.md + 1,
  },
});

export default SeasonInfoScreen;
